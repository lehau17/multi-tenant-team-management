
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
  INVALID_PLAN_CONFIG = "INVALID_PLAN_CONFIG",
  PLAN_NOT_FOUND = "PLAN_NOT_FOUND",
  PLAN_CODE_ALREADY_EXIST = "PLAN_CODE_ALREADY_EXIST",

  // Notification Domain
  INVALID_TEMPLATE_CODE = "INVALID_TEMPLATE_CODE",
  INVALID_TEMPLATE_CONTENT = "INVALID_TEMPLATE_CONTENT",
  INVALID_LANGUAGE_CODE = "INVALID_LANGUAGE_CODE",
  TEMPLATE_TRANSLATION_EXISTS = "TEMPLATE_TRANSLATION_EXISTS",
  TEMPLATE_TRANSLATION_NOT_FOUND = "TEMPLATE_TRANSLATION_NOT_FOUND",
  EMAIL_TEMPLATE_REQUIRES_SUBJECT = "EMAIL_TEMPLATE_REQUIRES_SUBJECT",
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
  },
  [ERROR_CODE.PLAN_NOT_FOUND]: {
    vi: "Plan không tồn tại",
    en: "Plan not found"
  },
  [ERROR_CODE.PLAN_CODE_ALREADY_EXIST]: {
    vi: "Code plan đã tồn tại",
    en: "Plan code already exists"
  },

  // Notification Domain
  [ERROR_CODE.INVALID_TEMPLATE_CODE]: {
    vi: "Mã template không hợp lệ",
    en: "Invalid template code"
  },
  [ERROR_CODE.INVALID_TEMPLATE_CONTENT]: {
    vi: "Nội dung template không hợp lệ",
    en: "Invalid template content"
  },
  [ERROR_CODE.INVALID_LANGUAGE_CODE]: {
    vi: "Mã ngôn ngữ không hợp lệ",
    en: "Invalid language code"
  },
  [ERROR_CODE.TEMPLATE_TRANSLATION_EXISTS]: {
    vi: "Bản dịch cho ngôn ngữ này đã tồn tại",
    en: "Translation for this language already exists"
  },
  [ERROR_CODE.TEMPLATE_TRANSLATION_NOT_FOUND]: {
    vi: "Không tìm thấy bản dịch cho ngôn ngữ này",
    en: "Translation for this language not found"
  },
  [ERROR_CODE.EMAIL_TEMPLATE_REQUIRES_SUBJECT]: {
    vi: "Template email phải có tiêu đề",
    en: "Email template must have a subject"
  },
} as const;
