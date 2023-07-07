export const usePageSizeStore = defineStore(
    "pagesize",
    () => {
        // @ts-ignore
        let size = ref(30);
        return {
            size
        };
    },
    {
        persist: process.client && {
            key: "pagesize",
            storage: persistedState.localStorage,
        },
    }
);
