<!--suppress TypeScriptValidateTypes, NonAsciiCharacters, VueUnrecognizedSlot -->
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
              <!--suppress TypeScriptValidateTypes -->
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
              @click="showNewFormula(tempFormula)"
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
          <div class="border-r-2 w-2/5 mr-2 min-w-[550px]">
            <div>
              <el-table
                ref="formulaTable"
                :data="showBlindFormulaList"
                border
                height="calc(100vh-60px)"
                highlight-current-row
                stripe
                style="width: 100%"
                @row-click="rowClick"
              >
                <el-table-column type="index" width="50" />
                <el-table-column
                  header-align="center"
                  label="公式"
                  min-width="210"
                  prop="Formula"
                />
                <el-table-column
                  align="center"
                  header-align="center"
                  label="编码"
                  prop="Code"
                  width="53"
                />
                <el-table-column
                  align="center"
                  header-align="center"
                  label="助记码"
                  prop="ThinkCode"
                  width="67"
                />
                <el-table-column
                  align="center"
                  header-align="center"
                  label="颜色"
                  prop="ColorDesc"
                  width="125"
                >
                  <template #default="scope">
                    <div v-html="colorFormatter(scope.row.ColorDesc)"></div>
                  </template>
                </el-table-column>
                <el-table-column label="" width="80">
                  <!--suppress VueUnrecognizedSlot -->
                  <template #default="scope">
                    <el-button
                      size="small"
                      type="primary"
                      @click="editFormula(scope.row)"
                      >修改</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div v-show="searchFormulaCode == ''">
                <!-- <div class="example-demonstration">分页</div> -->
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[20, 40, 60, 80]"
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
              <!--              <div>-->
              <!--                <el-image class="mt-2 w-full" src="assets/twist.jpg" />-->
              <!--              </div>-->
            </div>
          </div>
          <div class="mr-auto w-full flex flex-col justify-between">
            <div class="mr-auto w-full flex flex-col justify-between">
              <div class="">
                <div id="" class="flex-1">
                  <div class="flex justify-between w-full items-center">
                    <div
                      class="border-2 w-1/2 h-[100vh] flex flex-col items-center"
                    >
                      <div v-show="formulaText">
                        <div class="w-full text-center">
                          <div
                            class="flex justify-between text-2xl font-medium mt-[15px] text-center"
                          >
                            <div v-for="(t, index) in formulaText.split(' ')">
                              <div v-if="t.indexOf('2') > -1">
                                <span
                                  :class="[
                                    index <= currentIndex ? 'bg-blue-300' : '',
                                  ]"
                                >
                                  {{ t.substring(0, 1) }}
                                </span>
                                <span
                                  :class="[
                                    'align-super',
                                    'text-xs',
                                    index <= currentIndex ? 'bg-blue-300' : '',
                                  ]"
                                >
                                  {{ 2 }}
                                </span>
                              </div>
                              <div
                                v-else
                                :class="[
                                  index <= currentIndex ? 'bg-blue-300' : '',
                                ]"
                              >
                                {{ t }}
                              </div>
                            </div>
                          </div>
                          <div class="flex justify-between">
                            <div class="flex mt-2">
                              <el-button
                                :disabled="currentIndex == -1"
                                text
                                @click="changeStep(999, formulaLength)"
                                ><el-icon size="30"><DArrowLeft /></el-icon
                              ></el-button>
                              <el-button
                                :disabled="currentIndex == -1"
                                text
                                @click="changeStep(-1, formulaLength)"
                                ><el-icon size="30"><ArrowLeft /></el-icon
                              ></el-button>
                              <el-button
                                :disabled="currentIndex == formulaLength - 1"
                                text
                                @click="changeStep(1, formulaLength)"
                                ><el-icon size="30"><ArrowRight /></el-icon
                              ></el-button>
                            </div>
                            <client-only>
                              <div class="ml-10 mt-2 text-3xl min-w-[40px]">
                                {{ currentIndex + 1 }}/{{ formulaLength }}
                              </div>
                            </client-only>
                          </div>
                        </div>
                        <div class="text-2xl mt-1" v-html="formulaTitle"></div>
                      </div>
                      <div id="simulator" class="h-full w-full"></div>
                    </div>
                    <div
                      class="border-2 w-1/2 h-[100vh] flex flex-col items-center"
                    >
                      <div v-show="mirrorTitle">
                        <div class="w-full text-center">
                          <div
                            class="flex justify-between text-2xl font-medium mt-[15px] text-center"
                          >
                            <div v-for="(t, index) in mirrorTitle.split(' ')">
                              <div v-if="t.indexOf('2') > -1">
                                <span
                                  :class="[
                                    index <= mirrorCurrentIndex
                                      ? 'bg-blue-300'
                                      : '',
                                  ]"
                                >
                                  {{ t.substring(0, 1) }}
                                </span>
                                <span
                                  :class="[
                                    'align-super',
                                    'text-xs',
                                    index <= mirrorCurrentIndex
                                      ? 'bg-blue-300'
                                      : '',
                                  ]"
                                >
                                  {{ 2 }}
                                </span>
                              </div>
                              <div
                                v-else
                                :class="[
                                  index <= mirrorCurrentIndex
                                    ? 'bg-blue-300'
                                    : '',
                                ]"
                              >
                                {{ t }}
                              </div>
                            </div>
                          </div>
                          <div class="flex justify-between">
                            <div class="flex mt-2">
                              <el-button
                                :disabled="mirrorCurrentIndex == -1"
                                text
                                @click="
                                  changeMirrorStep(999, mirrorCurrentIndex)
                                "
                                ><el-icon size="30"><DArrowLeft /></el-icon
                              ></el-button>
                              <el-button
                                :disabled="mirrorCurrentIndex == -1"
                                text
                                @click="
                                  changeMirrorStep(-1, mirrorCurrentIndex)
                                "
                                ><el-icon size="30"><ArrowLeft /></el-icon
                              ></el-button>
                              <el-button
                                :disabled="
                                  mirrorCurrentIndex == mirrorCurrentIndex - 1
                                "
                                text
                                @click="changeMirrorStep(1, mirrorCurrentIndex)"
                                ><el-icon size="30"><ArrowRight /></el-icon
                              ></el-button>
                            </div>
                            <client-only>
                              <div class="ml-10 mt-2 text-3xl min-w-[40px]">
                                {{ mirrorCurrentIndex + 1 }}/{{
                                  mirrorFormulaLength
                                }}
                              </div>
                            </client-only>
                          </div>
                          <div class="text-2xl mt-1" v-html="mirrorCode"></div>
                        </div>
                      </div>
                      <div id="mirrorSimulator" class="h-full w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogFormVisible" destroy-on-close title="公式编辑">
    <el-form
      ref="ruleFormRef"
      :model="rowBlindFormula"
      :rules="rules"
      label-position="top"
      size="large"
      status-icon
    >
      <el-form-item label="类型" prop="Type">
        <el-select v-model="rowBlindFormula.Type" placeholder="必须设置类型">
          <el-option label="棱块" value="棱块" />
          <el-option label="角块" value="角块" />
        </el-select>
      </el-form-item>
      <el-form-item label="编码" prop="Code">
        <el-input v-model="rowBlindFormula.Code" autocomplete="off" />
      </el-form-item>
      <el-form-item label="助记码" prop="ThinkCode">
        <el-input v-model="rowBlindFormula.ThinkCode" autocomplete="off" />
      </el-form-item>
      <el-form-item label="公式" prop="Formula">
        <el-input v-model="rowBlindFormula.Formula" autocomplete="off" />
      </el-form-item>

      <el-form-item label="镜像公式编码">
        <el-input v-model="rowBlindFormula.MirrorCode" autocomplete="off" />
      </el-form-item>
      <el-form-item label="镜像公式" size="large">
        <el-input v-model="rowBlindFormula.MirrorFormula" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm(ruleFormRef)">关闭</el-button>
        <el-button type="primary" @click="saveFormula(ruleFormRef)">
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<!--suppress TypeScriptUnresolvedReference -->
<script lang="ts" setup>
//#region 基础:import 变量声明等
import { forEach } from "lodash-es";
import type CFOP from "@prisma/client";
import type BlindFormulaGroup from "@prisma/client";
import type BlindFormulaCode from "@prisma/client";
import type BlindFormula from "@prisma/client";
import { useDark, useToggle } from "@vueuse/core";
import type { FormInstance, FormRules } from "element-plus";
import { useRowStore } from "~/stores/row";
import { usePageStore } from "~/stores/page";
import {
  ArrowLeft,
  ArrowRight,
  DArrowLeft,
  Moon,
  Sunny,
  VideoPlay,
} from "@element-plus/icons-vue";

