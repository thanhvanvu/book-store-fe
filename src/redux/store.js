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

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import counterReducer from '../redux/counter/counterSlice'
import accountReducer from '../redux/account/accountSlice'
import cartsReducer from './cart/cartsSlice'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['account'],
}

const rootReducer = combineReducers({
  counter: counterReducer,
  account: accountReducer,
  carts: cartsReducer,
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
