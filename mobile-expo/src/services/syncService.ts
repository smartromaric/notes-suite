import { offlineQueue, OfflineAction } from './offlineQueue';
import api from './api';

export interface SyncStatus {
  isSyncing: boolean;
  lastSync: Date | null;
  pendingActions: number;
  error: string | null;
}

class SyncService {
  private syncStatus: SyncStatus = {
    isSyncing: false,
    lastSync: null,
    pendingActions: 0,
    error: null,
  };

  private listeners: ((status: SyncStatus) => void)[] = [];

  async init() {
    await offlineQueue.init();
    this.updatePendingActions();
  }

  addListener(listener: (status: SyncStatus) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.syncStatus));
  }

  private updatePendingActions() {
    this.syncStatus.pendingActions = offlineQueue.getQueueLength();
    this.notifyListeners();
  }

  async sync() {
    if (this.syncStatus.isSyncing) {
      console.log('⏳ Sync already in progress');
      return;
    }

    this.syncStatus.isSyncing = true;
    this.syncStatus.error = null;
    this.notifyListeners();

    try {
      console.log('🔄 Starting sync...');
      
      await offlineQueue.processQueue(async (action) => {
        return await this.processAction(action);
      });

      this.syncStatus.lastSync = new Date();
      this.syncStatus.isSyncing = false;
      this.updatePendingActions();
      
      console.log('✅ Sync completed successfully');
    } catch (error) {
      console.error('❌ Sync failed:', error);
      this.syncStatus.error = error instanceof Error ? error.message : 'Sync failed';
      this.syncStatus.isSyncing = false;
    }

    this.notifyListeners();
  }

  private async processAction(action: OfflineAction): Promise<boolean> {
    try {
      switch (action.type) {
        case 'CREATE_NOTE':
          return await this.syncCreateNote(action.data);
        case 'UPDATE_NOTE':
          return await this.syncUpdateNote(action.data);
        case 'DELETE_NOTE':
          return await this.syncDeleteNote(action.data);
        case 'SHARE_NOTE':
          return await this.syncShareNote(action.data);
        case 'SHARE_PUBLIC':
          return await this.syncSharePublic(action.data);
        default:
          console.warn(`Unknown action type: ${action.type}`);
          return false;
      }
    } catch (error) {
      console.error(`Error processing action ${action.type}:`, error);
      return false;
    }
  }

  private async syncCreateNote(data: any): Promise<boolean> {
    try {
      const response = await api.post('/notes', data);
      console.log('✅ Note created on server:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Failed to create note on server:', error);
      return false;
    }
  }

  private async syncUpdateNote(data: any): Promise<boolean> {
    try {
      const { id, ...updateData } = data;
      const response = await api.put(`/notes/${id}`, updateData);
      console.log('✅ Note updated on server:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Failed to update note on server:', error);
      return false;
    }
  }

  private async syncDeleteNote(data: any): Promise<boolean> {
    try {
      await api.delete(`/notes/${data.id}`);
      console.log('✅ Note deleted on server:', data.id);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete note on server:', error);
      return false;
    }
  }

  private async syncShareNote(data: any): Promise<boolean> {
    try {
      const response = await api.post(`/notes/${data.noteId}/share/user?email=${data.email}`);
      console.log('✅ Note shared on server:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Failed to share note on server:', error);
      return false;
    }
  }

  private async syncSharePublic(data: any): Promise<boolean> {
    try {
      const response = await api.post(`/notes/${data.noteId}/share/public`);
      console.log('✅ Public link created on server:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Failed to create public link on server:', error);
      return false;
    }
  }

  async addOfflineAction(type: OfflineAction['type'], data: any) {
    await offlineQueue.addAction({ type, data });
    this.updatePendingActions();
  }

  getStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  async clearOfflineQueue() {
    await offlineQueue.clearQueue();
    this.updatePendingActions();
  }
}

export const syncService = new SyncService();
