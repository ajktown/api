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

export const getEnvLambda = (
  attr: SupportedEnvAttr,
  defaultValue?: string | number,
): undefined | string => {
  const envData = process.env[attr]
  if (envData) return envData
  if (!defaultValue) return undefined
  return defaultValue.toString()
}

export enum StrictlyEnv {
  ProductMode = 'prod',
  LocalMode = 'local',
}

export enum StrictlyAllowChatGtp {
  AllowChatGpt = 'true',
}
