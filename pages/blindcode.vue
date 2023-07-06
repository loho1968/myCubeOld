<!--suppress TypeScriptValidateTypes, NonAsciiCharacters, VueUnrecognizedSlot -->
<template>
  <div class="flex justify-between flex-col h-[100vh]">
    <div class="h-[60px]">
      <div
        class="flex flex-wrap items-center justify-between w-full mb-4 px-4 border-b-2 bg-base-300"
      >
        <div class="flex items-center">
          <div class="text-2xl mr-4">魔方学习</div>

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
              @click="showNewFormula(tempFormula);"
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
          <div class="mr-auto w-full flex flex-col justify-between">
            <div class="">
              <div id="" class="flex-1">
                <div class="flex justify-between w-full items-center">
                  <div
                    class="border-2 w-1/2 h-[100vh] flex flex-col items-center"
                  >
                    <div v-show="formulaTitle">
                      <div class="mt-[50px] w-full text-center">
                        <div
                          class="flex justify-center text-2xl font-medium mt-[50px] text-center"
                        >
                          <div v-for="(t, index) in formulaTitle.split(' ')">
                            <div v-if="t.indexOf('2') > -1">
                              <el-badge :value="2" class="" type="info">
                                <div
                                  :class="[
                                    'mr-3',
                                    'mt-2',
                                    'ml-2',
                                    index <= currentIndex - 1
                                      ? 'bg-blue-300'
                                      : '',
                                  ]"
                                >
                                  {{ t.substring(0, 1) }}
                                </div>
                              </el-badge>
                            </div>
                            <div
                              v-else
                              :class="[
                                'mt-2',
                                'mx-2',
                                index <= currentIndex - 1 ? 'bg-blue-300' : '',
                              ]"
                            >
                              {{ t }}
                            </div>
                          </div>
                        </div>
                        <div class="flex justify-between">
                          <div class="flex text-center">
                            <el-icon
                              class="hover:border-2 hover:cursor-pointer"
                              size="36"
                              ><DArrowLeft
                            /></el-icon>
                            <el-icon
                              class="hover:border-2 hover:cursor-pointer ml-4"
                              size="36"
                              @click="changeStep(-1, formulaLength)"
                              ><ArrowLeft
                            /></el-icon>
                            <el-icon
                              class="hover:border-2 hover:cursor-pointer ml-4"
                              size="36"
                              @click="changeStep(1, formulaLength)"
                              ><ArrowRight
                            /></el-icon>
                            <el-icon
                              class="hover:border-2 hover:cursor-pointer ml-4"
                              size="36"
                              ><VideoPlay
                            /></el-icon>
                          </div>
                          <client-only>
                            <div class="ml-10 mt-2 text-3xl min-w-[40px]">
                              {{ currentIndex }}/{{ formulaLength }}
                            </div>
                          </client-only>
                        </div>
                      </div>
                    </div>
                    <div id="edge" class="h-full w-full"></div>
                  </div>
                  <div class="border-2 w-1/2 h-[100vh]">
                    <div id="corner" class="h-full w-full"></div>
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
import type CFOP from "@prisma/client";
import type BlindFormulaGroup from "@prisma/client";
import type BlindFormulaCode from "@prisma/client";
import type BlindFormula from "@prisma/client";
import { useDark, useToggle } from "@vueuse/core";
//import type { FormInstance, FormRules } from "element-plus";
import {
  ArrowLeft,
  ArrowRight,
  DArrowLeft,
  Moon,
  Sunny,
  VideoPlay,
} from "@element-plus/icons-vue";

