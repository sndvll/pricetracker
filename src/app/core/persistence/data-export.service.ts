import {Inject, Injectable} from '@angular/core';
import {DexieService, PERSISTENCE_CONFIG_INJECTION_TOKEN, PersistenceConfig} from '@sndvll/core';
import {firstValueFrom, from} from 'rxjs';
import {map} from 'rxjs/operators';
import {CryptoCurrencyService} from '../crypto';
import {FiatCurrencyService} from '../fiat';
import {AssetPrice} from '../model';

export interface ExportedData {
  version: number;
  exportedAt: string;
  tables: {
    [tableName: string]: any[];
  };
}

@Injectable({providedIn: 'root'})
export class DataExportService {

  private tableNames: string[];

  // Tabeller som innehåller användardata (resten är API-cache som kan återskapas)
  private userTables = ['lists'];

  constructor(private dexieService: DexieService,
              private crypto: CryptoCurrencyService,
              @Inject(PERSISTENCE_CONFIG_INJECTION_TOKEN) config: PersistenceConfig) {
    this.tableNames = Object.keys(config.schema);
  }

  /**
   * Exportera enbart användardata — minimalt (inga price-fält).
   * Listor: bara id, name, type. Assets: bara id, name, symbol, quantity, color.
   * Kryptokatalog och valutakurser är API-cache som återskapas.
   */
  public exportToJson() {
    return from(Promise.all(
      this.userTables.map(name =>
        this.dexieService.table(name).toArray()
      )
    )).pipe(
      map(results => {
        const tables: ExportedData['tables'] = {};
        this.userTables.forEach((name, i) => {
          tables[name] = results[i].map((list: any) => ({
            id: list.id,
            name: list.name,
            type: list.type,
            assets: (list.assets || []).map((asset: any) => ({
              id: asset.id,
              name: asset.name,
              symbol: asset.symbol,
              quantity: asset.quantity,
              color: asset.color
            }))
          }));
        });
        const data: ExportedData = {
          version: 2,
          exportedAt: new Date().toISOString(),
          tables
        };
        return JSON.stringify(data, null, 2);
      })
    );
  }

  /**
   * Läs data från en JSON-sträng och skriv till databasen.
   * Rensar befintlig data, hämtar färska priser från CoinGecko
   * och skriver fullständiga objekt med all data på plats.
   */
  public async importFromJson(json: string): Promise<{ imported: number }> {
    const data: ExportedData = JSON.parse(json);
    const version = data.version || 1;

    let total = 0;
    for (const tableName of this.userTables) {
      const rows = data.tables[tableName];
      if (!rows || !rows.length) continue;

      if (version === 1) {
        // gammalt format — spara som det är
        const table = this.dexieService.table(tableName);
        await table.clear();
        await table.bulkAdd(rows);
        total += rows.length;
        continue;
      }

      // version 2+ — samla alla asset-IDs och hämta färska priser
      const allAssetIds: string[] = [];
      for (const list of rows) {
        for (const asset of (list.assets || [])) {
          if (!allAssetIds.includes(asset.id)) {
            allAssetIds.push(asset.id);
          }
        }
      }

      let marketData: AssetPrice[] = [];
      if (allAssetIds.length > 0) {
        try {
          marketData = await firstValueFrom(
            this.crypto.getMarketDataForCoins(allAssetIds, FiatCurrencyService.BaseCurrency)
          );
        } catch (e) {
          console.warn('Kunde inte hämta marknadsdata vid import, använder minimal prisdat', e);
        }
      }

      // Rekonstruera listor med fullständig prisdat
      const reconstructed = rows.map((row: any) => ({
        id: row.id,
        type: row.type,
        name: row.name,
        assets: (row.assets || []).map((asset: any) => {
          const price = marketData.find((p: AssetPrice) => p.id === asset.id) || { id: asset.id };
          return {
            id: asset.id,
            name: asset.name,
            symbol: asset.symbol,
            quantity: asset.quantity,
            color: asset.color,
            listId: row.id,
            price
          };
        }),
        expanded: false,
        order: 0
      }));

      const table = this.dexieService.table(tableName);
      await table.clear();
      await table.bulkAdd(reconstructed);
      total += reconstructed.length;
    }

    return { imported: total };
  }
}
