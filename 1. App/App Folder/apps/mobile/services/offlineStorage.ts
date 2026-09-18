import AsyncStorage from '@react-native-async-storage/async-storage';
import { PendingSyncItem, TrainingModule, UserProfile, Certificate } from '@parishak/shared';

const KEYS = {
  USER: 'parishak_offline_user',
  MODULES: 'parishak_offline_modules',
  CERTIFICATES: 'parishak_offline_certificates',
  SYNC_QUEUE: 'parishak_pending_sync_queue',
  LANGUAGE: 'parishak_app_language'
};

// In-Memory fallback cache ensures 100% crash-free resilience even if native storage is unavailable in testing/Expo Go
const memoryCache = new Map<string, string>();

const safeStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    memoryCache.set(key, value);
    try {
      if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
        await AsyncStorage.setItem(key, value);
      }
    } catch {
      // In-memory fallback is active
    }
  },

  getItem: async (key: string): Promise<string | null> => {
    try {
      if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
        const val = await AsyncStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {
      // In-memory fallback
    }
    return memoryCache.get(key) || null;
  },

  removeItem: async (key: string): Promise<void> => {
    memoryCache.delete(key);
    try {
      if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
        await AsyncStorage.removeItem(key);
      }
    } catch {
      // In-memory fallback
    }
  }
};

export const offlineStorage = {
  // Temporary local profile image storage.
  // Replace with backend/cloud storage when profile image persistence is added to the database.
  saveProfileImage: async (base64Uri: string): Promise<void> => {
    try {
      await safeStorage.setItem('parishak_local_profile_image', base64Uri);
    } catch {
      // Handled silently with in-memory persistence
    }
  },
  getProfileImage: async (): Promise<string | null> => {
    try {
      return await safeStorage.getItem('parishak_local_profile_image');
    } catch {
      return null;
    }
  },
  removeProfileImage: async (): Promise<void> => {
    try {
      await safeStorage.removeItem('parishak_local_profile_image');
    } catch {
      // Handled silently
    }
  },

  // User Profile
  saveUser: async (user: UserProfile) => {
    try {
      await safeStorage.setItem(KEYS.USER, JSON.stringify(user));
    } catch (e) {
      // Handled silently with in-memory persistence
    }
  },
  getUser: async (): Promise<UserProfile | null> => {
    try {
      const data = await safeStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  clearUser: async () => {
    await safeStorage.removeItem(KEYS.USER);
  },

  // Modules Cache (Language-aware)
  saveModules: async (modules: TrainingModule[], lang?: string) => {
    try {
      const activeLang = lang || (await safeStorage.getItem(KEYS.LANGUAGE)) || 'en';
      await safeStorage.setItem(`${KEYS.MODULES}_${activeLang}`, JSON.stringify(modules));
      await safeStorage.setItem(KEYS.MODULES, JSON.stringify(modules));
    } catch (e) {
      // Handled silently with in-memory persistence
    }
  },
  getModules: async (lang?: string): Promise<TrainingModule[]> => {
    try {
      const activeLang = lang || (await safeStorage.getItem(KEYS.LANGUAGE)) || 'en';
      const langSpecific = await safeStorage.getItem(`${KEYS.MODULES}_${activeLang}`);
      if (langSpecific) return JSON.parse(langSpecific);
      const general = await safeStorage.getItem(KEYS.MODULES);
      return general ? JSON.parse(general) : [];
    } catch {
      return [];
    }
  },

  // Vocational Curriculum Cache (Language-aware)
  saveVocationalCurriculum: async (moduleId: string, curriculum: any, lang?: string) => {
    try {
      const activeLang = lang || (await safeStorage.getItem(KEYS.LANGUAGE)) || 'en';
      await safeStorage.setItem(`parishak_offline_curriculum_${moduleId}_${activeLang}`, JSON.stringify(curriculum));
    } catch {
      // In-memory fallback
    }
  },
  getVocationalCurriculum: async (moduleId: string, lang?: string): Promise<any | null> => {
    try {
      const activeLang = lang || (await safeStorage.getItem(KEYS.LANGUAGE)) || 'en';
      const data = await safeStorage.getItem(`parishak_offline_curriculum_${moduleId}_${activeLang}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  // Certificates Cache
  saveCertificates: async (certs: Certificate[]) => {
    try {
      await safeStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(certs));
    } catch (e) {
      // Handled silently with in-memory persistence
    }
  },
  getCertificates: async (): Promise<Certificate[]> => {
    try {
      const data = await safeStorage.getItem(KEYS.CERTIFICATES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // Pending Sync Queue
  getSyncQueue: async (): Promise<PendingSyncItem[]> => {
    try {
      const data = await safeStorage.getItem(KEYS.SYNC_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  addToSyncQueue: async (item: PendingSyncItem) => {
    try {
      const queue = await offlineStorage.getSyncQueue();
      queue.push(item);
      await safeStorage.setItem(KEYS.SYNC_QUEUE, JSON.stringify(queue));
    } catch (e) {
      // Handled silently
    }
  },
  removeSyncedItems: async (processedIds: string[]) => {
    try {
      const queue = await offlineStorage.getSyncQueue();
      const remaining = queue.filter((i) => !processedIds.includes(i.id));
      await safeStorage.setItem(KEYS.SYNC_QUEUE, JSON.stringify(remaining));
    } catch (e) {
      // Handled silently
    }
  },
  clearSyncQueue: async () => {
    await safeStorage.removeItem(KEYS.SYNC_QUEUE);
  },
  clearAuth: async () => {
    await safeStorage.removeItem(KEYS.USER);
  },

  // Language Preference
  saveLanguage: async (lang: string) => {
    await safeStorage.setItem(KEYS.LANGUAGE, lang);
  },
  getLanguage: async (): Promise<string | null> => {
    return safeStorage.getItem(KEYS.LANGUAGE);
  },

  // Progress Tracker
  saveProgress: async (moduleId: string, percentage: number) => {
    try {
      await safeStorage.setItem(`parishak_progress_${moduleId}`, JSON.stringify({ percentage, updatedAt: Date.now() }));
    } catch {
      // In-memory fallback
    }
  },

  // Vocational Learning Platform Module-Specific Progress (User specific)
  saveVocationalProgress: async (userId: string, moduleId: string, progress: any) => {
    try {
      const key = `parishak_vocational_progress_${userId || 'guest'}_${moduleId}`;
      await safeStorage.setItem(key, JSON.stringify(progress));
    } catch {
      // Handled safely
    }
  },
  getVocationalProgress: async (userId: string, moduleId: string): Promise<any | null> => {
    try {
      const key = `parishak_vocational_progress_${userId || 'guest'}_${moduleId}`;
      const data = await safeStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
};
