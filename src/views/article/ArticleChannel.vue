<script setup>
import { ref } from 'vue'
import PageContainer from '@/components/PageContainter.vue'
import { getArticleList , delArticle } from '@/api/article.js'
import DiaLog from './components/DiaLog.vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const editlog = ref()
const isloading = ref(false)  

// 获取文章分类列表
const channelList = ref([])
const getlist = async () => {
  isloading.value = true
  try {
    const res = await getArticleList()
    channelList.value = res.data.data || []
  } finally {
    isloading.value = false
  }
}
getlist()

// 添加分类
const add = () => {
  editlog.value.EditChannel()
}
// 编辑分类
const onEditChannel = (row) => {
  editlog.value.EditChannel(row)
}
// 删除分类
const onDelChannel =async (row) => { 
  await ElMessageBox.confirm('确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 确认删除，执行删除逻辑
    await delArticle(row.id)
    ElMessage.success('删除成功')
    getlist() // 刷新列表
  }).catch(() => {
    // 取消删除，不做任何操作
    return
  })
}

</script>
<template>
  <PageContainer title="文章分类">
    <template #extra>
      <el-button type="primary" @click="add"> 添加分类 </el-button>
    </template>

    <el-table :loading="isloading" :data="channelList" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <DiaLog ref="editlog" @refreshList="getlist"> </DiaLog>
  </PageContainer>
</template>