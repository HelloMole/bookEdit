<template>
  <a-modal
    v-model:open="state.visible"
    title="配置公式"
    width="800px"
    @cancel="close"
    @ok="close"
  >
    <div class="editor-container">
      <TreeCom class="editor-tree" :data="state.paramsData"  @node-click="insertTag"></TreeCom>
      <div class="editor-content">
        <div class="editor-main" ref="myDiv"></div>
        <div class="fn">
          <div class="fn-list">
            <TreeCom :default-expand-all="true" :data="state.fnData" @node-click="insertFn" @mouseenter="hoverFn"></TreeCom>
          </div>
          <div class="fn-desc">
            <DescCom v-bind="state.info"></DescCom>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div>
        <a-button @click="close">取消</a-button>
        <a-button type="primary" @click="submit">确认</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
export default { name: "Editor" };
</script>
<script  setup>
import { nextTick, reactive, ref} from "vue";
import TreeCom from "./components/tree.vue";
import DescCom from "./components/desc.vue";
import { useCodemirror, validateFormula } from "./index.js";
import {fnData, functionDescription } from "./fnData.js";

// import { Tree } from "@/types/common";

const state = reactive({
  visible: false,
  paramsData: [
    {
      title: "参数1",
      key: "1",
      enCode: 'arg1',
      value: 'number',
    },
    {
      title: "参数2",
      key: "2",
      enCode: 'arg2',
      value: 'number',
    },
    {
      title: "参数3",
      key: "3",
      enCode: 'arg3',
      value: 'string',
    },
  ],
  fnData: fnData,
  info: {},
});

const { code, view, editorRef, init, destroyed, insertText } = useCodemirror();
/**
 * @description 插入标签
 */
const insertTag = (data) => {
  if (!data.children) {
    insertText(`${data.key}.${data.title}`, 'tag');
  }
};
/**
 * @description 插入函数
 */
const insertFn = (data) => {
  if (!data.children) {
    insertText(`${data.title}`, "fn");
  }
};
/**
 * @description 鼠标悬停展示函数描述
 */
const hoverFn = (data) => {
  const info = functionDescription[data];
  if (info) {
    state.info = info;
  }
};
/**
 * @description 获取数据
 */
const submit = () => {
  const data = view.value?.state.doc;
  // console.log('fnData', state.fnData)
  var result = validateFormula(data.text.join('\n') , state.paramsData )
  console.log('validateFormula', result);
};
const myDiv = ref(null);
const open = () => {
  state.visible = true;
  nextTick(() => {
    init(myDiv.value);
  });
};
const close = () => {
  destroyed();
  state.visible = false;
};

defineExpose({
  open,
});
</script>

<style>
.editor-container {
  position: relative;
  .editor-tree {
    width: 200px;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
  }
  .editor-content {
    margin-left: 210px;
    display: flex;
    flex-direction: column;
    .editor-main {
      border: 1px solid #ccc;
      height: 200px;
    }
    .fn {
      display: flex;
      height: 200px;
      > div {
        flex: 1;
        border: 1px solid #ccc;
      }
    }
  }
}
:deep(.cm-focused) {
  outline: none;
}
:deep(.cm-gutters) {
  display: none;
}
</style>
