import {Inject, Injectable} from '@angular/core';
import {DexieService, PERSISTENCE_CONFIG_INJECTION_TOKEN, PersistenceConfig} from '@sndvll/core';
import {PersistenceConfig as AppPersistenceConfig} from '../../app.module';
import {from} from 'rxjs';
import {map} from 'rxjs/operators';

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
              @Inject(PERSISTENCE_CONFIG_INJECTION_TOKEN) config: PersistenceConfig) {
    this.tableNames = Object.keys(config.schema);
  }

  /**
   * Exportera enbart användardata (lists).
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
          tables[name] = results[i];
        });
        const data: ExportedData = {
          version: 1,
          exportedAt: new Date().toISOString(),
          tables
        };
        return JSON.stringify(data, null, 2);
      })
    );
  }

  /**
   * Läs data från en JSON-sträng och skriv till databasen.
   * Rensar befintlig data först.
   */
  public async importFromJson(json: string): Promise<{ imported: number }> {
    const data: ExportedData = JSON.parse(json);

    let total = 0;
    for (const tableName of this.userTables) {
      const rows = data.tables[tableName];
      if (!rows || !rows.length) continue;

      const table = this.dexieService.table(tableName);
      await table.clear();
      await table.bulkAdd(rows);
      total += rows.length;
    }

    return { imported: total };
  }
}
