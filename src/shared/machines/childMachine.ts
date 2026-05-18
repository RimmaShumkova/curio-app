// src/shared/machines/childMachine.ts
import { setup, assign } from 'xstate';
import { childModel, ChildProfile } from '../../entities/child/model/child';
import { db } from '../lib/database';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChildContext {
  profile: ChildProfile | null;
  error: string | null;
}

type ChildEvent =
  | { type: 'SAVE'; profile: ChildProfile }
  | { type: 'CLEAR' }
  | { type: 'RELOAD' };

// ─── Machine ─────────────────────────────────────────────────────────────────

const childMachineConfig = setup({
  types: {
    context: {} as ChildContext,
    events: {} as ChildEvent,
  },

  actions: {
    saveProfile: ({ event }) => {
      const profile = (event as Extract<ChildEvent, { type: 'SAVE' }>).profile;
      // Сохраняем сразу в оба слоя (legacy + db)
      childModel.save(profile);
      db.saveChild(profile);
    },

    assignProfile: assign({
      profile: ({ event }) =>
        (event as Extract<ChildEvent, { type: 'SAVE' }>).profile,
      error: null,
    }),

    clearProfile: () => {
      childModel.clear();
      db.clearChild();
    },

    loadProfile: assign({
      profile: () => db.getChild() ?? childModel.load(),
    }),
  },

  guards: {
    hasExistingProfile: () =>
      childModel.hasProfile() || db.getChild() !== null,
  },
});

export const childMachine = childMachineConfig.createMachine({
  id: 'child',
  initial: 'checking',

  context: {
    profile: null,
    error: null,
  },

  states: {
    /**
     * checking — проверяем наличие профиля при инициализации
     */
    checking: {
      always: [
        {
          target: 'hasProfile',
          guard: 'hasExistingProfile',
          actions: assign({
            profile: () => db.getChild() ?? childModel.load(),
          }),
        },
        { target: 'noProfile' },
      ],
    },

    /**
     * noProfile — профиль не создан, предлагаем заполнить
     */
    noProfile: {
      on: {
        SAVE: {
          target: 'hasProfile',
          actions: ['saveProfile', 'assignProfile'],
        },
      },
    },

    /**
     * hasProfile — профиль ребёнка существует
     */
    hasProfile: {
      on: {
        SAVE: {
          // Обновление существующего профиля (остаёмся в том же состоянии)
          actions: ['saveProfile', 'assignProfile'],
        },
        CLEAR: {
          target: 'noProfile',
          actions: [
            'clearProfile',
            assign({ profile: null, error: null }),
          ],
        },
        RELOAD: {
          actions: 'loadProfile',
        },
      },
    },
  },
});