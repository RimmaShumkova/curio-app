const API_URL = "http://10.0.2.2:3000/api";
let cachedStories = null;

export const storyModel = {
  async getAll() {
    if (cachedStories) return cachedStories;
    
    try {
      const response = await fetch(`${API_URL}/stories`);
      const stories = await response.json();
      cachedStories = stories;
      return stories;
    } catch (error) {
      console.error("Failed to load stories:", error);
      return [];
    }
  },
  
  async getById(id) {
    const stories = await this.getAll();
    return stories.find(story => story.id === id);
  },
  
  clearCache() {
    cachedStories = null;
  }
};