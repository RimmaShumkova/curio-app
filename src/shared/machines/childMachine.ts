import { createMachine } from "xstate";

export const childMachine = createMachine({
  id: "child",
  initial: "empty",
  states: {
    empty: {
      on: { START_FILL: "filling" }
    },
    filling: {
      on: { SAVE: "saved" }
    },
    saved: {}
  }
})
