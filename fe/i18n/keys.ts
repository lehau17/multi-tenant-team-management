export const Namespaces = {
  HomePage: 'HomePage',
  Sidebar: 'Sidebar',
  Auth: 'Auth',
} as const

export const HomePageKeys = {
  title: 'title',
  description: 'description',
} as const

export const SidebarKeys = {
  home: 'home',
  workspace: 'workspace',
  settings: 'settings',
  projects: 'projects',
  members: 'members',
} as const

export const AuthKeys = {
  login: 'login',
  email: 'email',
  emailPlaceholder: 'emailPlaceholder',
  emailInvalid: 'emailInvalid',
  password: 'password',
  passwordPlaceholder: 'passwordPlaceholder',
  passwordMinLength: 'passwordMinLength',
  submitLogin: 'submitLogin',
  noAccount: 'noAccount',
  registerNow: 'registerNow',
  register: 'register',
  fullname: 'fullname',
  fullnamePlaceHolder: 'fullnamePlaceHolder',
  confirmPassword: 'confirmPassword',
  confirmPasswordPlaceholder: 'confirmPasswordPlaceholder',
  passwordMismatch: 'passwordMismatch',
  submitRegister: 'submitRegister',
  haveAccount: 'haveAccount',
  loginNow: 'loginNow',
} as const
