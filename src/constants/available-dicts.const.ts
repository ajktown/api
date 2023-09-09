import { GlobalLanguageCode } from '@/global.interface'

export type SupportedDictService =
  | 'google'
  | 'naver_dictionary'
  | 'dictionary_dot_come'
  | 'urban_dictionary'

export type AvailableDictCode = {
  serviceName: SupportedDictService
  dictFrom: GlobalLanguageCode | 'ALL_LANGUAGES'
  dictTo: GlobalLanguageCode | 'ALL_LANGUAGES'
  prefixUrl: string
  // suffixUrl: string // suffixUrl is not yet supported as it is not needed for now
}

export const availableDictCodes: AvailableDictCode[] = [
  {
    serviceName: 'google',
    dictFrom: 'ALL_LANGUAGES',
    dictTo: 'ALL_LANGUAGES',
    prefixUrl: 'https://www.google.com/search?q=define%20',
  },
  {
    serviceName: 'naver_dictionary',
    dictFrom: 'ko',
    dictTo: 'ko',
    prefixUrl: 'https://ko.dict.naver.com/#/search?range=all&query=',
  },
  {
    serviceName: 'naver_dictionary',
    dictFrom: 'en',
    dictTo: 'ko',
    prefixUrl: 'https://en.dict.naver.com/#/search?range=all&query=',
  },
  {
    serviceName: 'naver_dictionary',
    dictFrom: 'ja',
    dictTo: 'ko',
    prefixUrl: 'https://ja.dict.naver.com/#/search?range=all&query=',
  },
  {
    serviceName: 'naver_dictionary',
    dictFrom: 'zh',
    dictTo: 'ko',
    prefixUrl: 'https://zh.dict.naver.com/#/search?range=all&query=',
  },
  {
    serviceName: 'naver_dictionary',
    dictFrom: 'ko',
    dictTo: 'ja',
    prefixUrl: 'https://korean.dict.naver.com/#/search?range=all&query=',
  },
  {
    serviceName: 'dictionary_dot_come',
    dictFrom: 'en',
    dictTo: 'en',
    prefixUrl: 'https://www.dictionary.com/browse/',
  },
  {
    serviceName: 'urban_dictionary',
    dictFrom: 'en',
    dictTo: 'en',
    prefixUrl: 'https://www.urbandictionary.com/define.php?term=',
  },
]
