import * as dotenv from 'dotenv'
dotenv.config()

export enum SupportedEnvAttr {
  // ! General
  ListeningPort = `LISTENING_PORT`,
  // ! Mongo DB
  MongoDbUserName = `MDB_USER_NAME`, // The current PROD name is "jeongwookim"
  MongoDbPassword = `MDB_PASSWORD`, // The current PROD pw is "zrb****************"
  // ! Open AI
  OpenAiKey = `OPEN_AI_KEY`,
}

export const getEnvLambda = (
  attr: SupportedEnvAttr,
  defaultValue?: string | number,
): undefined | string => {
  return process.env[attr] || defaultValue.toString()
}
