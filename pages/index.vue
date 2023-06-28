<template>
  <div class="flex justify-between flex-col h-[100vh]">
    <div class="h-[60px]">
      <div
        class="flex flex-wrap items-center justify-between w-full mb-4 px-4 border-b-2 bg-base-300"
      >
        <div class="flex items-center">
          <div class="text-2xl mr-4">魔方学习</div>
        </div>
        <div class=""></div>
        <div class="flex justify-between items-center">
          <div class="flex justify-between items-center">
            <el-input
              v-model="tempFormula"
              placeholder="输入公式"
              clearable
              class="mr-1"
            />
            <el-button size="default" :icon="VideoPlay" round>show</el-button>
          </div>
          <div>
            <el-switch
              v-model="darkTheme"
              style="margin-left: 24px"
              size="large"
              inline-prompt
              :active-icon="Sunny"
              :inactive-icon="Moon"
              :change="toggleDark(darkTheme)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1">
      <div class="flex flex-col justify-between h-full">
        <div class="flex justify-between h-full">
          <div class="border-r-2 w-2/5">
            <div>
              <el-table :data="blindFormula" border style="width: 100%" >
                <el-table-column prop="Formula" label="公式" header-align="center"/>
                <el-table-column prop="Code" label="编码" width="55" header-align="center"/>
                <el-table-column prop="ThinkCode" label="助记码" width="100" header-align="center"/>
                <el-table-column prop="ColorDesc" label="颜色" width="140" header-align="center"/>
              </el-table>
            </div>
          </div>
          <div class="mr-auto bg-blue-300">right</div>
        </div>
      </div>
    </div>
    <div class="h-[60px] border-t-2 flex items-center">
      <div class="mx-1 ml-2">
        <el-text type="primary"
          >F-前面 B-后面 R-右面 L左面 U-上面 D-下面 S-中间 E-水平中间
          M-垂直中间</el-text
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
//#region 基础:import 变量声明等
import { forEach } from "lodash-es";

useHead({
  title: "魔方练习",
});
import { Sunny, Moon, VideoPlay } from "@element-plus/icons-vue";
import type CFOP from "@prisma/client";
import type BlindFormulaGroup from "@prisma/client";
import type BlindFormulaCode from "@prisma/client";
import type BlindFormula from "@prisma/client";

//#region theme
const darkTheme = ref(false);
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
//#endregion
const dayjs = useDayjs();

let tempFormula = ref("");
const pageRows=ref(50);
let cfopList: CFOP[] = [];
let blindFormulaGroup: BlindFormulaGroup[] = [];
let blindFormulaCode: BlindFormulaCode[] = [];
let blindFormula: BlindFormula[] = [];

//#endregion
await useFetch("/api/formula").then((res) => {
  const data = res.data["_rawValue"];
  if (data != null && data.code == 200) {
    cfopList = <CFOP[]>data.cfop;
    blindFormulaGroup = <BlindFormulaGroup[]>data.blindFormulaGroup;
    blindFormulaCode = <BlindFormulaCode[]>data.blindFormulaCode;
    blindFormula = <BlindFormula[]>data.blindFormula;
  } else {
    if (data != null && data.code != 200) {
      ElMessage.error(data.msg);
    }
  }
});
let colorArr = [];
for (let i = 0; i < blindFormula.length; i++) {
  let arr = blindFormula[i].Code.split("");
  blindFormula[i].Colored = "";
  blindFormula[i].ColorDesc = "";
  forEach(arr, (c) => {
    let formulaCode = blindFormulaCode.find(
      (r) => r.Code.indexOf(c) > -1 && r.Type == blindFormula[i].Type
    );
    if (formulaCode != undefined) {
      colorArr = formulaCode.Color.split("");
      const colorCode = formulaCode.Code.split("");
      let colorString = formulaCode.Color;
      if (blindFormula[i].Type == "棱块") {
        blindFormula[i].Colored += "/e";

        if (c != colorCode[0]) {
          colorArr = colorArr.reverse();
          colorString = colorArr.join();
        }
      } else {
        blindFormula[i].Colored += "/c";

        for (let j = 0; j <= 2; j++) {
          if (colorCode[j] == c) {
            switch (j) {
              case 0:
                colorString =
                  colorArr[0].toString() +
                  colorArr[2].toString() +
                  colorArr[4].toString();
                break;
              case 2:
                colorString =
                  colorArr[2].toString() +
                  colorArr[4].toString() +
                  colorArr[0].toString();

                break;
              case 4:
                colorString =
                  colorArr[4].toString() +
                  colorArr[0].toString() +
                  colorArr[2].toString();
                break;
              default:
                break;
            }
            break;
          }
        }
      }

      blindFormula[i].Colored += " " + formulaCode.LayerCode;
      blindFormula[i].ColorDesc += "--" + colorString.replace(/ /g,'');
    }
  });

  //if (!string.IsNullOrEmpty(formulas[i].ColorDesc) && !string.IsNullOrWhiteSpace(formulas[i].ColorDesc)) formulas[i].ColorDesc = formulas[i].ColorDesc.Substring(2);
  if (
    blindFormula[i].ColorDesc != undefined &&
    blindFormula[i].ColorDesc != null &&
    blindFormula[i].ColorDesc != ""
  ) {
    blindFormula[i].ColorDesc = blindFormula[i].ColorDesc.substring(2);
  }
  arr = arr.reverse();
}
// blindFormula=sortBy(blindFormula,['Type','Code'])

blindFormula = blindFormula.sort(function (a, b) {
  let x = a.Type.toLowerCase();
  let y = b.Type.toLowerCase();

  if (x < y) {
    return -1;
  }
  if (x > y) {
    return 1;
  }
  return 0;
});
blindFormula = blindFormula.sort(function (a, b) {
  let x = a.Code.toLowerCase();
  let y = b.Code.toLowerCase();

  if (x < y) {
    return -1;
  }
  if (x > y) {
    return 1;
  }
  return 0;
});

</script>

<style scoped></style>
