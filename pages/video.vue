<template>
  <h1>VUE PLAYER</h1>
  <el-input
    v-model="tempFormula"
    class="mr-1"
    clearable
    placeholder="输入公式"
  />
  <video-player
    :height="580"
    :loop="true"
    :volume="0.6"
    :width="600"
    controls
    poster="/your-path/poster.jpg"
    src="F2L/URU'R'.mp4"
  />
  <div></div>
</template>
<script setup>
let tempFormula = ref("a");
</script>
