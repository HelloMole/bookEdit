<template>
  <div>
    <a-button type="primary" size="default" @click="open">编辑</a-button>
    <Editor ref="editor"></Editor>
  </div>
</template>

<script>
export default { name: "RulesEditor" };
</script>
<script setup>
import Editor from "@/components/RuleEditor/index.vue";
import { ref } from "vue";

const editor = ref();

const open = () => {
  editor.value?.open();
};
</script>

<style></style>
