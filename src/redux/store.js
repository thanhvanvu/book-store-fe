import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import storageSession from 'redux-persist/lib/storage/session'

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import counterReducer from '../redux/counter/counterSlice'
import accountReducer from '../redux/account/accountSlice'
import cartsReducer from './cart/cartsSlice'
import announcementSlice from './announcement/announcementSlice'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['account', 'announcement'],
}

const announcementPersistConfig = {
  key: 'announcement', // Unique key for announcementSlice
  storage: storageSession, // Use session storage
}

const rootReducer = combineReducers({
  counter: counterReducer,
  account: accountReducer,
  carts: cartsReducer,
  announcement: persistReducer(announcementPersistConfig, announcementSlice), // Wrap announcementSlice with persistReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

const persistor = persistStore(store)

export { store, persistor }
