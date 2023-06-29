-- CreateTable
CREATE TABLE "BlindFormula" (
    "Type" TEXT NOT NULL,
    "Code" TEXT NOT NULL,
    "ThinkCode" TEXT NOT NULL,
    "ColorCode" TEXT,
    "Formula" TEXT NOT NULL,
    "Colored" TEXT,
    "FormulaKey" TEXT NOT NULL PRIMARY KEY,
    "SameCode" TEXT,
    "ColorDesc" TEXT,
    "ReverseCode" TEXT,
    "MirrorFormula" TEXT
);

-- CreateTable
CREATE TABLE "BlindFormulaCode" (
    "Code" TEXT NOT NULL PRIMARY KEY,
    "Color" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "LayerCode" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BlindFormulaGroup" (
    "GroupName" TEXT NOT NULL,
    "FormulaCode" TEXT NOT NULL,
    "FormulaKey" TEXT NOT NULL,
    "GroupKey" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "CFOP" (
    "Type" TEXT,
    "Formula" TEXT,
    "OtherFormula" TEXT,
    "ID" TEXT NOT NULL PRIMARY KEY,
    "Name" TEXT,
    "Code" TEXT
);
