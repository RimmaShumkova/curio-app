import { createMachine, assign } from "xstate";

export const storiesMachine = createMachine({
  id: "stories",
  initial: "idle",
  context: {
    stories: [],
    error: null
  },
  states: {
    idle: {
      on: { LOAD: "loading" }
    },

    loading: {
      invoke: {
        src: "fetchStories",
        onDone: {
          target: "success",
          actions: assign({
            stories: (_, e) => e.data
          })
        },
        onError: {
          target: "error",
          actions: assign({
            error: (_, e) => e.data
          })
        }
      }
    },

    success: {},
    error: {}
  }
})
