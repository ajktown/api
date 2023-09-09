import { GlobalLanguageCode } from '@/global.interface'

export type SupportedDictService =
  | 'google'
  | 'naver_dictionary'
  | 'dictionary_dot_come'
  | 'urban_dictionary'

export type AvailableDictCode = {
  id: string
  serviceName: SupportedDictService
  dictFrom: GlobalLanguageCode | 'ALL'
  dictTo: GlobalLanguageCode | 'ALL'
  prefixUrl: string
  // suffixUrl: string // suffixUrl is not yet supported as it is not needed for now
}

/** List of third-party supported dictionary services
 */
export const availableDictCodes: AvailableDictCode[] = [
  {
    id: 'google_en_en',
    serviceName: 'google',
    dictFrom: 'en',
    dictTo: 'en',
    prefixUrl: 'https://www.google.com/search?q=define%20',
  },
  {
    id: 'naver_dictionary_ko_ko',
    serviceName: 'naver_dictionary',
    dictFrom: 'ko',
    dictTo: 'ko',
    prefixUrl: 'https://ko.dict.naver.com/#/search?range=all&query=',
  },
  {
    id: 'naver_dictionary_en_ko',
    serviceName: 'naver_dictionary',
    dictFrom: 'en',
    dictTo: 'ko',
    prefixUrl: 'https://en.dict.naver.com/#/search?range=all&query=',
  },
  {
    id: 'naver_dictionary_ja_ko',
    serviceName: 'naver_dictionary',
    dictFrom: 'ja',
    dictTo: 'ko',
    prefixUrl: 'https://ja.dict.naver.com/#/search?range=all&query=',
  },
  {
    id: 'naver_dictionary_fa_ko',
    serviceName: 'naver_dictionary',
    dictFrom: 'fa',
    dictTo: 'ko',
    prefixUrl: 'https://dict.naver.com/frkodict/#/search?query=',
  },
  {
    id: 'naver_dictionary_zh_ko',
    serviceName: 'naver_dictionary',
    dictFrom: 'zh',
    dictTo: 'ko',
    prefixUrl: 'https://zh.dict.naver.com/#/search?range=all&query=',
  },
  {
    id: 'naver_dictionary_ko_ja',
    serviceName: 'naver_dictionary',
    dictFrom: 'ko',
    dictTo: 'ja',
    prefixUrl: 'https://korean.dict.naver.com/#/search?range=all&query=',
  },
  {
    id: 'dictionary_dot_come_en_en',
    serviceName: 'dictionary_dot_come',
    dictFrom: 'en',
    dictTo: 'en',
    prefixUrl: 'https://www.dictionary.com/browse/',
  },
  {
    id: 'urban_dictionary_en_en',
    serviceName: 'urban_dictionary',
    dictFrom: 'en',
    dictTo: 'en',
    prefixUrl: 'https://www.urbandictionary.com/define.php?term=',
  },
]
