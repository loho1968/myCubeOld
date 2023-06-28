<template>
    <NuxtLayout>
        <NuxtPage/>
    </NuxtLayout>
</template>
<script lang="ts" setup>
const nuxtApp = useNuxtApp()
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

nuxtApp.vueApp.use(ElementPlus,{ locale : zhCn })
</script>
<style>
html, body {
    margin: 0;

}
</style>
