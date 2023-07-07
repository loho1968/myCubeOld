export const usePageSizeStore = defineStore(
    "pageSize",
    () => {
        // @ts-ignore
        let size = ref(30);
        return {
            size
        };
    },
    {
        persist: process.client && {
            key: "pageSize",
            storage: persistedState.localStorage,
        },
    }
);
