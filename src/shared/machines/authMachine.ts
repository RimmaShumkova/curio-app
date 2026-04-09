import { createMachine, assign, fromPromise } from "xstate";
import { GoogleSignin } from "@nativescript/google-signin";

// Типы для контекста
interface AuthContext {
  user: {
    name: string;
    email: string;
    id: string;
  } | null;
  error: any | null;
}

// Типы для событий
type AuthEvent = 
  | { type: "LOGIN" }
  | { type: "RETRY" };

export const authMachine = createMachine({
  id: "auth",
  initial: "unauthorized",
  
  types: {} as {
    context: AuthContext;
    events: AuthEvent;
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
          const result = await GoogleSignin.signIn();
          
          return {
            name: result.displayName || "",
            email: result.email || "",
            id: result.id || ""
          };
        }),
        
        onDone: {
          target: "authorized",
          actions: assign({
            user: ({ event }: { event: any }) => event.output
          })
        },
        
        onError: {
          target: "error",
          actions: assign({
            error: ({ event }: { event: any }) => event.error
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
