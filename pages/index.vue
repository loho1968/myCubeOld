<template>
    <div
        class="flex flex-wrap items-center justify-between w-full mb-4 px-4 text-lg border-b-2 absolute top-0 left-0 bg-base-300"
    >
        <div class="text-2xl w-32">魔方学习
        </div>
        <div class="text-2xl w-32"></div>
        <div
            class=""
        >
            <el-switch
                v-model="darkTheme"
                class="mt-2"
                style="margin-left: 24px"
                size="large"
                inline-prompt
                :active-icon="Sunny"
                :inactive-icon="Moon"
                :change="toggleDark(darkTheme)"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
useHead({
    title: '魔方练习'
});
import {Sunny,Moon} from "@element-plus/icons-vue";

const darkTheme=ref(false)
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const dayjs = useDayjs()
const date = dayjs('2023-01-01')
console.log(date.format('YYYY-MM-DD HH:mm:ss'))
</script>

<style scoped>


</style>
