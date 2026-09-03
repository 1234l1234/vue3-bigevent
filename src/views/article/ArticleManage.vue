<script setup>
import { formatTime } from '@/utils/format'
import PageContainer from '@/components/PageContainter.vue'
import channelSelect from './components/ChannelSelect.vue'
import ChannelDrawer from './components/ChannelDrawer.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getArticle, deleteArticle } from '@/api/article.js'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'

const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})

const articleList = ref([])
const total = ref(0)
const loading = ref(false)

// 获取文章列表
const getArticleList = async () => {

  loading.value = true
  const res = await getArticle(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArticleList()


// 分页逻辑
const onSizeChange = (val) => {
  params.value.pagenum = 1
  params.value.pagesize = val
  getArticleList()
}
const onCurrentChange = (val) => {
  params.value.pagenum = val
  getArticleList()
}

// 表单搜索
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}
// 重置搜索表单
const resetForm = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

// 抽屉绑定
const drawer = ref()
// 添加文章
const onAddArticle = () => {
  drawer.value.open()
}
// 编辑文章
const onEditChannel = (row) => {
  drawer.value.open(row)
}

// 删除文章
const onDelChannel = (row) => {
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 确认删除，执行删除逻辑
    await deleteArticle(row.id)
    ElMessage.success('删除成功')
    getArticleList()
  }).catch(() => {
    // 取消删除，不做任何操作
  })
}

// 抽屉提交成功回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，需要跳转渲染最后一页，编辑直接渲染当前页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  getArticleList()
}



</script>

<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle()">发布文章</el-button>
    </template>

    <!-- 搜索表单 -->
    <el-form :inline="true">
      <el-form-item label="文章分类：">
        <channel-select v-model="params.cate_id" />
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>


    <!-- 文章列表 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" width="120">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发布时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="onEditChannel(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="onDelChannel(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--  分页 -->
    <el-pagination v-model:current-page="params.pagenum" v-model:page-size="params.pagesize"
      :page-sizes="[3, 4, 5, 8, 10]" :background="true" layout="total, sizes, prev, pager, next, jumper"
      :total="total" @size-change="onSizeChange" @current-change="onCurrentChange"
      style="justify-content:center; margin-top:20px" />

    <!-- 抽屉 -->
    <ChannelDrawer ref="drawer" @success="onSuccess" />

  </PageContainer>
</template>


<style scoped>
.el-input {
  --el-input-width: 220px;
}

.el-select {
  --el-select-width: 220px;
}
</style>