
export enum ERROR_CODE {
  EMAIL_ALREADY_EXIST = 'EMAIL_ALREADY_EXIST',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_DATA_REQUEST = 'INVALID_DATA_REQUEST',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  WORKSPACENAME_ALREADY_EXIST = "WORKSPACENAME_ALREADY_EXIST",
  MEMBER_ALREADDY_INVITED = "MEMBER_ALREADDY_INVITED",
  PROJECT_IDENTIFIER_ALREADY_EXIST = "PROJECT_IDENTIFIER_ALREADY_EXIST",
  INVALID_PLAN_NAME = "INVALID_PLAN_NAME",
  INVALID_PLAN_CODE = "INVALID_PLAN_CODE",
  INVALID_PLAN_PRICE = "INVALID_PLAN_PRICE",
  INVALID_PLAN_CONFIG = "INVALID_PLAN_CONFIG"
}

type Translation = { [key in 'vi' | 'en']: string };

export const ERROR_MESSAGE_TRANSLATIONS: Record<ERROR_CODE, Translation> = {
  [ERROR_CODE.EMAIL_ALREADY_EXIST]: {
    vi: "Email đã tồn tại",
    en: "Email already exists"
  },
  [ERROR_CODE.USER_NOT_FOUND]: {
    vi: "Người dùng không tồn tại",
    en: "User not found"
  },
  [ERROR_CODE.INVALID_DATA_REQUEST]: {
    vi: "Dữ liệu yêu cầu không hợp lệ",
    en: "Invalid data request"
  },
  [ERROR_CODE.INVALID_CREDENTIALS]: {
    vi: "Email hoặc mật khẩu không chính xác",
    en: "Incorrect email or password"
  },
[ERROR_CODE.WORKSPACENAME_ALREADY_EXIST]: {
    vi: "Tên workspace đã tồn tại",
    en: "Workspace name already exists"
  },
  [ERROR_CODE.MEMBER_ALREADDY_INVITED]: {
    vi: "",
    en : ""
  },
  [ERROR_CODE.PROJECT_IDENTIFIER_ALREADY_EXIST]: {
    vi: "Identifier project đã tồn tại trong workspace",
    en: "Project identifier already exists in workspace"
  },
  [ERROR_CODE.INVALID_PLAN_NAME]: {
    vi: "Tên plan không được để trống",
    en: "Plan name must not be empty"
  },
  [ERROR_CODE.INVALID_PLAN_CODE]: {
    vi: "Code plan không được để trống",
    en: "Plan code must not be empty"
  },
  [ERROR_CODE.INVALID_PLAN_PRICE]: {
    vi: "Giá plan không được âm",
    en: "Plan price must not be negative"
  },
  [ERROR_CODE.INVALID_PLAN_CONFIG]: {
    vi: "Cấu hình plan không hợp lệ",
    en: "Invalid plan configuration"
  }
} as const;
