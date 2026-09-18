import { PendingSyncItem } from '@parishak/shared';
import { offlineStorage } from '../services/offlineStorage';
import { mobileApi } from '../services/api';

class SyncStore {
  private queue: PendingSyncItem[] = [];
  private isSyncing: boolean = false;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.refreshQueue();
  }

  public async refreshQueue() {
    this.queue = await offlineStorage.getSyncQueue();
    this.notify();
  }

  public getQueue(): PendingSyncItem[] {
    return this.queue;
  }

  public getPendingCount(): number {
    return this.queue.length;
  }

  public getIsSyncing(): boolean {
    return this.isSyncing;
  }

  public async syncAll(): Promise<{ processed: number; failed: number }> {
    if (this.isSyncing) return { processed: 0, failed: 0 };
    this.isSyncing = true;
    this.notify();

    try {
      const items = await offlineStorage.getSyncQueue();
      const result = await mobileApi.syncOfflineAttempts(items);
      if (result.processedIds?.length) {
        await offlineStorage.removeSyncedItems(result.processedIds);
      }
      await this.refreshQueue();
      return { processed: result.syncedCount, failed: result.failedCount };
    } catch {
      return { processed: 0, failed: this.queue.length };
    } finally {
      this.isSyncing = false;
      this.notify();
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }
}

export const syncStore = new SyncStore();
