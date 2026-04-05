import { configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist'
import financeReducer from './financeSlice'
import { persistStorage } from './persistStorage'

const financePersistConfig = {
  key: 'finance-dashboard',
  storage: persistStorage,
}

const persistedFinanceReducer = persistReducer(financePersistConfig, financeReducer)

export const store = configureStore({
  reducer: {
    finance: persistedFinanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
