import { setup, fromPromise, assign } from "xstate";
import { GoogleSignin } from "@nativescript/google-signin";
import { userModel } from "../../entities/user/model/user";

interface AuthContext {
  user: {
    name: string;
    email: string;
    id: string;
  } | null;
  errorMessage: string | null;
}

// Актор для входа через Google
const googleLoginActor = fromPromise(async () => {
  const result = await GoogleSignin.signIn();
  return {
    name: result.displayName || "",
    email: result.email || "",
    id: result.id || ""
  };
});

export const authMachine = setup({
  types: {
    context: {} as AuthContext,
    events: {} as { type: "LOGIN" } | { type: "RETRY" }
  },
  actors: {
    googleLogin: googleLoginActor
  },
  actions: {
    setUser: assign({
      user: ({ event }) => (event as any).output,
      errorMessage: null
    }),
    setError: assign({
      errorMessage: ({ event }) => (event as any).error?.message || "Ошибка входа"
    }),
    saveUser: ({ context }) => {
      if (context.user) {
        userModel.save({
          id: context.user.id,
          name: context.user.name,
          email: context.user.email,
          socialProvider: "google"
        });
      }
    }
  }
}).createMachine({
  id: "auth",
  initial: "unauthorized",
  context: {
    user: null,
    errorMessage: null
  },
  states: {
    unauthorized: {
      on: { LOGIN: "authorizing" }
    },
    authorizing: {
      invoke: {
        src: "googleLogin",
        onDone: {
          target: "authorized",
          actions: ["setUser", "saveUser"]
        },
        onError: {
          target: "error",
          actions: "setError"
        }
      }
    },
    authorized: {
      type: "final"
    },
    error: {
      on: { 
        RETRY: "authorizing",
        LOGIN: "authorizing"
      }
    }
  }
});