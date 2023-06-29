import { CFOP,BlindFormula,BlindFormulaGroup,BlindFormulaCode } from "@prisma/client";
export const useFormulaStore = defineStore(
  "formula",
  () => {
      // @ts-ignore
      const  cfop: CFOP = ref(null), blindFormula: BlindFormula = ref(null),bindFormulaGroup: BlindFormulaGroup = ref(null),blindFormulaCode: BlindFormulaCode = ref(null)
      return {
          cfop,blindFormula,bindFormulaGroup,blindFormulaCode
    };
  },
  {
    persist: process.client && {
      key: "formula",
      storage: persistedState.localStorage,
    },
  }
);
