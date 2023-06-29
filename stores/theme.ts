export const useThemeStore = defineStore(
  "theme",
  () => {
    let dark = ref(false);
    return {
        dark,
    };
  },
  {
    persist: {
      key: "theme",
      storage: persistedState.localStorage,
    },
  }
);
