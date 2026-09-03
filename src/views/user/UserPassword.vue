<script setup>
import { ref } from 'vue'
import PageContainer from '@/components/PageContainter.vue'
import { updateUserPwd } from '@/api/user'

const from = ref({
  oldPassword: '',
  newPassword: '',
  repassword: ''
})
const rules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' }
  ],
  repassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' }
  ]
}

// 提交表单
const submitForm = () => {
  updateUserPwd({
    old_pwd: from.value.oldPassword,
    new_pwd: from.value.newPassword,
    re_pwd: from.value.repassword
  }).then(res => {
    console.log(res)
  })
}

// 重置表单
const resetForm = () => {
  from.value.oldPassword = ''
  from.value.newPassword = ''
  from.value.repassword = ''
}
</script> 
<template>
  <PageContainer title="修改密码">
    <el-form
      class="profile-form"
      :rules="rules"
      :model="from"
      label-width="110px"> 
      <el-form-item label="原密码" prop="oldPassword">
        <el-input v-model="from.oldPassword" type="password" placeholder="请输入原密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="from.newPassword" type="password" placeholder="请输入新密码" /> 
      </el-form-item>
      <el-form-item label="确认新密码" prop="repassword">
        <el-input v-model="from.repassword" type="password" placeholder="请再次输入新密码" /> 
      </el-form-item>
      <el-form-item>
        <div class="form-actions">
          <el-button type="primary" @click="submitForm">提交修改</el-button>
          <el-button @click="resetForm">重置</el-button>
        </div>  
    </el-form-item>
    </el-form>
  </PageContainer>
</template>