export type TLoginResponse = {
  user: {
    id: string
    email: string
    fullname: string
  }
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

export type TLoginRequest = {
  email: string
  password: string
}

export type TRegisterRequest = {
  fullname: string
  email: string
  password: string
}

export type TRegisterResponse = {
  id: string
}