useHead({
  title: "魔方盲拧练习2",
  link: [{ rel: "stylesheet", href: "/static/lib/cuber/css/cuber.css" }],
  script: [
    { src: "/static/lib/cuber/js/vendor/tween.min.js" },
    { src: "/static/lib/cuber/js/vendor/threejs/src/Three.js" },
    { src: "/static/lib/cuber/js/vendor/threejs/src/core/EventDispatcher.js" },
    { src: "/static/lib/cuber/js/vendor/threejs/src/math/Math.js" },
    { src: "/static/lib/cuber/js/vendor/threejs/src/math/Quaternion.js" },
    { src: "/static/lib/cuber/js/vendor/threejs/src/math/Vector2.js" },
    { src: "/static/lib/cuber/js/vendor/threejs/src/math/Vector3.js" },
    { src: "/static/lib/cuber/js/vendor/threejs/src/math/Box3.js" },
    { src: "/static/lib/cuber/js/vendor/threejs/src/math/Sphere.js" },
    { src: "/static/lib/cuber/js/vendor/threejs/src/math/Euler.js" },
    { src: "/static/lib/cuber/js/vendor/threejs/src/math/Matrix3.js" },
    { src: "/static/lib/cuber/js/vendor/threejs/src/math/Matrix4.js" },
    { src: "/static/lib/cuber/js/vendor/threejs/src/core/Object3D.js" },
    { src: "/static/lib/cuber/js/vendor/threejs/src/cameras/Camera.js" },
    {
      src: "/static/lib/cuber/js/vendor/threejs/src/cameras/PerspectiveCamera.js",
    },
    { src: "/static/lib/cuber/js/vendor/threejs/src/math/Ray.js" },
    { src: "/static/lib/cuber/js/vendor/threejs/src/math/Plane.js" },
    { src: "/static/lib/cuber/js/ERNO.js" },
    { src: "/static/lib/cuber/js/vendor/CSS3DRenderer.js" },

    { src: "/static/lib/cuber/js/utils/utils.js" },
    { src: "/static/lib/cuber/js/utils/Number.js" },

    { src: "/static/lib/cuber/js/utils/String.js" },
    { src: "/static/lib/cuber/js/utils/Array.js" },

    { src: "/static/lib/cuber/js/colors.js" },
    { src: "/static/lib/cuber/js/directions.js" },
    { src: "/static/lib/cuber/js/queues.js" },
    { src: "/static/lib/cuber/js/twists.js" },
    { src: "/static/lib/cuber/js/cubelets.js" },
    { src: "/static/lib/cuber/js/groups.js" },
    { src: "/static/lib/cuber/js/slices.js" },
    { src: "/static/lib/cuber/js/folds.js" },
    { src: "/static/lib/cuber/js/projector.js" },
    { src: "/static/lib/cuber/js/interaction.js" },
    { src: "/static/lib/cuber/js/controls.js" },
    { src: "/static/lib/cuber/js/cubes.js" },
    { src: "/static/lib/cuber/js/solvers.js" },
    { src: "/static/lib/cuber/js/renderer.js" },
    { src: "/static/lib/cuber/js/extras/renderers/iecss3d.js" },
    { src: "/static/lib/cuber/js/extras/renderers/ierenderer.js" },
    { src: "/static/lib/cuber/js/extras/controls/locked.js" },
    { src: "/static/lib/cuber/js/extras/deviceMotion.js" },
    { src: "/static/lib/cubejs/cube.js" },
    // { src: "/static/lib/cube/js/initial.js" },
    { src: "/static/lib/cube/js/util.js" },
    { src: "/static/lib/cube/js/lbl.js" },
    { src: "/static/lib/cube/js/two-phase.js" },
    { src: "/static/lib/cubejs/solve.js" },
  ],
});

