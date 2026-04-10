import { setup, assign } from "xstate";
import { childModel, type ChildProfile } from "../../entities/child/model/child";

interface ChildContext {
  profile: ChildProfile;
  isSaved: boolean;
}

export const childMachine = setup({
  types: {
    context: {} as ChildContext,
    events: {} as 
      | { type: "UPDATE_NAME"; name: string }
      | { type: "UPDATE_GENDER"; gender: "boy" | "girl" }
      | { type: "SAVE" }
      | { type: "RESET" }
      | { type: "LOAD" }
  },
  actions: {
    updateName: assign({
      profile: ({ context, event }) => ({ ...context.profile, name: (event as any).name })
    }),
    updateGender: assign({
      profile: ({ context, event }) => ({ ...context.profile, gender: (event as any).gender })
    }),
    saveProfile: assign({
      isSaved: true
    }),
    resetSaved: assign({
      isSaved: false
    }),
    loadProfile: assign({
      profile: () => childModel.load()
    })
  }
}).createMachine({
  id: "child",
  initial: "loading",
  context: {
    profile: { name: "", gender: "" },
    isSaved: false
  },
  states: {
    loading: {
      entry: "loadProfile",
      always: { target: "editing" }
    },
    editing: {
      on: {
        UPDATE_NAME: { actions: "updateName" },
        UPDATE_GENDER: { actions: "updateGender" },
        SAVE: {
          target: "saving",
          actions: "saveProfile"
        }
      }
    },
    saving: {
      entry: ({ context }) => {
        childModel.save(context.profile);
      },
      always: { target: "saved" }
    },
    saved: {
      on: {
        RESET: {
          target: "editing",
          actions: "resetSaved"
        },
        LOAD: {
          target: "loading"
        }
      }
    }
  }
});