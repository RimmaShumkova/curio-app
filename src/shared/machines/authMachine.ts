// src/shared/machines/authMachine.ts
//
// XState v5 использует AbortController внутри fromPromise,
// которого нет в NativeScript. Поэтому API-вызов делается
// снаружи (в Welcome.vue), а машина получает готового пользователя
// через событие LOGIN_SUCCESS.

import { setup, assign } from 'xstate';
import { userModel, User } from '../../entities/user/model/user';
import { db } from '../lib/database';

interface AuthContext {
  user: User | null;
  error: string | null;
}

type AuthEvent =
  | { type: 'LOGIN_SUCCESS'; user: User }
  | { type: 'LOGIN_ERROR'; error: string }
  | { type: 'LOGOUT' };

const authMachineConfig = setup({
  types: {
    context: {} as AuthContext,
    events: {} as AuthEvent,
  },

  actions: {
    assignUser: assign({
      user: ({ event }) => (event as Extract<AuthEvent, { type: 'LOGIN_SUCCESS' }>).user,
      error: null,
    }),

    assignError: assign({
      error: ({ event }) => (event as Extract<AuthEvent, { type: 'LOGIN_ERROR' }>).error,
    }),

    clearUser: () => {
      userModel.clear();
      db.clearUser();
    },
  },

  guards: {
    isAlreadyLoggedIn: () => userModel.isLoggedIn(),
  },
});

export const authMachine = authMachineConfig.createMachine({
  id: 'auth',
  initial: 'checking',

  context: {
    user: null,
    error: null,
  },

  states: {
    // Проверяем локальное хранилище при старте
    checking: {
      always: [
        {
          target: 'authenticated',
          guard: 'isAlreadyLoggedIn',
          actions: assign({ user: () => userModel.load() }),
        },
        { target: 'unauthenticated' },
      ],
    },

    unauthenticated: {
      on: {
        LOGIN_SUCCESS: { target: 'authenticated', actions: 'assignUser' },
        LOGIN_ERROR:   { target: 'error',         actions: 'assignError' },
      },
    },

    authenticated: {
      on: {
        LOGOUT: {
          target: 'unauthenticated',
          actions: ['clearUser', assign({ user: null, error: null })],
        },
      },
    },

    error: {
      on: {
        LOGIN_SUCCESS: { target: 'authenticated', actions: 'assignUser' },
      },
    },
  },
});