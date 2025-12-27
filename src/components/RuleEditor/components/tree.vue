<template>
  <!-- <div>{{props}}</div> -->
   <div>
    <a-input-search v-model:value="searchValue" style="margin-bottom: 8px; " placeholder="Search" />
    <a-tree style="max-width: 600px" :tree-data="props.data" v-model:expandedKeys="expandedKeys" @select="onSelectNode" :auto-expand-parent="autoExpandParent" @expand="onExpand">
      <template #title="{ title, key }">
        <div class="tree-node" @mouseenter="handleMouseEnter(title, key)">
          <div style="display: flex;" v-if="title.indexOf(searchValue) > -1">
            {{ title.substring(0, title.indexOf(searchValue)) }}
            <div style="color: #f50">{{ searchValue }}</div>
            {{ title.substring(title.indexOf(searchValue) + searchValue.length) }}
          </div>
          <div v-else>{{ title }}</div>
          <!-- <span class="desc" v-if="data.desc">{{ data.desc }}</span> -->
        </div>
      </template>
    </a-tree>
  </div>

</template>

<script>
export default { name: "Tree" };
</script>
<script setup>
// import { Tree } from "@/types/common";
import { ref, onMounted, withDefaults , defineProps, defineEmits, watch} from "vue";

// const props = withDefaults(defineProps(), {
//   data: () => [],
// });

const props = defineProps(['data'])
const emit = defineEmits(["mouseenter","node-click"]);

const handleMouseEnter = (data, key) => {
  // console.log('handleMouseEnter', data, key)
  emit("mouseenter", data);
};

var searchValue = ref('');
var autoExpandParent = ref(true);

// const handleMouseClick = (data, key) => {
//   // console.log('handleMouseClick', data, key)
//   emit("node-click", data);
// };

const onSelectNode = (selectedKeys,event) =>{
  console.log('onSelectNode',selectedKeys, event.node.dataRef)
  emit("node-click", event.node.dataRef);
}

var expandedKeys = ref([]);

onMounted(() => {
  console.log(`the component is now mounted.`, props.data)
})

const getParentKey = (key,tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

const onExpand = (keys) => {
  expandedKeys.value = keys
  autoExpandParent.value = false;
};

//把Tree展开为一层数组
const dataList = [];
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    dataList.push({ key, title: node.title });
    if (node.children) {
      generateList(node.children);
    }
  }
};

generateList(props.data);

watch(searchValue, value => {
  value = value.toUpperCase()
  console.log('props.data', props.data, dataList)
  const expanded = dataList.map((item) => {
    if (item.title.indexOf(value) > -1) {
      return getParentKey(item.key, props.data);
    }
    return null;
  }).filter((item, i, self) => item && self.indexOf(item) === i);
  // console.log('expanded', value, expanded )
  expandedKeys.value = expanded;
  searchValue.value = value;
  autoExpandParent.value = true;
});

</script>

<style>
.tree-node {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .desc {
    font-size: 12px;
    color: #999;
    margin-right: 20px;
  }
}
</style>
