import * as dotenv from 'dotenv'
dotenv.config()

export enum SupportedEnvAttr {
  // ! General
  ListeningPort = `LISTENING_PORT`,
  StrictlyEnv = `ENV`,
  // ! JWT Token Secrets
  JwtTokenSecret = `JWT_TOKEN_SECRET`,
  // !  Cross Origin Resource Sharing
  Cors = `ALLOWED_CORS`,
  // ! Mongo DB
  MdbLocalUri = `MDB_LOCAL_URI`,
  MdbProdUri = `MDB_PROD_URI`,
  // ! Open AI
  StrictlyAllowChatGtp = `IS_CHAT_GPT_ENABLED`,
  OpenAiKey = `OPEN_AI_KEY`,
  // ! Detect Language API Access Keys
  DetectLanguageApiKey = `DETECT_LANGUAGE_API_KEY`,
}

// ! Do not export Strictly imports below. They are only for this file.
enum StrictlyEnv {
  ProductMode = 'prod',
  LocalMode = 'local',
}
const PRIVATE_DEFAULT_ENV_MODE: StrictlyEnv = StrictlyEnv.LocalMode

enum StrictlyAllowChatGtp {
  AllowChatGpt = 'true',
}
// ! Do not export Strictly imports above. They are only for this file.

export const envLambda = {
  get: (
    attr: SupportedEnvAttr,
    defaultValue?: string | number,
  ): undefined | string => {
    const envData = process.env[attr]
    if (envData) return envData
    if (!defaultValue) return undefined
    return defaultValue.toString()
  },
  getCorsOrigin: (): string[] => {
    const got = envLambda.get(SupportedEnvAttr.Cors)
    if (!got)
      return [
        'http://localhost:3000,http://localhost:3100',
        'http://localhost:3200',
      ] // default value

    return got.split(',')
  },
  getJwtTokenSecret: () => {
    return envLambda.get(SupportedEnvAttr.JwtTokenSecret)
  },
  mode: {
    // TODO: Type that enforces every value of StrictlyEnv?
    getList: (): StrictlyEnv[] => {
      return [StrictlyEnv.ProductMode, StrictlyEnv.LocalMode]
    },
    get: (): StrictlyEnv => {
      const got = envLambda.get(
        SupportedEnvAttr.StrictlyEnv,
        PRIVATE_DEFAULT_ENV_MODE,
      )
      switch (got) {
        case StrictlyEnv.ProductMode:
        case StrictlyEnv.LocalMode:
          return got
        default:
          return StrictlyEnv.LocalMode
      }
    },

    isProduct: () => envLambda.mode.get() === StrictlyEnv.ProductMode,
    isLocal: () => envLambda.mode.get() === StrictlyEnv.LocalMode,
  },
  isChatGptAllowed: () => {
    if (!envLambda.mode.isLocal()) return false
    return (
      envLambda.get(SupportedEnvAttr.StrictlyAllowChatGtp) ===
      StrictlyAllowChatGtp.AllowChatGpt
    )
  },
}
