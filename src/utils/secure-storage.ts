import { security } from './security';

enum EStorageType {
    LOCAL = 'local',
    SESSION = 'session',
}

/**
 * Secure Storage Utility
 * - Uses IllegibleName for key obfuscation (prod only)
 * - Uses AES encryption for values (prod only)
 * - Can be used anywhere (stores, services, components)
 */
class SecureStorage {
    private storageType: EStorageType;

    constructor(type: EStorageType) {
        this.storageType = type;
    }

    private getStorage(): Storage | null {
        if (typeof window === 'undefined') return null;
        return this.storageType === EStorageType.LOCAL ? localStorage : sessionStorage;
    }

    private getSecureKey(key: string): string {
        return security.IllegibleName(key);
    }

    /**
     * Set item in storage with optional encryption
     */
    setItem<T>(key: string, value: T): void {
        const storage = this.getStorage();
        if (!storage) return;

        try {
            const secureKey = this.getSecureKey(key);
            const encryptedValue = security.AES.encrypt(value);
            storage.setItem(secureKey, encryptedValue);
        } catch (error) {
            console.error('[SecureStorage] Error setting item:', error);
        }
    }

    /**
     * Get item from storage with decryption
     */
    getItem<T>(key: string): T | null {
        const storage = this.getStorage();
        if (!storage) return null;

        try {
            const secureKey = this.getSecureKey(key);
            const encryptedValue = storage.getItem(secureKey);
            if (!encryptedValue) return null;

            const decryptedValue = security.AES.decrypt<T>(encryptedValue);
            return decryptedValue;
        } catch (error) {
            console.error('[SecureStorage] Error getting item:', error);
            return null;
        }
    }

    /**
     * Remove item from storage
     */
    removeItem(key: string): void {
        const storage = this.getStorage();
        if (!storage) return;

        try {
            const secureKey = this.getSecureKey(key);
            storage.removeItem(secureKey);
        } catch (error) {
            console.error('[SecureStorage] Error removing item:', error);
        }
    }

    /**
     * Clear all items from storage
     */
    clear(): void {
        const storage = this.getStorage();
        if (!storage) return;

        try {
            storage.clear();
        } catch (error) {
            console.error('[SecureStorage] Error clearing storage:', error);
        }
    }

    /**
     * Check if key exists in storage
     */
    hasItem(key: string): boolean {
        const storage = this.getStorage();
        if (!storage) return false;

        const secureKey = this.getSecureKey(key);
        return storage.getItem(secureKey) !== null;
    }
}

export const secureLocalStorage = new SecureStorage(EStorageType.LOCAL);
export const secureSessionStorage = new SecureStorage(EStorageType.SESSION);

