<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script lang="ts" setup>
const nuxtApp = useNuxtApp();
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import VueVideoPlayer from "@videojs-player/vue";
import "video.js/dist/video-js.css";

nuxtApp.vueApp.use(ElementPlus, { locale: zhCn });
nuxtApp.vueApp.use(VueVideoPlayer);
</script>
<style>
html,
body {
  margin: 0;
}
</style>
