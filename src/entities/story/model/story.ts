export interface Episode {
  id: number;
  text: string;
  imageUrl: string;
}

export interface Story {
  id: string;
  title: string;
  coverImage: string;
  isLocked: boolean;
  episodes: Episode[];
}

export const mockStories: Story[] = [
  {
    id: '1',
    title: 'Друзья собирают ягоды',
    coverImage: 'res://berries_kids',
    isLocked: false,
    episodes: [
      { id: 1, text: 'Ма-ша и Ми-ша по-шли в лес.', imageUrl: 'res://forest' },
      { id: 2, text: 'О-ни у-ви-де-ли мно-го я-год.', imageUrl: 'res://berries' },
      { id: 3, text: 'Де-ти на-бра-ли пол-ны-е кор-зин-ки.', imageUrl: 'res://basket' }
    ]
  },
  {
    id: '2',
    title: 'Кьюрио в саду',
    coverImage: 'res://curio_garden',
    isLocked: false,
    episodes: [
      { id: 1, text: 'Кью-ри-о про-снул-ся ут-ром.', imageUrl: 'res://morning' },
      { id: 2, text: 'Он по-шёл в сад по-ли-вать цве-ты.', imageUrl: 'res://garden' },
      { id: 3, text: 'В са-ду бы-ло мно-го кра-си-вых цве-тов.', imageUrl: 'res://flowers' }
    ]
  },
  {
    id: '3',
    title: 'Кьюрио в саду',
    coverImage: 'res://curio_garden_locked',
    isLocked: true,
    episodes: []
  }
];

export const storyModel = {
  getAll(): Story[] {
    return mockStories;
  },
  
  getById(id: string): Story | undefined {
    return mockStories.find(story => story.id === id);
  },
  
  unlockStory(id: string): void {
    const story = mockStories.find(s => s.id === id);
    if (story) {
      story.isLocked = false;
    }
  }
};