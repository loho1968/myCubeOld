import { PrismaClient } from "@prisma/client";
// @ts-ignore

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
  // @ts-ignore
  const blindFormula = await prisma.blindFormula.findMany({}).catch((error) => {
    console.error(error);
    return { code: 500, msg: error.msg };
  });

  // @ts-ignore
  const cfop = await prisma.CFOP.findMany({}).catch((error) => {
    console.error(error);
    return { code: 500, msg: error.msg };
  });
  // @ts-ignore
  const blindFormulaGroup = await prisma.blindFormulaGroup
    .findMany({})
    .catch((error) => {
      console.error(error);
      return { code: 500, msg: error.msg };
    });
  // @ts-ignore
  const blindFormulaCode = await prisma.blindFormulaCode
    .findMany({})
    .catch((error) => {
      console.error(error);
      return { code: 500, msg: error.msg };
    });
  return {
    code: 200,
    blindFormula: blindFormula,
    cfop: cfop,
    blindFormulaGroup: blindFormulaGroup,
    blindFormulaCode: blindFormulaCode,
  };
});
