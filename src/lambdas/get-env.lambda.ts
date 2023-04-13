import * as dotenv from 'dotenv'
dotenv.config()

export enum SupportedEnvAttr {
  // ! General
  ListeningPort = `LISTENING_PORT`,
  StrictlyEnv = `ENV`,
  // ! Mongo DB
  MongoDbUserName = `MDB_USER_NAME`, // The current PROD name is "jeongwookim"
  MongoDbPassword = `MDB_PASSWORD`, // The current PROD pw is "zrb****************"
  // ! Open AI
  StrictlyAllowChatGtp = `IS_CHAT_GPT_ENABLED`,
  OpenAiKey = `OPEN_AI_KEY`,
}

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
  mode: {
    isProduct: () =>
      envLambda.get(SupportedEnvAttr.StrictlyEnv) === StrictlyEnv.ProductMode,
    isLocal: () =>
      envLambda.get(SupportedEnvAttr.StrictlyEnv, PRIVATE_DEFAULT_ENV_MODE) ===
      StrictlyEnv.LocalMode,
  },
  isChatGptAllowed: () => {
    if (!envLambda.mode.isLocal()) return false
    return (
      envLambda.get(SupportedEnvAttr.StrictlyAllowChatGtp) ===
      StrictlyAllowChatGtp.AllowChatGpt
    )
  },
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
