import { createMachine } from "xstate";

export const readingMachine = createMachine({
  id: "reading",
  initial: "idle",
  states: {
    idle: {
      on: { START: "reading" }
    },
    reading: {
      on: { FINISH: "finished" }
    },
    finished: {}
  }
})
