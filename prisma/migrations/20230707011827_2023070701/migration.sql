/*
  Warnings:

  - You are about to drop the column `OtherFormula` on the `CFOP` table. All the data in the column will be lost.
  - You are about to drop the column `ColorCode` on the `BlindFormula` table. All the data in the column will be lost.
  - You are about to drop the column `ColorDesc` on the `BlindFormula` table. All the data in the column will be lost.
  - You are about to drop the column `Colored` on the `BlindFormula` table. All the data in the column will be lost.
  - You are about to drop the column `ReverseCode` on the `BlindFormula` table. All the data in the column will be lost.
  - You are about to drop the column `SameCode` on the `BlindFormula` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CFOP" (
    "Type" TEXT,
    "Formula" TEXT,
    "ID" TEXT NOT NULL PRIMARY KEY,
    "Name" TEXT,
    "Code" TEXT
);
INSERT INTO "new_CFOP" ("Code", "Formula", "ID", "Name", "Type") SELECT "Code", "Formula", "ID", "Name", "Type" FROM "CFOP";
DROP TABLE "CFOP";
ALTER TABLE "new_CFOP" RENAME TO "CFOP";
CREATE TABLE "new_BlindFormula" (
    "Type" TEXT NOT NULL,
    "Code" TEXT NOT NULL,
    "ThinkCode" TEXT NOT NULL,
    "Formula" TEXT NOT NULL,
    "FormulaKey" TEXT NOT NULL PRIMARY KEY,
    "MirrorFormula" TEXT,
    "MirrorCode" TEXT
);
INSERT INTO "new_BlindFormula" ("Code", "Formula", "FormulaKey", "MirrorFormula", "ThinkCode", "Type") SELECT "Code", "Formula", "FormulaKey", "MirrorFormula", "ThinkCode", "Type" FROM "BlindFormula";
DROP TABLE "BlindFormula";
ALTER TABLE "new_BlindFormula" RENAME TO "BlindFormula";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