//#region theme
const darkTheme = ref(false);

const isDark = useDark();
const toggleDark = useToggle(isDark);
//#endregion

//#region 变量声明
let tempFormula = ref(""); //临时输入公式
let rowStore = useRowStore(); //当前行缓存
let pageStore = usePageStore(); //当前页缓存
let currentPage = ref(1); //当前页

//#region 过滤类型
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
//#endregion

const pageSize = ref(20); //每页行数
const searchFormulaCode = ref(""); //搜索编码
let dialogFormVisible = ref(false); //编辑公式弹窗显示控制变量
let allFormulaCode = ""; //所有公式编码
//#region 公式数据对象
let cfopList: CFOP[] = [];
let blindFormulaGroup: BlindFormulaGroup[] = [];
let blindFormulaCode: BlindFormulaCode[] = [];
let blindFormula: BlindFormula[] = [];
let rowBlindFormula = ref<BlindFormula>({
  Type: "",
  Code: "",
  ThinkCode: "",
  Formula: "",
  FormulaKey: "",
  MirrorFormula: "",
  MirrorCode: "",
});
//表格状态变量
const state = reactive({
  page: 1,
  limit: pageSize.value,
  total: blindFormula.length,
});

//公式表格数据绑定变量
const showBlindFormulaList = computed(() => {
  const result = blindFormula.filter((r) => r.Type == typeValue.value);
  if (searchFormulaCode.value != "") {
    return result.filter((r) => r.Code == searchFormulaCode.value);
  }
  return result.slice((state.page - 1) * state.limit, state.page * state.limit);
});

