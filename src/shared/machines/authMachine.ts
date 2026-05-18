// src/shared/machines/authMachine.ts
import { setup, assign, fromPromise } from 'xstate';
import { loginWithGoogleApi } from '../api/client';
import { userModel, User } from '../../entities/user/model/user';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AuthContext {
  user: User | null;
  error: string | null;
}

type AuthEvent =
  | { type: 'LOGIN_GOOGLE'; token: string }
  | { type: 'LOGOUT' }
  | { type: 'RETRY' };

// ─── Machine ─────────────────────────────────────────────────────────────────

const authMachineConfig = setup({
  types: {
    context: {} as AuthContext,
    events: {} as AuthEvent,
  },

  actors: {
    /**
     * Вызывает API авторизации через Google и сохраняет пользователя локально
     */
    loginWithGoogle: fromPromise(async ({ input }: { input: { token: string } }) => {
      const userData = await loginWithGoogleApi(input.token);

      const user: User = {
        id: userData.googleId || userData._id,
        name: userData.name,
        email: userData.email,
        socialProvider: 'google',
      };

      userModel.save(user);
      return user;
    }),
  },

  actions: {
    clearUser: () => userModel.clear(),

    assignUser: assign({
      user: ({ event }) => (event as any).output as User,
      error: null,
    }),

    assignError: assign({
      error: ({ event }) => {
        const err = (event as any).error;
        return err instanceof Error ? err.message : 'Ошибка авторизации';
      },
    }),
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
    /**
     * checking — проверяем, есть ли сохранённый пользователь при старте
     */
    checking: {
      always: [
        {
          target: 'authenticated',
          guard: 'isAlreadyLoggedIn',
          actions: assign({
            user: () => userModel.load(),
          }),
        },
        { target: 'unauthenticated' },
      ],
    },

    /**
     * unauthenticated — пользователь не вошёл
     */
    unauthenticated: {
      on: {
        LOGIN_GOOGLE: 'loggingIn',
      },
    },

    /**
     * loggingIn — идёт процесс входа через Google
     */
    loggingIn: {
      invoke: {
        src: 'loginWithGoogle',
        input: ({ event }) => ({
          token: (event as Extract<AuthEvent, { type: 'LOGIN_GOOGLE' }>).token,
        }),
        onDone: {
          target: 'authenticated',
          actions: 'assignUser',
        },
        onError: {
          target: 'error',
          actions: 'assignError',
        },
      },
    },

    /**
     * authenticated — пользователь авторизован
     */
    authenticated: {
      on: {
        LOGOUT: {
          target: 'unauthenticated',
          actions: ['clearUser', assign({ user: null, error: null })],
        },
      },
    },

    /**
     * error — ошибка при авторизации
     */
    error: {
      on: {
        LOGIN_GOOGLE: 'loggingIn',
        RETRY: 'unauthenticated',
      },
    },
  },
});