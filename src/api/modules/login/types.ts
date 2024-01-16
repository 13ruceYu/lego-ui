interface VerificationCodeRes {
  veriCode: string
}

interface VerificationCodeReq {
  phoneNumber: string
}

interface PhoneReq {
  phoneNumber: string
  veriCode: string
}

interface PhoneRes {
  token: string
}

interface UserRes {
  username?: string
  id?: string
  phoneNumber?: string
  nickName?: string
  description?: string
  updatedAt?: string
  createdAt?: string
  iat?: number
  exp?: number
  picture?: string
  gender?: string
}

export type { VerificationCodeRes, VerificationCodeReq, PhoneReq, PhoneRes, UserRes }
