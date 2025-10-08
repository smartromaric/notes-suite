import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as Network from 'expo-network';

// Types
interface SyncQueueItem {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  tableName: string;
  recordId: number;
  data: any;
  createdAt: string;
}

interface SyncState {
  isOffline: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  syncQueue: SyncQueueItem[];
  error: string | null;
}

// Thunks
export const checkNetworkStatus = createAsyncThunk(
  'sync/checkNetworkStatus',
  async () => {
    const state = await Network.getNetworkStateAsync();
    return state.isConnected;
  }
);

export const syncToServer = createAsyncThunk(
  'sync/syncToServer',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { sync: SyncState };
      const pendingItems = state.sync.syncQueue;
      
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear the queue after successful sync
      return pendingItems.map(item => item.id);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Sync failed');
    }
  }
);

// Initial state
const initialState: SyncState = {
  isOffline: false,
  isSyncing: false,
  lastSyncTime: null,
  syncQueue: [],
  error: null,
};

// Slice
const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setOfflineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLastSyncTime: (state, action: PayloadAction<string>) => {
      state.lastSyncTime = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkNetworkStatus.fulfilled, (state, action) => {
        state.isOffline = !action.payload;
      })
      .addCase(syncToServer.pending, (state) => {
        state.isSyncing = true;
        state.error = null;
      })
      .addCase(syncToServer.fulfilled, (state, action) => {
        state.isSyncing = false;
        state.lastSyncTime = new Date().toISOString();
        state.syncQueue = state.syncQueue.filter(item => !action.payload.includes(item.id));
        state.error = null;
      })
      .addCase(syncToServer.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.payload as string;
      });
  },
});

export const { setOfflineStatus, clearError, setLastSyncTime } = syncSlice.actions;
export default syncSlice;
