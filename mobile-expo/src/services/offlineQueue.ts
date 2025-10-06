import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OfflineAction {
  id: string;
  type: 'CREATE_NOTE' | 'UPDATE_NOTE' | 'DELETE_NOTE' | 'SHARE_NOTE' | 'SHARE_PUBLIC';
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

const QUEUE_KEY = 'offline_queue';

class OfflineQueue {
  private queue: OfflineAction[] = [];
  private isProcessing = false;

  async init() {
    try {
      const storedQueue = await AsyncStorage.getItem(QUEUE_KEY);
      if (storedQueue) {
        this.queue = JSON.parse(storedQueue);
        console.log(`📋 Loaded ${this.queue.length} offline actions from storage`);
      }
    } catch (error) {
      console.error('❌ Failed to load offline queue:', error);
    }
  }

  async addAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>) {
    const offlineAction: OfflineAction = {
      ...action,
      id: `${action.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: 3,
    };

    this.queue.push(offlineAction);
    await this.saveQueue();
    
    console.log(`📝 Added offline action: ${action.type}`, offlineAction.id);
    return offlineAction.id;
  }

  async removeAction(actionId: string) {
    this.queue = this.queue.filter(action => action.id !== actionId);
    await this.saveQueue();
    console.log(`🗑️ Removed offline action: ${actionId}`);
  }

  async getQueue(): Promise<OfflineAction[]> {
    return [...this.queue];
  }

  async clearQueue() {
    this.queue = [];
    await this.saveQueue();
    console.log('🧹 Cleared offline queue');
  }

  async processQueue(processAction: (action: OfflineAction) => Promise<boolean>) {
    if (this.isProcessing) {
      console.log('⏳ Queue is already being processed');
      return;
    }

    this.isProcessing = true;
    console.log(`🔄 Processing ${this.queue.length} offline actions...`);

    const actionsToProcess = [...this.queue];
    const successfulActions: string[] = [];
    const failedActions: OfflineAction[] = [];

    for (const action of actionsToProcess) {
      try {
        console.log(`🔄 Processing action: ${action.type} (${action.id})`);
        const success = await processAction(action);
        
        if (success) {
          successfulActions.push(action.id);
          console.log(`✅ Action completed: ${action.type} (${action.id})`);
        } else {
          action.retryCount++;
          if (action.retryCount >= action.maxRetries) {
            console.log(`❌ Action failed permanently: ${action.type} (${action.id})`);
            failedActions.push(action);
          } else {
            console.log(`🔄 Action will retry: ${action.type} (${action.id}) - attempt ${action.retryCount + 1}`);
            failedActions.push(action);
          }
        }
      } catch (error) {
        console.error(`❌ Error processing action ${action.type} (${action.id}):`, error);
        action.retryCount++;
        if (action.retryCount >= action.maxRetries) {
          failedActions.push(action);
        } else {
          failedActions.push(action);
        }
      }
    }

    // Remove successful actions and update failed ones
    this.queue = failedActions;
    await this.saveQueue();

    this.isProcessing = false;
    console.log(`✅ Queue processing complete. ${successfulActions.length} successful, ${failedActions.length} failed/retrying`);
  }

  private async saveQueue() {
    try {
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('❌ Failed to save offline queue:', error);
    }
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  isQueueEmpty(): boolean {
    return this.queue.length === 0;
  }
}

export const offlineQueue = new OfflineQueue();
