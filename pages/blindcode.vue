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
              @click="showFormula"
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
                    class="border-2 w-1/2 h-[100vh]"
                  >
                    <div id="edge" class="h-full w-full"></div>
                  </div>
                  <div
                    class="border-2  w-1/2 h-[100vh]"
                  >
                    <div id="corner" class=" h-full w-full"></div>
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
import type { FormInstance, FormRules } from "element-plus";

useHead({
  title: "魔方练习2",
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

Object.assign(unDoFormulas, { "B'": "B", B: "b", B2: "BB" });
Object.assign(twistFormula, { "B'": "b", B: "B", B2: "BB" });

Object.assign(unDoFormulas, { "D'": "D", D: "d", D2: "DD" });
Object.assign(twistFormula, { "D'": "d", D: "D", D2: "DD" });

Object.assign(unDoFormulas, { "E'": "E", E: "e", D2: "DD" });
Object.assign(twistFormula, { "E'": "e", E: "E", D2: "DD" });

Object.assign(unDoFormulas, { "F'": "F", F: "f", F2: "FF" });
Object.assign(twistFormula, { "F'": "f", F: "F", F2: "FF" });

Object.assign(unDoFormulas, { "L'": "L", L: "l", L2: "LL" });
Object.assign(twistFormula, { "L'": "l", L: "L", L2: "LL" });

Object.assign(unDoFormulas, { "M'": "M", M: "m", M2: "MM" });
Object.assign(twistFormula, { "M'": "m", M: "M", M2: "MM" });

Object.assign(unDoFormulas, { "M'": "M", M: "m", M2: "MM" });
Object.assign(twistFormula, { "M'": "m", M: "M", M2: "MM" });

Object.assign(unDoFormulas, { "R'": "R", R: "r", R2: "RR" });
Object.assign(twistFormula, { "R'": "r", R: "R", R2: "RR" });

Object.assign(unDoFormulas, { "S'": "S", S: "s", S2: "SS" });
Object.assign(twistFormula, { "S'": "s", S: "S", S2: "SS" });

Object.assign(unDoFormulas, { "U'": "U", U: "u", U2: "UU" });
Object.assign(twistFormula, { "U'": "u", U: "U", U2: "UU" });

Object.assign(unDoFormulas, { "F'": "F", F: "f", F2: "FF" });
Object.assign(twistFormula, { "F'": "f", F: "F", F2: "FF" });

Object.assign(unDoFormulas, { "F'": "F", F: "f", F2: "FF" });
Object.assign(twistFormula, { "F'": "f", F: "F", F2: "FF" });

Object.assign(unDoFormulas, { "r'": "mR", r: "Mr", r2: "mmRR" });
Object.assign(twistFormula, { "r'": "Mr", r: "mR", r2: "mmRR" });


Object.assign(unDoFormulas, { "u'": "ue", u: "UE", r2: "UUEE" });
Object.assign(twistFormula, { "u'": "UE", u: "ue", r2: "UUEE" });

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

const vueInstance = getCurrentInstance();
const formulaTable = ref(null);
const editFormula = (row) => {
  vueInstance.refs.formulaTable.setCurrentRow(row);

  rowBlindFormula = row;
  console.log(rowBlindFormula.value);
  dialogFormVisible.value = true;
};
let cubeEdge,cubeCorner;
if (process.client) {
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
}

const useLockedControls = true;
let controls;
if (process.client) controls = useLockedControls ? ERNO.Locked : ERNO.Freeform;
const showNewFormula = (formula="") => {
    if(process.server) return;
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
  const newFormula = getNewFormula(formula);
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
  if(formula!="") {
      cubeGLEdge.formula=newFormula
      cubeGLEdge.twist(newFormula.unDoFormula);
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

    if(formula!="")  {
        cubeGLCorner.formula=newFormula
        cubeGLCorner.twist(newFormula.unDoFormula);
    }
};
if(process.client) {
    showNewFormula('');
}

function getNewFormula(formula) {
    if(formula=="") return "";
  let unDoResult = "";
  let twistResult="";
  const arr = formula.split(" ");

  for (let i = 0; i < arr.length; i++) {
    if (twistFormula[arr[i]] == undefined)
      console.error(twistFormula[arr[i]] + " 未找到--twistFormula");
      if (unDoFormulas[arr[i]] == undefined)
          console.error(unDoFormulas[arr[i]] + " 未找到--unDoFormulas");
      twistResult += " " + twistFormula[arr[i]];
      unDoResult += " " + unDoFormulas[arr[i]];
  }
  return {unDoFormula:unDoResult,twistFormula:twistResult};
}

const showFormula=()=>{
  showNewFormula(tempFormula.value);
}
</script>

<style scoped></style>
