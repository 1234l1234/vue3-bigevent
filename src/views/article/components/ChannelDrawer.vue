<script setup>
import ChannelSelect from './ChannelSelect.vue'
import axios from 'axios'
import { baseURL } from '@/utils/request.js'
import { addArticleInfo,getArticleDetail,updateArticleInfo } from '@/api/article.js'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'

const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}
const imgUrl = ref('')
const drawer = ref(false)
const editorRef = ref()
const formModel = ref({ ...defaultForm })

const open =async (row) => {
  drawer.value = true
  if (row) {
    // 获取文章详情
    const res =  await getArticleDetail(row.id)
    formModel.value = res.data.data
    console.log(res.data.data)
    // 图片地址
    imgUrl.value = baseURL + formModel.value.cover_img
    formModel.value.cover_img = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
  } else {
   
    editorRef.value.setContents('')
    formModel.value = { ...defaultForm }
    imgUrl.value = formModel.value.cover_img 
  }
}


async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageData = response.data;

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], { type: response.headers['content-type'] });

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type });

    return file;
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error);
    throw error;
  }
}



// 图片上传显示
const onUploadFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
}

const emit = defineEmits(['success'])
// 提交文章
const onpublic = async (state) => {
  formModel.value.state = state
  console.log('提交', formModel.value)
  const formData = new FormData()
  for (const key in formModel.value) {
    formData.append(key, formModel.value[key])
  }

  if (formModel.value.id) {
    // 编辑
    await updateArticleInfo(formData)
    ElMessage.success('编辑成功')
    drawer.value = false
    emit('success', 'edit')
  } else {
    // 添加请求
    await addArticleInfo(formData)
    ElMessage.success('添加成功')
    drawer.value = false
    emit('success', 'add')
  }
  
}



defineExpose({
  open
})
</script>

<template>
  <el-drawer v-model="drawer" :title="formModel.id ? '编辑文章' : '添加文章'" direction="rtl" size="50%">
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="文章分类" prop="cate_id">
        <channel-select v-model="formModel.cate_id" width="100%"></channel-select>
      </el-form-item>

      <el-form-item label="文章封面" prop="cover_img">
        <el-upload class="avatar-uploader" :auto-upload="false" :show-file-list="false" :on-change="onUploadFile">
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="文章内容" prop="content">
        <div class="editor" >
          <quill-editor ref="editorRef" theme="snow" v-model:content="formModel.content" contentType="html">
          </quill-editor>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onpublic('已发布')">发布</el-button>
        <el-button type="info" @click="onpublic('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped lang="scss">
.avatar-uploader {
  :deep(){
    .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>