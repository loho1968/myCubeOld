<template>
  <div class="common-layout">
    <el-container>
      <el-header>
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
              <el-button size="default" :icon="VideoPlay" round
                >show</el-button
              >
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
      </el-header>
      <el-main>
        <div class="flex flex-col justify-between">
          <div>
            <el-text class="mx-1" type="primary"
              >F-前面 B-后面 R-右面 L左面 U-上面 D-下面 S-中间 E-水平中间
              M-垂直中间</el-text
            >
          </div>
          <div>Main</div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
//#region 基础:import 变量声明等
useHead({
  title: "魔方练习",
});
import { Sunny, Moon, VideoPlay } from "@element-plus/icons-vue";

const darkTheme = ref(false);
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);

const dayjs = useDayjs();

let tempFormula = ref("");
//#endregion
</script>

<style scoped></style>
