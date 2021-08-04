import {createAction, props} from '@ngrx/store';
import {AssetList, AssetModel, NewAssetModel2} from '../model';

export enum PriceTrackerActionTypes {

  InitializeStarted = '[trckr] initialization started',
  InitializeDone = '[trckr] initialization done',
  InitializeError = '[trckr] initialization error',

  CreateNewListStarted = '[trckr] create list started',
  CreateNewListDone = '[trckr] create list done',
  CreateNewListError = '[trckr] create list error',

  EditListStarted = '[trckr] edit list started',
  EditListDone = '[trckr] edit list done',

  DeleteListStarted = '[trckr] delete list started',
  DeleteListDone = '[trckr] delete list done',

  AddNewAssetStarted = '[trckr] add asset started',
  AddNewAssetDone = '[trckr] add asset done',
  AddNewAssetError = '[trckr] add asset error',

  EditAssetStarted = '[trckr] edit asset started',
  EditAssetDone = '[trckr] edit asset done',

  DeleteAssetStarted = '[trckr] delete asset started',
  DeleteAssetDone = '[trckr] delete asset done',

  RefreshPricesStarted = '[trckr] refresh prices started',
  RefreshPricesDone = '[trckr] refresh prices done',
  RefreshPricesError = '[trckr] refresh prices error',

  PricePollingStarted = '[trckr] price polling started',
  PricePollingStartedDone = '[trckr] price polling started done',

  PricePollingStopped = '[trckr] price polling stopped',
  PricePollingStoppedDone = '[trckr] price polling stopped done',

}

const initializeStarted = createAction(PriceTrackerActionTypes.InitializeStarted);
const initializeDone = createAction(PriceTrackerActionTypes.InitializeDone, props<{lists: AssetList[]}>());
const initializeError = createAction(PriceTrackerActionTypes.InitializeError, props<{error: any}>())

const createNewList = createAction(PriceTrackerActionTypes.CreateNewListStarted, props<{name: string, asset: NewAssetModel2}>());
const createNewListDone = createAction(PriceTrackerActionTypes.CreateNewListDone, props<{list: AssetList}>());
const createNewListError = createAction(PriceTrackerActionTypes.CreateNewListError, props<{error: any}>())


const editList = createAction(PriceTrackerActionTypes.EditListStarted, props<{name: string, id: string}>());
const editListDone = createAction(PriceTrackerActionTypes.EditListDone, props<{lists: AssetList[]}>());

const deleteList = createAction(PriceTrackerActionTypes.DeleteListStarted, props<{id: string}>());
const deleteListDone = createAction(PriceTrackerActionTypes.DeleteListDone, props<{lists: AssetList[]}>());

const addNewAsset = createAction(PriceTrackerActionTypes.AddNewAssetStarted, props<{listId: string, asset: NewAssetModel2}>());
const addNewAssetDone = createAction(PriceTrackerActionTypes.AddNewAssetDone, props<{lists: AssetList[]}>());
const addNewAssetError = createAction(PriceTrackerActionTypes.AddNewAssetError, props<{error: any}>())

const editAsset = createAction(PriceTrackerActionTypes.EditAssetStarted, props<{asset: AssetModel}>());
const editAssetDone = createAction(PriceTrackerActionTypes.EditAssetDone, props<{lists: AssetList[]}>());

const deleteAsset = createAction(PriceTrackerActionTypes.DeleteAssetStarted, props<{id: string, listId: string}>());
const deleteAssetDone = createAction(PriceTrackerActionTypes.DeleteAssetDone, props<{lists: AssetList[]}>());

const refreshPrices = createAction(PriceTrackerActionTypes.RefreshPricesStarted);
const refreshPricesDone = createAction(PriceTrackerActionTypes.RefreshPricesDone, props<{lists: AssetList[]}>());
const refreshPricesError = createAction(PriceTrackerActionTypes.RefreshPricesError, props<{error: any}>());

const startPricePolling = createAction(PriceTrackerActionTypes.PricePollingStarted);
const startPricePollingDone = createAction(PriceTrackerActionTypes.PricePollingStartedDone);
const stopPricePolling = createAction(PriceTrackerActionTypes.PricePollingStopped);
const stopPricePollingDone = createAction(PriceTrackerActionTypes.PricePollingStoppedDone);

export const PriceTrackerActions = {
  initializeStarted,
  initializeDone,
  initializeError,
  createNewList,
  createNewListDone,
  createNewListError,
  editList,
  editListDone,
  deleteList,
  deleteListDone,
  addNewAsset,
  addNewAssetDone,
  addNewAssetError,
  editAsset,
  editAssetDone,
  deleteAsset,
  deleteAssetDone,
  refreshPrices,
  refreshPricesDone,
  refreshPricesError,
  startPricePolling,
  startPricePollingDone,
  stopPricePolling,
  stopPricePollingDone
}
