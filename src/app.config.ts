export const AppConfig = {
  database: 'pricetrckr-poc',
  tables: {
    fiat_currency: 'fiat_currency',
    available_crypto: 'available_crypto',
    asset_price: 'asset_price',
    user_assets: 'user_assets',
    user_lists: 'user_lists'
  },
  schema: {
    fiat_currency: '',
    available_crypto: 'id,*name,*symbol',
    asset_price: 'id',
    user_assets: 'id,*list',
    user_lists: 'id'
  }
}
