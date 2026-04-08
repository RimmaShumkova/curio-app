import { storage } from '../../../shared/lib/storage';

export interface User {
  id: string;
  name: string;
  email: string;
  socialProvider: 'google' | 'apple' | null;
}

export const userModel = {
  save(user: User): void {
    storage.set('userId', user.id);
    storage.set('userName', user.name);
    storage.set('userEmail', user.email);
    storage.set('socialProvider', user.socialProvider || '');
  },
  
  load(): User | null {
    const id = storage.get('userId');
    if (!id) return null;
    
    return {
      id,
      name: storage.get('userName') || '',
      email: storage.get('userEmail') || '',
      socialProvider: storage.get('socialProvider') as 'google' | 'apple' | null
    };
  },
  
  clear(): void {
    storage.remove('userId');
    storage.remove('userName');
    storage.remove('userEmail');
    storage.remove('socialProvider');
  },
  
  isLoggedIn(): boolean {
    return !!storage.get('userId');
  }
};