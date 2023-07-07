import { PrismaClient } from "@prisma/client";
// @ts-ignore

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {


    // @ts-ignore
    const cfop = await prisma.CFOP.findMany({}).catch((error) => {
        console.error(error);
        return { code: 500, msg: error.msg };
    });

    return {
        code: 200,
        cfop: cfop,
    };
});
