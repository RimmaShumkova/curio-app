import { createMachine, assign, fromPromise } from "xstate";
import { GoogleSignin, User } from "@nativescript/google-signin";

interface AuthContext {
  user: {
    name: string;
    email: string;
    id: string;
  } | null;
  error: any | null;
}

export const authMachine = createMachine({
  id: "auth",
  initial: "unauthorized",
  
  types: {} as {
    context: AuthContext;
    events: { type: "LOGIN" } | { type: "RETRY" };
  },
  
  context: {
    user: null,
    error: null
  },

  states: {
    unauthorized: {
      on: {
        LOGIN: { target: "authorizing" }
      }
    },

    authorizing: {
      invoke: {
        src: fromPromise(async () => {
          const user: User = await GoogleSignin.signIn();
        
          return {
            name: user.displayName || "",
            email: user.email || "",
            id: user.id || ""
          };
        }),
        
        onDone: {
          target: "authorized",
          actions: assign({
            user: ({ event }) => event.output
          })
        },
        
        onError: {
          target: "error",
          actions: assign({
            error: ({ event }) => event.error
          })
        }
      }
    },

    authorized: {},

    error: {
      on: {
        RETRY: { target: "authorizing" }
      }
    }
  }
})