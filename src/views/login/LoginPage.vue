<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { userregister, userlogin } from '@/api/user'

import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/index'
import router from '@/router'

// 登录注册切换,清空表单数据
const isRegister = ref(true)
watch(isRegister, () => {
  ruleForm.value.username = ''
  ruleForm.value.password = ''
  ruleForm.value.confirmPassword = ''
})


const form = ref()

const userstore =useUserStore()
// 登录验证
const login = async () => {
  await form.value.validate()
  const token = await userlogin({
    username: ruleForm.value.username,
    password: ruleForm.value.password
  })
  userstore.setToken(token.data.token)
  ElMessage({
    message: '登陆成功',
    type: 'success',
  })
  router.push('/') 
}

// 注册验证
const register = async () => {
  await form.value.validate()
  await userregister({
    username: ruleForm.value.username,
    password: ruleForm.value.password,
    repassword: ruleForm.value.confirmPassword
  })
  ElMessage.success('注册成功')
  isRegister.value = false
}

// 表单数据
const ruleForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
})

// 表单验证规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码为6-15位非空字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/, message: '密码为6-15位非空字符', trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== ruleForm.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    }
  ],
}

</script>

<template>
  <!-- element plus 组件 -->
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form ref="form" :model="ruleForm" :rules="rules" size="large" autocomplete="off" v-if="isRegister">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="ruleForm.confirmPassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="register" class="button" type="primary" auto-insert-space>
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" underline="never" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <el-form :model="ruleForm" :rules="rules" ref="form" size="large" autocomplete="off" v-else>
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" underline="never">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" class="button" type="primary" auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" underline="never" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>