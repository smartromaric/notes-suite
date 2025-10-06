import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth/authSlice';
import notesSlice from './notes/notesSlice';
import syncSlice from './sync/syncSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    notes: notesSlice.reducer,
    sync: syncSlice.reducer,
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
