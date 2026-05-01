import { storage } from '../../../shared/lib/storage';

export const userModel = {
  save(userData) {
    storage.set('userId', userData.id);
    storage.set('userName', userData.name);
    storage.set('userEmail', userData.email);
    storage.set('socialProvider', userData.socialProvider || 'guest');
    storage.set('childName', userData.childName || '');
    storage.set('childGender', userData.childGender || '');
    storage.set('completedStories', JSON.stringify(userData.completedStories || []));
  },
  
  saveGuest() {
    const guestId = `guest_${Date.now()}`;
    storage.set('userId', guestId);
    storage.set('userName', 'Гость');
    storage.set('socialProvider', 'guest');
    storage.set('completedStories', JSON.stringify([]));
  },
  
  load() {
    const id = storage.get('userId');
    if (!id) return null;
    
    return {
      id,
      name: storage.get('userName') || '',
      email: storage.get('userEmail') || '',
      socialProvider: storage.get('socialProvider'),
      childName: storage.get('childName') || '',
      childGender: storage.get('childGender') || '',
      completedStories: JSON.parse(storage.get('completedStories') || '[]')
    };
  },
  
  async updateChildProfile(childName, childGender) {
    const user = this.load();
    if (!user) return;
    
    storage.set('childName', childName);
    storage.set('childGender', childGender);
    
    // Если не гость - обновляем на сервере
    if (user.socialProvider !== 'guest') {
      try {
        await fetch(`http://10.0.2.2:3000/api/user/${user.id}/child-profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ childName, childGender })
        });
      } catch (error) {
        console.error("Failed to update profile on server:", error);
      }
    }
  },
  
  async addCompletedStory(storyId) {
    const user = this.load();
    if (!user) return;
    
    const completed = user.completedStories;
    if (!completed.includes(storyId)) {
      completed.push(storyId);
      storage.set('completedStories', JSON.stringify(completed));
      
      // Если не гость - обновляем на сервере
      if (user.socialProvider !== 'guest') {
        try {
          await fetch(`http://10.0.2.2:3000/api/user/${user.id}/complete-story`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ storyId })
          });
        } catch (error) {
          console.error("Failed to update completed stories:", error);
        }
      }
    }
  },
  
  clear() {
    storage.remove('userId');
    storage.remove('userName');
    storage.remove('userEmail');
    storage.remove('socialProvider');
    storage.remove('childName');
    storage.remove('childGender');
    storage.remove('completedStories');
  },
  
  isLoggedIn() {
    return !!storage.get('userId');
  }
};