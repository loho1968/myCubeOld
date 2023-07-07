import { PrismaClient, CFOP } from "@prisma/client";
// @ts-ignore

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
  // @ts-ignore
  const cfop: CFOP = await readBody(event);
  console.log(cfop);
  if (cfop.ID != undefined && cfop.ID != "") {
    const update = await prisma.cFOP
      .update({
        where: { ID: cfop.ID },
        data: cfop,
      })
      .catch((error: any) => {
        console.error(error);
        throw createError({
          statusCode: 500,
          statusMessage: error.msg,
        });
      });
  }else{
    const create = await prisma.cFOP
      .create({
        data: cfop,
      })
      .catch((error: any) => {
        console.error(error);
        throw createError({
          statusCode: 500,
          statusMessage: error.msg,
        });
      });
  }
  return { code: 200 };
});
