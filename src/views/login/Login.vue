<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { Form } from 'ant-design-vue'
import { getVerificationCode } from '@/api/modules/login'

const useForm = Form.useForm
const cellphoneReg = /^1[3-9]\d{9}$/

const form = reactive({
  cellphone: '',
  verifyCode: '',
})
const rules = reactive({
  cellphone: [
    { required: true, message: '手机号码不能为空', trigger: 'blur' },
    { pattern: cellphoneReg, message: '手机号码格式不正确', trigger: 'blur' },
  ],
  verifyCode: [
    { required: true, message: '验证码不能为空', trigger: 'blur' },
  ],
})
const isLoginLoading = false
const codeButtonDisable = computed(() => !cellphoneReg.test(form.cellphone.trim()))
const counter = 60
const { validate, validateInfos } = useForm(form, rules)

function login() {
  validate()
}
async function getCode() {
  const res = await getVerificationCode({ phoneNumber: '15757460227' })
  // eslint-disable-next-line no-console
  console.log(res)
}
</script>

<template>
  <a-row class="h-screen">
    <a-col :span="12" class="bg-slate-500" />
    <a-col :span="12" class="h-screen right-side">
      <a-form
        class="login-form"
        layout="vertical"
      >
        <h2>欢迎回来</h2>
        <p class="subTitle">
          使用手机号码和验证码登录到慕课乐高
        </p>
        <a-form-item label="手机号码" required v-bind="validateInfos.cellphone">
          <a-input v-model:value="form.cellphone" placeholder="手机号码">
            <template #prefix>
              <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="验证码" required v-bind="validateInfos.verifyCode">
          <a-input v-model:value="form.verifyCode" placeholder="四位验证码">
            <template #prefix>
              <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            :loading="isLoginLoading"
            @click="login"
          >
            登录
          </a-button>
          <a-button
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
