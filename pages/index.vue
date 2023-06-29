<template>
  <div class="flex justify-between flex-col h-[100vh]">
    <div class="h-[60px]">
      <div
        class="flex flex-wrap items-center justify-between w-full mb-4 px-4 border-b-2 bg-base-300"
      >
        <div class="flex items-center">
          <div class="text-2xl mr-4">魔方学习</div>
          <div class="w-32">
            <el-select
              v-model="typeValue"
              class="m-2"
              placeholder="Select"
              size="small"
            >
              <el-option
                v-for="item in blindFormulaType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="ml-2 flex items-center w-[164px]">
            <p class="w-12">编码</p>
            <div class="w-16">
              <el-input
                v-model="searchFormulaCode"
                clearable
                maxlength="2"
                placeholder=""
                size="small"
              />
            </div>
          </div>
          <div>
            <el-text type="primary"
              >F-前面 B-后面 R-右面 L左面 U-上面 D-下面 S-中间 E-水平中间
              M-垂直中间</el-text
            >
          </div>
        </div>
        <div class=""></div>
        <div class="flex justify-between items-center">
          <div class="flex justify-between items-center">
            <el-input
              v-model="tempFormula"
              class="mr-1"
              clearable
              placeholder="输入公式"
            />
            <el-button
              :icon="VideoPlay"
              round
              size="default"
              @click="showTempFormula"
              >show</el-button
            >
          </div>
          <div>
            <el-switch
              v-model="darkTheme"
              :active-icon="Sunny"
              :change="toggleDark(darkTheme)"
              :inactive-icon="Moon"
              inline-prompt
              size="large"
              style="margin-left: 24px"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="h-[calc(100vh-60px)]">
      <div class="flex flex-col justify-between h-full">
        <div class="flex justify-between h-full">
          <div class="border-r-2 w-2/5 mr-2">
            <div>
              <el-table
                :data="showBlindFormulaList"
                border
                height="calc(100vh-60px)"
                highlight-current-row
                stripe
                style="width: 100%"
                @row-click="rowClick"
              >
                <el-table-column
                  header-align="center"
                  label="公式"
                  prop="Formula"
                />
                <el-table-column
                  header-align="center"
                  label="编码"
                  prop="Code"
                  width="55"
                />
                <el-table-column
                  header-align="center"
                  label="助记码"
                  prop="ThinkCode"
                  width="100"
                />
                <el-table-column
                  header-align="center"
                  label="颜色"
                  prop="ColorDesc"
                  width="130"
                />
                <el-table-column label="" width="80">
                  <!--suppress VueUnrecognizedSlot -->
                  <template #default="scope">
                    <el-button size="small" type="primary" @click=""
                      >Edit</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div
                v-show="searchFormulaCode == ''"
                class="example-pagination-block"
              >
                <!-- <div class="example-demonstration">分页</div> -->
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[20, 28, 50, 60]"
                  :pager-count="5"
                  :total="state.total"
                  background
                  hide-on-single-page
                  layout="prev, pager, next ,total,sizes,jumper"
                  small
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                />
              </div>
            </div>
          </div>
          <div class="mr-auto w-full flex flex-col justify-between">
            <div class="">
              <div id="" class="flex-1">
                <div class="flex justify-between w-full items-center">
                  <div class="border-2 h-[550px] w-1/2">
                    <div class="text-center w-1/2 mt-2">
                      <p class="text-2xl">{{ formulaTitle }}</p>
                    </div>
                    <div id="simulator" class="flex-"></div>
                  </div>
                  <div class="h-[550px] border-2 w-1/2">
                    <div class="text-center w-1/2 mt-2">
                      <p class="text-2xl">{{ reverseTitle }}</p>
                    </div>
                    <div id="left_right" class="flex-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!--suppress TypeScriptUnresolvedReference -->
<script lang="ts" setup>
//#region 基础:import 变量声明等
import { forEach } from "lodash-es";
import { Moon, Sunny, VideoPlay } from "@element-plus/icons-vue";
import type CFOP from "@prisma/client";
import type BlindFormulaGroup from "@prisma/client";
import type BlindFormulaCode from "@prisma/client";
import type BlindFormula from "@prisma/client";
import { useDark, useToggle } from "@vueuse/core";

useHead({
  title: "魔方练习",
});

//#region theme
const darkTheme = ref(false);

const isDark = useDark();
const toggleDark = useToggle(isDark);
//#endregion

let tempFormula = ref("");

const blindFormulaType = [
  {
    value: "棱块",
    label: "棱块",
  },
  {
    value: "角块",
    label: "角块",
  },
];
const typeValue = ref("棱块");
const pageRows = ref(20);
const searchFormulaCode = ref("");

let cfopList: CFOP[] = [];
let blindFormulaGroup: BlindFormulaGroup[] = [];
let blindFormulaCode: BlindFormulaCode[] = [];
let blindFormula: BlindFormula[] = [];
let rowBlindFormula = ref<BlindFormula>({
  Code: "",
  Formula: "",
  ThinkCode: "",
  ColorDesc: "",
});
let formulaTitle = ref("");
let reverseTitle = ref("");
function changeTitle(rowBlindFormula) {
  if (rowBlindFormula.Code == undefined || rowBlindFormula.Code == "") {
    formulaTitle.value = "";
    return;
  }
  formulaTitle.value =
    rowBlindFormula.Code +
    "-" +
    rowBlindFormula.ThinkCode +
    "--" +
    rowBlindFormula.ColorDesc;
}
function changeReserveTitle(rowBlindFormula) {
  if (rowBlindFormula.Code == undefined || rowBlindFormula.Code == "") {
    reverseTitle.value = "";
    return;
  }
  reverseTitle.value =
    rowBlindFormula.Code +
    "-" +
    rowBlindFormula.ThinkCode +
    "--" +
    rowBlindFormula.ColorDesc;
}
const currentPage = ref(1);
const pageSize = ref(28);
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

