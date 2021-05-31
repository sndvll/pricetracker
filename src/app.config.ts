export const AppConfig = {
  database: 'pricetrckr-poc',
  tables: {
    fiat_currency: 'fiat_currency',
    available_crypto: 'available_crypto'
  },
  schema: {
    fiat_currency: '',
    available_crypto: 'id,*name,*symbol'
  }
}
