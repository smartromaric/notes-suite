import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import notesReducer from './notes/notesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
