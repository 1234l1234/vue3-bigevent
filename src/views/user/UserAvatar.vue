<script setup>
import { ref } from 'vue'
import PageContainer from '@/components/PageContainter.vue'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { updateUserAvatar } from '@/api/user'

const userStore = useUserStore()
console.log(userStore.userInfo.user_pic)
const imgUrl = ref(userStore.userInfo.user_pic ? userStore.userInfo.user_pic : '')
const avatarBase64 = ref('')

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('图片读取失败'))
    reader.readAsDataURL(file)
  })
}

const handleAvatarSuccess = (response, uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
}

const onChange = async (uploadFile) => {
  const file = uploadFile.raw
  if (!file) return

  avatarBase64.value = await fileToBase64(file)
  imgUrl.value = avatarBase64.value
  isableUpload.value = false
}

// 上传前校验
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 选择图片
const onSelectImage = () => {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0]
    if (file) {
      avatarBase64.value = await fileToBase64(file)
      imgUrl.value = avatarBase64.value
      isableUpload.value = false
    }
  })
  fileInput.click()
}

const isableUpload = ref(true)

const submitForm = async () => {
  if (!avatarBase64.value) {
    ElMessage.warning('请先选择图片')
    return
  }

  try {
    const res = await updateUserAvatar(avatarBase64.value)
    console.log(res)
    ElMessage.success('头像上传成功')
    isableUpload.value = true
  } catch (error) {
    console.error(error)
    ElMessage.error('头像上传失败')
  }
}


</script> 
<template>
  <PageContainer title="更换头像">
    <el-upload
    class="avatar-uploader"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :on-change="onChange"
    >
    <img v-if="imgUrl" :src="imgUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <el-button @click = "onSelectImage" type="primary">选择图片</el-button>
    <el-button :disabled="isableUpload" @click="submitForm" type="success">上传</el-button>
  </PageContainer>
</template>


<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>