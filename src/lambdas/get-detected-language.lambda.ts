import { GlobalLanguageCode } from '@/global.interface'
import axios from 'axios'
import { SupportedEnvAttr, envLambda } from './get-env.lambda'
import { Logger } from '@nestjs/common'

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
  term: string,
  logger: Logger,
): Promise<GlobalLanguageCode> => {
  try {
    const key = envLambda.get(SupportedEnvAttr.DetectLanguageApiKey)

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

    if (res.data.data.detections.length > 0) {
      logger.verbose(
        `Detected language: ${res.data.data.detections[0].language}`,
      )
      return res.data.data.detections[0].language
    }

    return PRIVATE_DEFAULT_LANGUAGE
  } catch (err) {
    logger.warn(
      `Failed to detect language with the following error: ${err}. Default language is returned: ${PRIVATE_DEFAULT_LANGUAGE}`,
    )
    return PRIVATE_DEFAULT_LANGUAGE
  }
}
