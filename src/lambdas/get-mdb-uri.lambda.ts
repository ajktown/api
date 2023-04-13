import { envLambda, SupportedEnvAttr } from './get-env.lambda'

const PRIVATE_MDB_URL_HEADER = `mongodb://`

export const getMdbUriLambda = () => {
  const userName = envLambda.get(SupportedEnvAttr.MongoDbUserName)
  const password = envLambda.get(SupportedEnvAttr.MongoDbPassword)
  return `${PRIVATE_MDB_URL_HEADER}${userName}:${password}@0.0.0.0:57017/`
}
