import {Currencies} from '../fiat';

export interface CoinGeckoSimpleRateApiResponse {
  [coin: string]: {
    [baseCurrency: string]: number;
  }
}

export interface CoinGeckoRateApiResponse {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: {
      [baseCurrency: string]: number;
    }
  }

}

export interface FiatCurrencyResponse {
  data: {
    [key: string]: Currencies;
  }
}