let allFormulaCode = "";

const getAllCode = (formula, allFormulaCode) => {
  const arr = formula.split(" ");
  for (let i = 0; i < arr.length; i++) {
    if (allFormulaCode.indexOf(arr[i]) == -1) {
      allFormulaCode += " " + arr[i];
    }
  }
  return allFormulaCode;
};
//#region 基础：计算盲拧公式颜色等
let colorArr = [];
for (let i = 0; i < blindFormula.length; i++) {
  let arr = blindFormula[i].Code.split("");
  blindFormula[i].Colored = "";
  blindFormula[i].ColorDesc = "";
  allFormulaCode = getAllCode(blindFormula[i].Formula, allFormulaCode);
  forEach(arr, (c) => {
    let formulaCode = blindFormulaCode.find(
      (r) => r.Code.indexOf(c) > -1 && r.Type == blindFormula[i].Type
    );

    if (formulaCode.Code != undefined) {
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
      blindFormula[i].ColorDesc +=
        "--" + colorString.replace(/ /g, "").replace(/,/g, "");
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
//#endregion

const state = reactive({
  page: 1,
  limit: pageRows.value,
  total: blindFormula.length,
});

const showBlindFormulaList = computed(() => {
  const result = blindFormula.filter((r) => r.Type == typeValue.value);
  if (searchFormulaCode.value != "") {
    return result.filter((r) => r.Code == searchFormulaCode.value);
  }
  return result.slice((state.page - 1) * state.limit, state.page * state.limit);
});
//改变页码
const handleCurrentChange = (e) => {
  state.page = e;
};

const handleSizeChange = (e) => {
  state.limit = e;
};

const CreateFormula = (id, alg, colored) => {
  //cubeWidth
  CubeAnimation.create_in_dom(
    "#" + id,
    `alg=${alg}|flags=showalg|algdisplay=fancy2s Z${colored}`,
    `class='roofpig ' style='width:550px'`
  );
};
const rowClick = (row) => {
  rowBlindFormula = row;
  tempFormula.value = row.Formula;
  changeTitle(rowBlindFormula);
  let item = document.getElementById("simulator");
  item.innerHTML = "";
  item = document.getElementById("left_right");
  item.innerHTML = "";
  let reserve = getReverseFormula(rowBlindFormula.Formula);
  let reserveFormula = {};
  const tmp = blindFormula.filter((r) => r.Formula == reserve);

  if (tmp.length > 0) {
    reserveFormula = tmp[0];
  } else {
    reserveFormula.Formula = reserve;
    reserveFormula.Code = "NOT FOUND";
    reserveFormula.ThinkCode = "";
    reserveFormula.ColorDesc = reserve;
  }
  changeReserveTitle(reserveFormula);
  let colored = "";
  const baseColored = "U D L R F B";
  if (row.Colored != null) {
    colored = "|colored=" + baseColored + row.Colored;
  }
  CreateFormula("simulator", row.Formula, colored);
  if (reserveFormula.Colored != null) {
    colored = "|colored=" + baseColored + reserveFormula.Colored;
  }
  CreateFormula("left_right", reserveFormula.Formula, colored);
};
const showTempFormula = () => {
  let f = tempFormula.value;
  const reg = "/’ /g";
  const regex = eval(reg);
  const reg2 = "/’/g";
  const regex2 = eval(reg2);
  f = f.replace(regex, "' ");
  f = f.replace(regex2, "' ");
  const item = document.getElementById("simulator");
  item.innerHTML = "";
  CubeAnimation.create_in_dom(
    "#simulator",
    `alg=${f}|flags=showalg|algdisplay=fancy2s Z`,
    `class="roofpig" style='width:50%'`
  );
};

const getReverseFormula = (formula) => {
  const arr = formula.split(" ");
  let reserveFormula = "";
  //B' D' D2 E  E' E2 F  F' F2 L L' L2 M' M2 R' R2 S  S' U' U2 f  f' f2 l  l' r' r2 u u' u2 x x'
  //B' D  D2 E' E  E2 F' F  F2 R R' R2 M' M2 L' L2 S' S  U  U2 f' f  f2 r  r' l' l2 u' u u2 x x'

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].indexOf("2") > -1) {
      reserveFormula += " " + arr[i];
      continue;
    }

    switch (arr[i]) {
      case "B'":
      case "D'":
      case "E'":
      case "F'":
      case "S'":
      case "U'":
      case "f'":
      case "u'":
        reserveFormula += " " + arr[i].replace("'", "");
        break;
      case "B":
      case "D":
      case "E":
      case "F":
      case "S":
      case "U":
      case "f":
      case "u":
        reserveFormula += " " + arr[i] + "'";
        break;
      case "L'":
        console.log(reserveFormula);
        reserveFormula += " R";
        console.log(reserveFormula);
        break;
      case "L":
        reserveFormula += " R'";
        break;
      case "R'":
        reserveFormula += " L";
        break;
      case "R":
        reserveFormula += " L'";
        break;
      case "l":
        reserveFormula += " r'";
        break;
      case "r'":
        reserveFormula += " l";
        break;
      case "r":
        reserveFormula += " l'";
        break;
      default:
        reserveFormula += " " + arr[i];
        break;
    }
  }
  reserveFormula = reserveFormula.substring(1);
  return reserveFormula;
};
</script>

<style scoped></style>
