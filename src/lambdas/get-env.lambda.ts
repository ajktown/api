import * as dotenv from 'dotenv'
dotenv.config()

export enum SupportedEnvAttr {
  Port = `PORT`,
  MongoDbUserName = `MDB_USER_NAME`, // The current PROD name is "jeongwookim"
  MongoDbPassword = `MDB_PASSWORD`, // The current PROD pw is "zrb****************"
}

export const getEnvLambda = (attr: SupportedEnvAttr): undefined | string => {
  return process.env[attr]
}
