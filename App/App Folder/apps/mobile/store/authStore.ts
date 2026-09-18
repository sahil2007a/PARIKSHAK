import { UserProfile } from '@parishak/shared';
import { offlineStorage } from '../services/offlineStorage';
import { mobileApi } from '../services/api';

class AuthStore {
  private user: UserProfile | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private async init() {
    this.user = await offlineStorage.getUser();
    this.notify();
  }

  public getUser(): UserProfile | null {
    return this.user;
  }

  public setUser(user: UserProfile | null) {
    this.user = user;
    if (user) {
      offlineStorage.saveUser(user);
    } else {
      offlineStorage.clearUser();
      mobileApi.clearTokens();
    }
    this.notify();
  }

  public isAuthenticated(): boolean {
    return !!this.user;
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }
}

export const authStore = new AuthStore();
