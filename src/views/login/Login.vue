<script lang="ts" setup>
import { ref } from 'vue'
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { getVerificationCode } from '@/api/modules/login'
// import type { Rule } from 'ant-design-vue/es/form';

const form = {
  cellphone: '',
  verifyCode: ''
}
const rules = {}
const loginFormRef = ref(null)
const isLoginLoading = false
const codeButtonDisable = false
const counter = 60

function login() {}
async function getCode() {
  const res = await getVerificationCode({ phoneNumber: '15757460227' })
  // eslint-disable-next-line no-console
  console.log(res)
}
</script>

<template>
  <a-row class="h-screen">
    <a-col :span="12" class="bg-slate-500"> </a-col>
    <a-col :span="12" class="h-screen right-side">
      <a-form
        ref="loginFormRef"
        class="login-form"
        layout="vertical"
        :model="form"
        :rules="rules"
      >
        <h2>欢迎回来</h2>
        <p class="subTitle">使用手机号码和验证码登录到慕课乐高</p>
        <a-form-item label="手机号码" required name="cellphone">
          <a-input v-model:value="form.cellphone" placeholder="手机号码">
            <template #prefix
              ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
            /></template>
          </a-input>
        </a-form-item>
        <a-form-item label="验证码" required name="verifyCode">
          <a-input v-model:value="form.verifyCode" placeholder="四位验证码">
            <template #prefix
              ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
            /></template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            size="large"
            :loading="isLoginLoading"
            @click="login"
          >
            登录
          </a-button>
          <a-button
            size="large"
            :style="{ marginLeft: '20px' }"
            :disabled="codeButtonDisable"
            @click="getCode"
          >
            {{ counter === 60 ? '获取验证码' : `${counter}秒后重发` }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<style lang="scss">
.right-side {
  position: relative;
}
.login-form {
  width: 320px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
