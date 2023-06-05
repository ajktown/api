import { envLambda, SupportedEnvAttr } from './get-env.lambda'

/** Returns production mdb path, if env is production */
export const getMdbUriLambda = (): string => {
  if (envLambda.mode.isProduct())
    return envLambda.get(SupportedEnvAttr.MdbProdUri)
  return envLambda.get(SupportedEnvAttr.MdbLocalUri)
}
