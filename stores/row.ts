export const useRowStore = defineStore(
  "row",
  () => {
    // @ts-ignore
    let currentRow = ref({});
    return {
        currentRow,
    };
  },
  {
    persist: process.client && {
      key: "row",
      storage: persistedState.localStorage,
    },
  }
);
