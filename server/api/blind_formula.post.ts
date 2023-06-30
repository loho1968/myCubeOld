import { PrismaClient,BlindFormula } from '@prisma/client';
// @ts-ignore


const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
    // @ts-ignore
    const blindFormula: BlindFormula = await readBody(event);
    console.log(blindFormula);
    const update = await prisma.blindFormula
      .update({
        where: { FormulaKey: blindFormula.FormulaKey },
        data: blindFormula,
      })
      .catch((error: any) => {
        console.error(error);
        throw createError({
          statusCode: 500,
          statusMessage: error.msg,
        });
      });
    return { code: 200};
});