import { AccessTokenDomain } from '@/domains/auth/access-token.domain'
import { GlobalLanguageCode } from '@/global.interface'
import axios from 'axios'
import { SupportedEnvAttr, envLambda } from './get-env.lambda'

const PRIVATE_DEFAULT_LANGUAGE: GlobalLanguageCode = 'en'

interface PrivateDetectLanguageRes {
  data: {
    data: {
      detections: {
        language: GlobalLanguageCode // "en",
        confidence: number // 83.896703655741,
        isReliable: boolean // true
      }[]
    }
  }
}

export const getDetectedLanguageLambda = async (
  atd: AccessTokenDomain,
  term: string,
): Promise<GlobalLanguageCode> => {
  try {
    const key = envLambda.getAdminIds().includes(atd.userId)
      ? envLambda.get(SupportedEnvAttr.AdminDetectLanguageApiKey)
      : envLambda.get(SupportedEnvAttr.NonAdminDetectLanguageApiKey)

    const res: PrivateDetectLanguageRes = await axios.post(
      `https://ws.detectlanguage.com/0.2/detect`,
      {
        q: term,
      },
      {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      },
    )

    if (res.data.data.detections.length > 0)
      return res.data.data.detections[0].language
    return PRIVATE_DEFAULT_LANGUAGE
  } catch {
    return PRIVATE_DEFAULT_LANGUAGE
  }
}
