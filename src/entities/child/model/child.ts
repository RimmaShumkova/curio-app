import { storage } from '../../../shared/lib/storage';

export interface ChildProfile {
  name: string;
  gender: 'boy' | 'girl' | '';
}

export const childModel = {
  save(profile: ChildProfile): void {
    storage.set('childName', profile.name);
    storage.set('childGender', profile.gender);
  },
  
  load(): ChildProfile {
    return {
      name: storage.get('childName') || '',
      gender: (storage.get('childGender') as 'boy' | 'girl' | '') || ''
    };
  },
  
  clear(): void {
    storage.remove('childName');
    storage.remove('childGender');
  },
  
  hasProfile(): boolean {
    return !!storage.get('childName');
  }
};