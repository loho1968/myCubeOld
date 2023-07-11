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
              @change="filterFormula"
            >
              <!--suppress TypeScriptValidateTypes -->
              <el-option
                v-for="item in formulaType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <el-text type="primary"
              >F-前面 B-后面 R-右面 L左面 U-上面 D-下面 S-中间 E-水平中间
              M-垂直中间</el-text
            >
          </div>
          <div class="ml-4">
            <NuxtLink class="mx-4" to="/"
              ><el-link type="primary">盲拧</el-link></NuxtLink
            >
            <NuxtLink class="mx-4" to="/bcode"
              ><el-link type="primary">盲拧2</el-link></NuxtLink
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
              <div class="m-2">
                <el-button
                  :icon="Plus"
                  size="large"
                  type="success"
                  @click="addFormula()"
                  >新增</el-button
                >
              </div>
              <el-table
                ref="formulaTable"
                :data="searchList"
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
                  label="类型"
                  min-width="35"
                  prop="Type"
                />
                <el-table-column
                  align="center"
                  header-align="center"
                  label="编码"
                  prop="Code"
                  width=""
                />
                <el-table-column
                  align="center"
                  header-align="center"
                  label="名称"
                  prop="Name"
                  width=""
                />
                <el-table-column
                  header-align="center"
                  label="公式"
                  min-width="210"
                  prop="Formula"
                />
                <el-table-column label="" width="61">
                  <template #default="scope">
                    <el-button
                      :icon="EditPen"
                      size="small"
                      type="primary"
                      @click="editFormula(scope.row)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div>
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[30, 40, 50, 60]"
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
                    <div
                      class="text-center w-1/2 mt-2 items-center"
                      v-html="formulaTitle"
                    ></div>
                    <div id="simulator" class="flex-"></div>
                  </div>
                  <div class="h-[550px] border-2 w-1/2">
                    <div class="text-center w-1/2 mt-2">
                      <p class="text-2xl" v-html="mirrorFormulaTitle"></p>
                    </div>
                    <div id="mirror" class="flex-1"></div>
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
      :model="rowCFOP"
      :rules="rules"
      label-position="top"
      size="large"
      status-icon
    >
      <el-form-item label="类型" prop="Type">
        <el-select v-model="rowCFOP.Type" placeholder="设置类型">
          <el-option label="CROSS" value="CROSS" />
          <el-option label="F2L" value="F2L" />
          <el-option label="PLL" value="PLL" />
          <el-option label="OLL" value="OLL" />
          <el-option label="特殊" value="特殊" />
        </el-select>
      </el-form-item>
      <el-form-item label="编码" prop="Code">
        <el-input v-model="rowCFOP.Code" autocomplete="off" />
      </el-form-item>
      <el-form-item label="名称" prop="Name">
        <el-input v-model="rowCFOP.Name" autocomplete="off" class="mr-2" />
      </el-form-item>
      <el-form-item label="公式" prop="Formula">
        <el-input v-model="rowCFOP.Formula" autocomplete="off" />
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
import { EditPen, Moon, Plus, Sunny, VideoPlay } from "@element-plus/icons-vue";
import type CFOP from "@prisma/client";
import { useDark, useToggle } from "@vueuse/core";
import type { FormInstance, FormRules } from "element-plus";
import { useRowStore } from "~/stores/row";
import { usePageStore } from "~/stores/page";
import { usePageSizeStore } from "~/stores/pageSize";