useHead({
  title: "魔方练习3",
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

let tempFormula = ref("");
const unDoFormulas = {};
const twistFormula = {};

Object.assign(unDoFormulas, { "x'": "X", x: "x", x2: "X X" });
Object.assign(twistFormula, { "x'": "x", x: "X", x2: "X X" });

Object.assign(unDoFormulas, { "R'": "R", R: "r", R2: "R R" });
Object.assign(twistFormula, { "R'": "r", R: "R", R2: "R R" });

Object.assign(unDoFormulas, { "B'": "B", B: "b", B2: "B B" });
Object.assign(twistFormula, { "B'": "b", B: "B", B2: "B B" });

Object.assign(unDoFormulas, { "D'": "D", D: "d", D2: "D D" });
Object.assign(twistFormula, { "D'": "d", D: "D", D2: "D D" });

Object.assign(unDoFormulas, { "E'": "E", E: "e", E2: "D D" });
Object.assign(twistFormula, { "E'": "e", E: "E", E2: "D D" });

Object.assign(unDoFormulas, { "F'": "F", F: "f", F2: "F F" });
Object.assign(twistFormula, { "F'": "f", F: "F", F2: "F F" });

Object.assign(unDoFormulas, { "L'": "L", L: "l", L2: "L L" });
Object.assign(twistFormula, { "L'": "l", L: "L", L2: "L L" });

Object.assign(unDoFormulas, { "M'": "M", M: "m", M2: "M M" });
Object.assign(twistFormula, { "M'": "m", M: "M", M2: "M M" });

Object.assign(unDoFormulas, { "S'": "S", S: "s", S2: "S S" });
Object.assign(twistFormula, { "S'": "s", S: "S", S2: "S S" });

Object.assign(unDoFormulas, { "U'": "U", U: "u", U2: "U U" });
Object.assign(twistFormula, { "U'": "u", U: "U", U2: "U U" });

Object.assign(unDoFormulas, { "F'": "F", F: "f", F2: "F F" });
Object.assign(twistFormula, { "F'": "f", F: "F", F2: "F F" });

Object.assign(unDoFormulas, { "r'": "m R", r: "M r", r2: "M M R R" });
Object.assign(twistFormula, { "r'": "M r", r: "m R", r2: "M M R R" });

Object.assign(unDoFormulas, { "u'": "u e", u: "U E", u2: "U U E E" });
Object.assign(twistFormula, { "u'": "U E", u: "u e", u2: "U U E E" });

Object.assign(unDoFormulas, { "f'": "S F", f: "s f", f2: "S S F F" });
Object.assign(twistFormula, { "f'": "s f", f: "S F", f2: "S S F F" });

Object.assign(unDoFormulas, { "l'": "xR", l: "X r" });
Object.assign(twistFormula, { "l'": "Xr", l: "x R" });

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

let dialogFormVisible = ref(false);

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

//#endregion

await useFetch("/api/blind_formula").then((res) => {
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

//#region 基础：计算盲拧公式颜色等

//#endregion
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
const vueInstance = getCurrentInstance();

let cubeEdge, cubeCorner;
const useLockedControls = false;
let newFormula = <formula>reactive({ twistFormula: "", unDoFormula: "" });
let formulaLength = ref(0);
let formulaTitle = ref("");
let currentIndex = ref(0);
let controls;
if (process.client) controls = useLockedControls ? ERNO.Locked : ERNO.Freeform;
if (process.client) {
  cubeEdge = new Cube();
  cubeCorner = new Cube();
  Cube.initSolver();

  window.cubeGLEdge = new ERNO.Cube({
    hideInvisibleFaces: true,
    controls: controls,
    renderer: null,
    showCode: true, //学习点:是否显示Code,
    showType: "edge", //学习点:显示层
  });
  cubeGLEdge.twistDuration = 300; //旋转速度

  window.cubeGLCorner = new ERNO.Cube({
    hideInvisibleFaces: true,
    controls: controls,
    renderer: null,
    showCode: true, //学习点:是否显示Code,
    showType: "corner", //学习点:显示层
  });
}
type formula = {
  twistFormula: string[];
  unDoFormula: string[];
};

const showNewFormula = (formula = "") => {
  if (process.server) return;
  cubeEdge = new Cube();
  cubeCorner = new Cube();
  Cube.initSolver();

  let controls = ERNO.Locked;
  //controls=ERNO.Freeform;

  window.cubeGLEdge = new ERNO.Cube({
    hideInvisibleFaces: true,
    controls: controls,
    renderer: null,
    showCode: true, //学习点:是否显示Code,
    showType: "edge", //学习点:显示层
  });
  cubeGLEdge.twistDuration = 300; //旋转速度

  window.cubeGLCorner = new ERNO.Cube({
    hideInvisibleFaces: true,
    controls: controls,
    renderer: null,
    showCode: true, //学习点:是否显示Code,
    showType: "corner", //学习点:显示层
  });
  const edge = document.getElementById("edge");
  const corner = document.getElementById("corner");
  newFormula = getNewFormula(formula);
  formulaTitle.value = formula;
  formulaLength = formula.split(" ").length;

  console.log(newFormula);
  edge.childNodes.forEach((item) => {
    edge.removeChild(item);
  });
  edge.appendChild(cubeGLEdge.domElement);
  if (controls === ERNO.Locked) {
    const fixedOrientation = new THREE.Euler(Math.PI * 0.1, Math.PI * -0.25, 0);
    cubeGLEdge.object3D.lookAt(cubeGLEdge.camera.position);
    cubeGLEdge.rotation.x += fixedOrientation.x;
    cubeGLEdge.rotation.y += fixedOrientation.y;
    cubeGLEdge.rotation.z += fixedOrientation.z;
  }

  if (newFormula.unDoFormula != "") {
    cubeGLEdge.formula = newFormula;
    cubeGLEdge.twist(newFormula.twistFormula);
  }
  corner.childNodes.forEach((item) => {
    corner.removeChild(item);
  });
  corner.appendChild(cubeGLCorner.domElement);
  if (controls === ERNO.Locked) {
    const fixedOrientation = new THREE.Euler(Math.PI * 0.1, Math.PI * -0.25, 0);
    cubeGLCorner.object3D.lookAt(cubeGLCorner.camera.position);
    cubeGLCorner.rotation.x += fixedOrientation.x;
    cubeGLCorner.rotation.y += fixedOrientation.y;
    cubeGLCorner.rotation.z += fixedOrientation.z;
  }

  if (newFormula.unDoFormula != "") {
    cubeGLCorner.formula = newFormula;
    cubeGLCorner.twist(newFormula.twistFormula);
  }
};
if (process.client) {
  showNewFormula("");
}

function getNewFormula(formula) {
  if (formula == "") return "";
  let unDoResult = "";
  let twistResult = "";
  let arr = formula.split(" ");
  const reverseFormula = getReverseFormula(formula);
  console.log(reverseFormula);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].replace(" ", "");
    if (arr[i] == "") continue;
    if (twistFormula[arr[i]] == undefined) {
      ElMessage.error(arr[i] + " 未找到--twistResult");
      continue;
    }
    twistResult += " " + twistFormula[arr[i]];
  }
  twistResult = twistResult.substring(1);
  arr = reverseFormula.split(" ");
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].replace(" ", "");
    if (arr[i] == "") continue;
    if (twistFormula[arr[i]] == undefined) {
      ElMessage.error(arr[i] + " 未找到--unDoResult");
      continue;
    }
    unDoResult += " " + twistFormula[arr[i]];
  }
  unDoResult = unDoResult.substring(1);
  return { unDoFormula: unDoResult, twistFormula: twistResult };
}


const changeStep = (step, formulaLength) => {
  console.log(currentIndex.value, formulaLength);
  if (step == -1) {
    if (currentIndex.value == 0) return;
  } else {
    if (currentIndex.value >= formulaLength) return;
  }
  currentIndex.value += step;
};
</script>

<style>
.cube .sticker {
  font-size: smaller !important;
}
</style>
