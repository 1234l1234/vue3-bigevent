<script setup>
import { ref } from 'vue'
import { getArticleList } from '@/api/article'

defineProps({
  modelValue: { type: [String, Number] },
  width: { type: String, default: '200px' }
})
const emit = defineEmits(['update:modelValue'])
const channelList = ref([])
getArticleList().then(res => {
  channelList.value = res.data.data
  
})
</script>

<template>
  <el-select :modelValue="modelValue" @change="emit('update:modelValue', $event)"  :style="{ width: width }" >
    <el-option v-for="item in channelList" :key="item.id" :label="item.cate_name" :value="item.id"></el-option>
  </el-select>
</template>