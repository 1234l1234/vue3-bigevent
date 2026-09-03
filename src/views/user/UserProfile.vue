<script setup>
import { ref } from 'vue'
import PageContainer from '@/components/PageContainter.vue'
import { useUserStore } from '@/stores'
import { updateUserInfo } from '@/api/user'


const userStore = useUserStore()
const from = ref({
  id: userStore.userInfo.id,
  username: userStore.userInfo.username,
  nickname: userStore.userInfo.nickname,
  email: userStore.userInfo.email
})
const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ]
}

const submitForm = () => {
  updateUserInfo(from.value).then(res => {
    console.log(res)
  })
}

</script> 
<template>
  <PageContainer title="基本资料">
    <el-form
      class="profile-form"
      :model="from"
      :rules="rules"
      label-width="110px"
      label-position="right"
    >
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="from.username" />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="from.nickname" />
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="from.email" />
      </el-form-item>
      <el-form-item>
        <div class="form-actions">
          <el-button type="primary" @click="submitForm">提交修改</el-button>
        </div>
      </el-form-item>
    </el-form>
  </PageContainer>
</template>

<style lang="scss" scoped>
.profile-form {
  max-width: 560px;
}

:deep(.el-form-item__label) {
  text-align: right;
}

.form-actions {
  padding-left: 110px;
}
</style>