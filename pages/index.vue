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
                <div>asdf</div>
              </div>
            </div>
          </div>
          <div class="mr-auto w-full flex flex-col justify-between">
            <div class="">
              <div id="" class="flex-1">
                <div class="flex justify-between w-full items-center">
                  <div class="border-2 h-[550px] w-1/2">
                    <div
                      class="text-center w-1/2 mt-2 items-center"
                      v-html="formulaTitle"
                    ></div>
                    <div id="simulator" class="flex-"></div>
                  </div>
                  <div class="h-[550px] border-2 w-1/2">
                    <div class="text-center w-1/2 mt-2">
                      <p class="text-2xl" v-html="mirrorTitle"></p>
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
import { Moon, Sunny, VideoPlay } from "@element-plus/icons-vue";
import type CFOP from "@prisma/client";
import type BlindFormulaGroup from "@prisma/client";
import type BlindFormulaCode from "@prisma/client";
import type BlindFormula from "@prisma/client";
import { useDark, useToggle } from "@vueuse/core";
import type { FormInstance, FormRules } from "element-plus";
import { useRowStore } from "~/stores/row";
import { usePageStore } from "~/stores/page";

useHead({
  title: "魔方盲拧练习",
  script: [
    { src: "/static/js/jquery-3.7.0.min.js" },
    { src: "/static/js/roofpig_and_three.js" },
  ],
  link: [{ rel: "stylesheet", href: "/static/css/cube.css" }],
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

let formulaTitle = ref(""); //公式显示Title变量
let mirrorTitle = ref(""); //镜像公式显示Title变量
//#endregion

//切换公式时，改变显示Title
function changeTitle(formula) {
  if (formula.Code == undefined || formula.Code == "") {
    formulaTitle.value = "";
    return;
  }
  formulaTitle.value = `<div  class="flex justify-center text-2xl">${
    formula.Code
  }-${formula.ThinkCode}--${colorFormatter(formula.ColorDesc)}</div>`;
}
//切换公式时，改变镜像公式显示Title
function changeMirrorTitle(formula) {
  if (formula.Code == undefined || formula.Code == "") {
    mirrorTitle.value = "";
    return;
  }
  const colorDesc =
    formula.Code != "" ? formula.ColorDesc.split(",") : formula.ColorDesc;
  mirrorTitle.value = `<div  class="flex justify-center text-2xl">${
    formula.Code
  }-${formula.ThinkCode}--${colorFormatter(formula.ColorDesc)}</div>`;
}
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
  changeTitle(rowBlindFormula);
  let item = document.getElementById("simulator");
  item.innerHTML = "";
  item = document.getElementById("left_right");
  item.innerHTML = "";
  let reserve = getMirrorFormula(rowBlindFormula.Formula);
  let reserveFormula = {};
  const tmp = blindFormula.filter(
    (r) => r.Formula == reserve && r.Type == row.Type
  );

  if (tmp.length > 0) {
    reserveFormula = tmp[0];
  } else {
    reserveFormula.Formula = reserve;
    reserveFormula.Code = " ";
    reserveFormula.ThinkCode = "";
    reserveFormula.ColorDesc = reserve;
  }
  changeMirrorTitle(reserveFormula);
  let colored = "";
  const baseColored = "U D L R F B";
  if (row.Colored != null) {
    colored = "|colored=" + baseColored + row.Colored;
  }
  CreateFormulaDisplay("simulator", row.Formula, colored);
  if (reserveFormula.Colored != null) {
    colored = "|colored=" + baseColored + reserveFormula.Colored;
  } else {
    colored = baseColored;
  }
  CreateFormulaDisplay("left_right", reserveFormula.Formula, colored);
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
  let reserveFormula = "";
  //B' D' D2 E  E' E2 F  F' F2 L L' L2 M' M2 R' R2 S  S' U' U2 f  f' f2 l  l' r' r2 u u' u2 x x'
  //B' D  D2 E' E  E2 F' F  F2 R R' R2 M' M2 L' L2 S' S  U  U2 f' f  f2 r  r' l' l2 u' u u2 x x'

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].indexOf("2") > -1 && "L2,R2,l2,r2".indexOf(arr[i]) == -1) {
      reserveFormula += " " + arr[i];
      continue;
    }

    switch (arr[i]) {
      case "L2":
        reserveFormula += " R2";
        break;
      case "l2":
        reserveFormula += " r2";
        break;
      case "R2":
        reserveFormula += " L2";
        break;
      case "r2":
        reserveFormula += " l2";
        break;
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
        reserveFormula += " R";
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
      case "l'":
        reserveFormula += " r";
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

//编辑公式
const editFormula = (row) => {
  vueInstance.refs.formulaTable.setCurrentRow(row);
  rowBlindFormula = row;
  console.log(rowBlindFormula.value);
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

//保存修改公式
async function saveFormula(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (!valid) {
      console.log("error submit!");
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
    console.log(res);
  });
  console.log(result);
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
