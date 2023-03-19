import { getEnvLambda, SupportedEnvAttr } from './get-env.lambda'

const PRIVATE_MDB_URL_HEADER = `mongodb://`

export const getMdbUriLambda = () => {
  const userName = getEnvLambda(SupportedEnvAttr.MongoDbUserName)
  const password = getEnvLambda(SupportedEnvAttr.MongoDbPassword)
  return `${PRIVATE_MDB_URL_HEADER}${userName}:${password}@0.0.0.0:57017/`
}