const vueInstance = getCurrentInstance();
const formulaTable = ref(null);

//公式代码文字显示颜色和背景颜色
const colorList = {
  红: "black",
  绿: "black",
  黄: "black",
  蓝: "white",
  橙: "white",
  白: "black",
};
const colorBackGroundList = {
  红: "#FB0019",
  绿: "#26D82E",
  黄: "#FFFF3C",
  蓝: "#106CF8",
  橙: "#FD9B2A",
  白: "#EBEBEB",
};
//公式编辑时的校验规则
const ruleFormRef = ref<FormInstance>();
//#endregion

let formulaText = ref(""); //
let formulaTitle = ref(""); // 公式显示Title变量
let mirrorTitle = ref(""); //镜像公式显示Title变量
let mirrorCode = ref(""); //镜像公式编码
type formula = {
  formula: string[];
  reverseFormula: string[];
  newFormula: string[];
  newReverseFormula: string[];
};
let cubeEdge, cubeCorner; //魔方棱块和角块对象
const newFormulaSetup = {}; //公式转换配置对象

//#region 公式代码转换对象
Object.assign(newFormulaSetup, { "x'": "x", x: "X", x2: "X X" });
Object.assign(newFormulaSetup, { "R'": "r", R: "R", R2: "R R" });
Object.assign(newFormulaSetup, { "B'": "b", B: "B", B2: "B B" });
Object.assign(newFormulaSetup, { "D'": "d", D: "D", D2: "D D" });
Object.assign(newFormulaSetup, { "E'": "e", E: "E", E2: "D D" });
Object.assign(newFormulaSetup, { "F'": "f", F: "F", F2: "F F" });
Object.assign(newFormulaSetup, { "L'": "l", L: "L", L2: "L L" });
Object.assign(newFormulaSetup, { "M'": "m", M: "M", M2: "M M" });
Object.assign(newFormulaSetup, { "S'": "s", S: "S", S2: "S S" });
Object.assign(newFormulaSetup, { "U'": "u", U: "U", U2: "U U" });
Object.assign(newFormulaSetup, { "F'": "f", F: "F", F2: "F F" });
Object.assign(newFormulaSetup, { "r'": "M r", r: "m R", r2: "M M R R" });
Object.assign(newFormulaSetup, { "u'": "u e", u: "U E", u2: "U U E E" });
Object.assign(newFormulaSetup, { "f'": "s f", f: "S F", f2: "S S F F" });
Object.assign(newFormulaSetup, { "l'": "Xr", l: "x R" });
//#endregion

