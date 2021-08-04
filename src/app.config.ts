export const AppConfig = {
  database: 'pricetrckr',
  tables: {
    fiat_currency: 'fiat_currency',
    available_crypto: 'available_crypto',
    lists: 'lists'
  },
  schema: {
    fiat_currency: '',
    available_crypto: 'id,*name,*symbol',
    lists: 'id'
  }
}
