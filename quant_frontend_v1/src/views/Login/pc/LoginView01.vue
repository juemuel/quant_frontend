<template>
  <div>
    <div class="signin-form">
      <el-form class="login-container" label-position="left" label-width="0px">
        <h3 class="login_title">系统登录</h3>
        <el-form-item>
          <el-input type="text" v-model="data.loginForm.username" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" v-model="data.loginForm.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%">
          <el-button type="primary" style="width: 100%;background: #505458;border: none" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import loginApi from '@/api/loginApi'
import { onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus'
import { routerKey, useRouter } from 'vue-router';
import { useStore } from 'vuex'
const router = useRouter()
const store = useStore()
const data = reactive({
  loginForm: {
    username: '',
    password: ''
  },
  rules: {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' }
    ]
  },
  loading: false
})
const login = async () => {
  try {
    const params = {
      userName: data.loginForm.username,
      passWord: data.loginForm.password
    }
    loginApi.login(params).then((res) => {
      console.log('res', res)
      if (res.code === 200) {
        ElMessage.success('登录成功')
        store.commit('userInfoModule/loginChange', {
          userName: data.loginForm.username,
          Authorization: res.data.token,
          role: res.data.role,
          signTime: new Date().getTime(),
          id: res.data.id
        })
        router.push('/home')
      } else {
        ElMessage.error('登录失败')
      }
      data.loading = false
    })
  } catch (error) {
    console.error('Failed to simulate:', error)
  }
}
</script>

<style scoped lang="scss">
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

</style>