//转换后的新公式
let newFormula = <formula>reactive({});
let mirrorNewFormula = <formula>reactive({});
let formulaLength = ref(0); //公式步骤数量
let mirrorFormulaLength = ref(0); //镜像公式步骤数量
let currentIndex = ref(0); //当前步骤
let mirrorCurrentIndex = ref(0); //镜像公式当前步骤
let controls;
const useLockedControls = true;
if (process.client) controls = useLockedControls ? ERNO.Locked : ERNO.Freeform;
//#endregion

//获取公式数据
await useFetch("/api/blind_formula").then((res) => {
  const data = res.data["_rawValue"];
  if (data != null && data.code == 200) {
    cfopList = <CFOP[]>data.cfop;
    blindFormulaGroup = <BlindFormulaGroup[]>data.blindFormulaGroup;
    blindFormulaCode = <BlindFormulaCode[]>data.blindFormulaCode;
    blindFormula = <BlindFormula[]>data.blindFormula;
    state.total = blindFormula.length;
  } else {
    if (data != null && data.code != 200) {
      ElMessage.error(data.msg);
    }
  }
});

//获取所有公式字母代码
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
let colorArr = []; //临时变量
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
  //colorList
  arr = arr.reverse();
}
//对公式进行排序
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

function changeFormulaTitle(formula) {
  if (formula.Code == undefined || formula.Code == "") {
    formulaTitle.value = "";
    return;
  }
  formulaTitle.value = `<div  class="flex justify-center text-2xl">${
    formula.Code
  }-${formula.ThinkCode}--${colorFormatter(formula.ColorDesc)}</div>`;
}
function changeMirrorTitle(formula) {
  if (formula.Code == undefined || formula.Code == "") {
    mirrorCode.value = "";
    return;
  }
  mirrorCode.value = `<div  class="flex justify-center text-2xl">${
    formula.Code
  }-${formula.ThinkCode}--${colorFormatter(formula.ColorDesc)}</div>`;
}
//获取反向公式
const getReverseFormula = (formula) => {
  const arr = formula.split(" ");
  let reverseFormula = "";
  for (let i = arr.length - 1; i >= 0; i--) {
    arr[i] = arr[i].replace(" ", "");
    if (arr[i] == "") continue;
    if (arr[i].indexOf("2") > -1) {
      reverseFormula += " " + arr[i];
      continue;
    }
    if (arr[i].indexOf("'") == -1) {
      reverseFormula += " " + arr[i] + "'";
    } else {
      reverseFormula += " " + arr[i].replace("'", "");
    }
  }
  return reverseFormula.substring(1);
};

//#region 创建公式动画对象
if (process.client) {
  cubeEdge = new Cube();
  cubeCorner = new Cube();
  Cube.initSolver();

  window.cubeGLEdge = new ERNO.Cube({
    hideInvisibleFaces: true,
    controls: controls,
    renderer: null,
    showCode: true, //学习点:是否显示Code,
    showType: typeValue.value == "棱块" ? "edge" : "corner", //学习点:显示代码块类型
  });
  cubeGLEdge.twistDuration = 300; //旋转速度

  window.cubeGLCorner = new ERNO.Cube({
    hideInvisibleFaces: true,
    controls: controls,
    renderer: null,
    showCode: true, //学习点:是否显示Code,
    showType: typeValue.value == "棱块" ? "edge" : "corner", //学习点:显示代码块类型
  });
}
//#endregion

//改变页码事件
const handleCurrentChange = (e) => {
  state.page = e;
  pageStore.currentPage = e;
};

//改变每页显示行数事件
const handleSizeChange = (e) => {
  state.limit = e;
};

//创建公式显示
const CreateFormulaDisplay = (id, alg, colored) => {
  //cubeWidth
  // colored = "F*";
  CubeAnimation.create_in_dom(
    "#" + id,
    `alg=${alg}|flags=showalg|algdisplay=fancy2s ${colored}`,
    `class='roofpig ' style='width:550px'`
  );
};

