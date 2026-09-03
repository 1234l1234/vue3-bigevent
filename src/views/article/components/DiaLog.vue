<script setup>
import { ref } from 'vue'
import { addArticle, editArticle } from '@/api/article.js'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)

// 表单数据模型
const formModel = ref({
  id: null,
  cate_name: '',
  cate_alias: ''
})
// 添加表单验证
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母数字',
      trigger: 'blur'
    }
  ]
}

const EditChannel = ( row ) => {
  dialogVisible.value = true
  if (row) {
    // 将选中行的数据填充到表单模型中
    formModel.value = { ...row }
  } else {
    formModel.value = {
      id: null,
      cate_name: '',
      cate_alias: ''
    }
  }
}
const emit = defineEmits(['refreshList']) // 定义事件用于通知父组件刷新列表
const formref = ref()
const handleConfirm = async () => {
  try {
    // 验证表单
    await   formref.value.validate()
    if (formModel.value.id) {
      // 编辑分类
      await editArticle(formModel.value)
      ElMessage.success('分类修改成功')
      emit('refreshList') // 触发父组件事件刷新列表
    } else {
      // 添加分类
      await addArticle(formModel.value)
      ElMessage.success('分类添加成功')
      emit('refreshList') // 触发父组件事件刷新列表
    }
    formModel.value = {
      id: null,
      cate_name: '',
      cate_alias: ''
    }
    dialogVisible.value = false
    // 这里可以触发父组件刷新列表的事件
  } catch (error) {
    ElMessage.error('操作失败:' + error.message || '未知错误')
    console.error('操作失败:', error)
  }
}

// 暴露方法用于显示弹窗
defineExpose({
  EditChannel
})



</script>

<template>
  <el-dialog v-model="dialogVisible" title="添加分类" width="30%">
    <div>
      <el-form
        ref="formref"
        :model="formModel"
        :rules="rules"
        label-width="100px"
        style="padding-right: 30px"
      >
        <el-form-item label="分类名称" prop="cate_name">
          <el-input
            v-model="formModel.cate_name"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input
            v-model="formModel.cate_alias"
            minlength="1"
            maxlength="15"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