useHead({
  title: "魔方CFOP",
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
const formulaType = [
  {
    value: "全部",
    label: "全部",
  },
  {
    value: "CROSS",
    label: "CROSS",
  },
  {
    value: "F2L",
    label: "F2L",
  },
  {
    value: "PLL",
    label: "PLL",
  },
  {
    value: "OLL",
    label: "OLL",
  },
  {
    value: "特殊",
    label: "特殊",
  },
];
const addType = [
  {
    value: "CROSS",
    label: "CROSS",
  },
  {
    value: "F2L",
    label: "F2L",
  },
  {
    value: "PLL",
    label: "PLL",
  },
  {
    value: "OLL",
    label: "OLL",
  },
  {
    value: "特殊",
    label: "特殊",
  },
];
const typeValue = ref("全部");
//#endregion

const pageSizeStore = usePageSizeStore(); //每页行数
const pageSize = ref(pageSizeStore.size); //每页行数
let dialogFormVisible = ref(false); //编辑公式弹窗显示控制变量

//#region 公式数据对象
let cfopList: CFOP[] = [];
let searchList: CFOP[] = [];
let rowCFOP = reactive<CFOP>({
  Type: "",
  Formula: "",
  OtherFormula: "",
  ID: "",
  Name: "",
  Code: "",
});
//表格状态变量
const state = reactive({
  page: 1,
  limit: pageSize.value,
  total: searchList.length,
});

const vueInstance = getCurrentInstance();
const formulaTable = ref(null);

//公式编辑时的校验规则
const ruleFormRef = ref<FormInstance>();
//#endregion

let formulaTitle = ref(""); //公式显示Title变量
let mirrorFormulaTitle = ref(""); //镜像公式显示Title变量
//#endregion

//#region 获取公式数据
await useFetch("/api/cfop").then((res) => {
  const data = res.data["_rawValue"];

  if (data != null && data.code == 200) {
    cfopList = <CFOP[]>data.cfop;
    state.total = cfopList.length;
  } else {
    if (data != null && data.code != 200) {
      ElMessage.error(data.msg);
    }
  }
});

//对公式进行排序
cfopList = cfopList.sort(function (a, b) {
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
cfopList = cfopList.sort(function (a, b) {
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
filterFormula();
//#endregion

function filterFormula() {
  searchList = cfopList.filter((item) => {
    if (typeValue.value == "全部") {
      return true;
    } else {
      return item.Type == typeValue.value;
    }
  });
}
//改变页码事件
const handleCurrentChange = (e) => {
  state.page = e;
  pageStore.currentPage = e;
};

//改变每页显示行数事件
const handleSizeChange = (e) => {
  state.limit = e;
  pageSizeStore.size = e;
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
  rowCFOP = reactive(row);
  tempFormula.value = row.Formula;
  let item = document.getElementById("simulator");
  item.innerHTML = "";

  let mirrorFormula = getMirrorFormula(rowCFOP.Formula);
  formulaTitle.value = row.formula;
  mirrorFormulaTitle.value = mirrorFormula;

  const colored = getFormulaColor(typeValue.value);

  CreateFormulaDisplay("simulator", row.Formula, colored);
  item = document.getElementById("mirror");
  item.innerHTML = "";
  CreateFormulaDisplay("mirror", mirrorFormula, colored);
};

//loho:根据类型显示不同的颜色
function getFormulaColor(type) {
  const baseColored = "U D L R F B";
  let colored = "|colored=" + baseColored;
  colored = "";
  switch (type) {
    case "F2L":
      break;
    case "PLL":
      break;
    case "CROSS":
      break;
    case "二步OLL":
      break;
    case "其他OLL":
      break;
    default:
      break;
  }
  return colored;
}

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
  rowCFOP = reactive(row);
  dialogFormVisible.value = true;
};

const addFormula = () => {
  rowCFOP = reactive({
    Type: "",
    Formula: "",
    OtherFormula: "",
    ID: "",
    Name: "",
    Code: "",
  });
  dialogFormVisible.value = true;
};
//保存修改公式
async function saveFormula(formEl) {
  if (!formEl) return;

  const v = await formEl.validate((valid, fields) => {
    if (valid) {
      return true;
    } else {
      return false;
    }
  });

  if (!v) return;
  dialogFormVisible.value = false;
  const data = {};

  data.Type = rowCFOP.Type;
  data.Code = rowCFOP.Code;
  data.Name = rowCFOP.Name;
  data.Formula = rowCFOP.Formula;
  data.ID = rowCFOP.ID;

  const result = await $fetch(`/api/cfop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => {
    ElMessage.error(res);
  });
}

//#region 编辑公式校验

//校验规则组合
const rules = reactive<FormRules<typeof rowCFOP>>({
  Code: [{ required: true, message: "必须输入编码", trigger: "blur" }],
  Type: [{ required: true, message: "必须输入类型", trigger: "blur" }],
  Name: [{ required: true, message: "必须输入名称", trigger: "blur" }],
  Formula: [{ required: true, message: "必须输入公式", trigger: "blur" }],
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
