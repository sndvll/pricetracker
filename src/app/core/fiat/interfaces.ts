export interface Currencies {
  [key: string]: number;
}

export interface CurrencyModel {
  baseCurrency: string;
  currencies: Currencies;
}