//行点击事件
const rowClick = (row) => {
  rowStore.currentRow = row;
  localStorage.setItem("currentRow", JSON.stringify(row));
  rowBlindFormula = row;
  tempFormula.value = row.Formula;
  changeFormulaTitle(row);
  let item = document.getElementById("simulator");
  item.innerHTML = "";
  item = document.getElementById("mirrorSimulator");
  item.innerHTML = "";
  let mirror = getMirrorFormula(rowBlindFormula.Formula);
  let mirrorFormula = {};
  const tmp = blindFormula.filter(
    (r) => r.Formula == mirror && r.Type == row.Type
  );
  showNewFormula(row.Formula);
  if (tmp.length > 0) {
    mirrorFormula = tmp[0];
    showNewMirrorFormula(mirrorFormula.Formula);
  } else {
    mirrorFormula.Formula = reserve;
    mirrorFormula.Code = " ";
    mirrorFormula.ThinkCode = "";
    mirrorFormula.ColorDesc = reserve;
  }
};

//显示临时输入的公式
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
  const baseColored = "U D L R F B";

  CreateFormulaDisplay("simulator", f, baseColored);
};

//获取镜像公式
const getMirrorFormula = (formula) => {
  const arr = formula.split(" ");
  let mirrorFormula = "";
  //B' D' D2 E  E' E2 F  F' F2 L L' L2 M' M2 R' R2 S  S' U' U2 f  f' f2 l  l' r' r2 u u' u2 x x'
  //B' D  D2 E' E  E2 F' F  F2 R R' R2 M' M2 L' L2 S' S  U  U2 f' f  f2 r  r' l' l2 u' u u2 x x'

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].indexOf("2") > -1 && "L2,R2,l2,r2".indexOf(arr[i]) == -1) {
      mirrorFormula += " " + arr[i];
      continue;
    }

    switch (arr[i]) {
      case "L2":
        mirrorFormula += " R2";
        break;
      case "l2":
        mirrorFormula += " r2";
        break;
      case "R2":
        mirrorFormula += " L2";
        break;
      case "r2":
        mirrorFormula += " l2";
        break;
      case "B'":
      case "D'":
      case "E'":
      case "F'":
      case "S'":
      case "U'":
      case "f'":
      case "u'":
        mirrorFormula += " " + arr[i].replace("'", "");
        break;
      case "B":
      case "D":
      case "E":
      case "F":
      case "S":
      case "U":
      case "f":
      case "u":
        mirrorFormula += " " + arr[i] + "'";
        break;
      case "L'":
        mirrorFormula += " R";
        break;
      case "L":
        mirrorFormula += " R'";
        break;
      case "R'":
        mirrorFormula += " L";
        break;
      case "R":
        mirrorFormula += " L'";
        break;
      case "l":
        mirrorFormula += " r'";
        break;
      case "l'":
        mirrorFormula += " r";
        break;
      case "r'":
        mirrorFormula += " l";
        break;
      case "r":
        mirrorFormula += " l'";
        break;
      default:
        mirrorFormula += " " + arr[i];
        break;
    }
  }
  mirrorFormula = mirrorFormula.substring(1);
  return mirrorFormula;
};

//编辑公式
const editFormula = (row) => {
  vueInstance.refs.formulaTable.setCurrentRow(row);
  rowBlindFormula = row;
  dialogFormVisible.value = true;
};

//公式助记码显示格式化
const colorFormatter = (colorDesc) => {
  const arr = colorDesc.split("--");
  let color1 = colorDesc;
  let color2 = "";
  let result = "<div class='flex justify-between'>";
  if (arr.length > 1) {
    color1 = arr[0].split("");
    color2 = arr[1].split("");
  } else {
    return (result += `<p>${colorDesc}</p></div>`);
  }

  for (let i = 0; i < color1.length; i++) {
    result +=
      `<p style="background-color:${colorBackGroundList[color1[i]]};color:${
        colorList[color1[i]]
      };display:block;font-size:20px">` +
      color1[i] +
      `</p>`;
  }
  result += "<p>--</p>";
  for (let j = 0; j < color2.length; j++) {
    result +=
      `<p style="background-color:${colorBackGroundList[color2[j]]};color:${
        colorList[color2[j]]
      } ;font-size:20px">` +
      color2[j] +
      `</p>`;
  }
  result += "</div>";
  return result;
};

