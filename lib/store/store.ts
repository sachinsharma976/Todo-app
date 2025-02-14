import { configureStore } from '@reduxjs/toolkit';
import { todosApi } from './services/todos';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage
import { combineReducers } from '@reduxjs/toolkit';

// Define the persist configuration
const persistConfig = {
  key: 'root', // Key for the persisted state
  storage, // Storage mechanism (localStorage by default)
  whitelist: ['todos'], // Only persist the 'todos' slice of state
};

// Combine your reducers
const rootReducer = combineReducers({
  [todosApi.reducerPath]: todosApi.reducer,
  // Add other reducers here if needed
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // Ignore redux-persist actions
      },
    }).concat(todosApi.middleware),
});

// Create a persistor for the store
export const persistor = persistStore(store);

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;