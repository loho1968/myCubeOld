export const useRowStore = defineStore(
  "row",
  () => {
    // @ts-ignore
    const row = ref("");
    const page = ref(1);
    return {
      row,
      page,
    };
  },
  {
    persist: process.client && {
      key: "row",
      storage: persistedState.localStorage,
    },
  }
);