//显示新公式
const showNewFormula = (formula = "") => {
  if (process.server) return;

  cubeEdge = new Cube();
  Cube.initSolver();
  let controls = ERNO.Locked;
  //controls=ERNO.Freeform;

  window.cubeGLEdge = new ERNO.Cube({
    hideInvisibleFaces: true,
    controls: controls,
    renderer: null,
    showCode: true, //学习点:是否显示Code,
    showType: typeValue.value == "棱块" ? "edge" : "corner", //学习点:显示代码块类型
  });
  cubeGLEdge.twistDuration = 300; //旋转速度

  const simulator = document.getElementById("simulator");
  newFormula = getNewFormula(formula);
  formulaText.value = formula;

  currentIndex.value = -1;
  formulaLength = formula.split(" ").length;

  simulator.childNodes.forEach((item) => {
    simulator.removeChild(item);
  });
  simulator.appendChild(cubeGLEdge.domElement);
  if (controls === ERNO.Locked) {
    const fixedOrientation = new THREE.Euler(Math.PI * 0.1, Math.PI * -0.25, 0);
    cubeGLEdge.object3D.lookAt(cubeGLEdge.camera.position);
    cubeGLEdge.rotation.x += fixedOrientation.x;
    cubeGLEdge.rotation.y += fixedOrientation.y;
    cubeGLEdge.rotation.z += fixedOrientation.z;
  }

  if (newFormula.reverseFormula != "") {
    cubeGLEdge.twist(newFormula.newReverseFormula);
  }
  cubeGLEdge.formulas = newFormula;
};

const showNewMirrorFormula = (formula = "") => {
  if (process.server) return;
  cubeCorner = new Cube();
  Cube.initSolver();
  changeMirrorTitle(formula);
  let controls = ERNO.Locked;

  window.cubeGLCorner = new ERNO.Cube({
    hideInvisibleFaces: true,
    controls: controls,
    renderer: null,
    showCode: true, //学习点:是否显示Code,
    showType: typeValue.value == "棱块" ? "edge" : "corner", //学习点:显示代码块类型
  });
  cubeGLCorner.twistDuration = 300; //旋转速度

  const mirror = document.getElementById("mirrorSimulator");
  mirrorNewFormula = getNewFormula(formula);
  mirrorTitle.value = formula;
  mirrorCurrentIndex.value = -1;
  let mirrorFormula = {};
  const tmp = blindFormula.filter(
    (r) => r.Formula == formula && r.Type == typeValue.value
  );
  if (tmp.length > 0) {
    changeMirrorTitle(tmp[0]);
  } else {
    mirrorCode.value = "未找到";
  }
  mirrorFormulaLength = mirrorNewFormula.formula.split(" ").length;

  mirror.childNodes.forEach((item) => {
    mirror.removeChild(item);
  });
  mirror.appendChild(cubeGLCorner.domElement);
  if (controls === ERNO.Locked) {
    const fixedOrientation = new THREE.Euler(Math.PI * 0.1, Math.PI * -0.25, 0);
    cubeGLCorner.object3D.lookAt(cubeGLCorner.camera.position);
    cubeGLCorner.rotation.x += fixedOrientation.x;
    cubeGLCorner.rotation.y += fixedOrientation.y;
    cubeGLCorner.rotation.z += fixedOrientation.z;
  }
  if (mirrorNewFormula.reverseFormula != "") {
    cubeGLCorner.twist(mirrorNewFormula.newReverseFormula);
  }
  cubeGLCorner.formulas = mirrorNewFormula;
};
//转换新公式
function getNewFormula(formula) {
  if (formula == "") return "";
  let result = <formula>{};
  result.formula = formula;
  let reverseFormula = "";
  let newFormula = "";
  let newReverseFormula = "";
  let arr;
  let revserseArr;
  reverseFormula = getReverseFormula(formula);
  result.reverseFormula = reverseFormula;
  revserseArr = reverseFormula.split(" ");
  arr = formula.split(" ");
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].replace(" ", "");
    if (arr[i] == "") continue;
    if (newFormulaSetup[arr[i]] == undefined) {
      ElMessage.error(arr[i] + " 未找到");
      continue;
    }
    newFormula += " " + newFormulaSetup[arr[i]];
  }
  newFormula = newFormula.substring(1);
  result.newFormula = newFormula;
  for (let i = 0; i < revserseArr.length; i++) {
    revserseArr[i] = revserseArr[i].replace(" ", "");
    if (revserseArr[i] == "") continue;
    if (newFormulaSetup[revserseArr[i]] == undefined) {
      ElMessage.error(revserseArr[i] + " 未找到");
      continue;
    }
    newReverseFormula += " " + newFormulaSetup[revserseArr[i]];
  }
  newReverseFormula = newReverseFormula.substring(1);
  result.newReverseFormula = newReverseFormula;
  return result;
}

