export const usePageStore = defineStore(
    "page",
    () => {
        // @ts-ignore
        let currentPage = ref(1);
        return {
            currentPage
        };
    },
    {
        persist: process.client && {
            key: "page",
            storage: persistedState.localStorage,
        },
    }
);