//改变公式步骤
const changeStep = (step, formulaLength) => {
  if (step == 999) {
    currentIndex.value = -1;
    showNewFormula(cubeGLEdge.formulas.formula);
    return;
  }
  let f = [];
  let i;
  if (step == -1) {
    if (currentIndex.value == -1) return;
    f = cubeGLEdge.formulas.reverseFormula.split(" ");
    i = f.length - currentIndex.value - 1;
  } else {
    if (currentIndex.value >= formulaLength) return;
    i = currentIndex.value + 1;
    f = cubeGLEdge.formulas.formula.split(" ");
  }
  for (let i = 0; i < f.length; i++) {
    if (f[i] == "" || f[i] == " ") f.remove(i);
  }
  let twist = getNewFormula(f[i]);
  twist = twist.newFormula;
  console.log(twist);
  cubeGLEdge.twist(twist);
  currentIndex.value += step;
};

//改变镜像公式步骤
const changeMirrorStep = (step, formulaLength) => {
  if (step == 999) {
    mirrorCurrentIndex.value = -1;
    showNewMirrorFormula(cubeGLCorner.formulas.formula);
    return;
  }
  let f = [];
  let i;
  if (step == -1) {
    if (mirrorCurrentIndex.value == -1) return;
    f = cubeGLCorner.formulas.reverseFormula.split(" ");
    i = f.length - mirrorCurrentIndex.value - 1;
  } else {
    if (mirrorCurrentIndex.value >= mirrorFormulaLength) return;
    i = mirrorCurrentIndex.value + 1;
    f = cubeGLCorner.formulas.formula.split(" ");
  }
  for (let i = 0; i < f.length; i++) {
    if (f[i] == "" || f[i] == " ") f.remove(i);
  }
  let twist = getNewFormula(f[i]);
  twist = twist.newFormula;
  console.log(twist);
  cubeGLCorner.twist(twist);
  mirrorCurrentIndex.value += step;
};
//保存修改公式
async function saveFormula(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (!valid) {
      console.error("error submit!");
      return false;
    }
  });
  dialogFormVisible.value = false;
  const data = {};

  data.Type = rowBlindFormula.Type;
  data.Code = rowBlindFormula.Code;
  data.ThinkCode = rowBlindFormula.ThinkCode;
  data.Formula = rowBlindFormula.Formula;
  data.FormulaKey = rowBlindFormula.FormulaKey;
  data.MirrorFormula = rowBlindFormula.MirrorFormula;
  data.MirrorCode = rowBlindFormula.MirrorCode;

  const result = await $fetch(`/api/blind_formula`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => {
    console.error(res);
  });
}

//#region 编辑公式校验

//编码
const validateCode = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("必须输入编码"));
  }
};
//助记码
const validateThinkCode = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("必须输入助记码"));
  }
};
//公式
const validateFormula = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("必须输入公式"));
  }
};
//校验规则组合
const rules = reactive<FormRules<typeof rowBlindFormula>>({
  Code: [{ validator: validateCode, trigger: "blur" }],
  ThinkCode: [{ validator: validateThinkCode, trigger: "blur" }],
  Formula: [{ validator: validateFormula, trigger: "blur" }],
});
//重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  dialogFormVisible.value = false;
  formEl.resetFields();
};
//#endregion

//页面加载
onMounted(() => {
  currentPage.value = pageStore.currentPage;
  if (rowStore.currentRow.Code != undefined && process.client) {
    let tmp = {};
    vueInstance.refs.formulaTable.data.forEach((item, index) => {
      if (item.Code == rowStore.currentRow.Code) {
        tmp = item;
        tmp.index = index;
      }
    });
    vueInstance.refs.formulaTable.setCurrentRow(
      vueInstance.refs.formulaTable.data[tmp.index]
    );
    rowClick(tmp);
  }
});
</script>

<style scoped></style>
