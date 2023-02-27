import { dummyWordDomains } from '@/domains/word/index.dummy'
import { WordDomain } from '@/domains/word/word.domain'
import { Injectable } from '@nestjs/common'

@Injectable()
export class WordService {
  getWords(): WordDomain[] {
    return dummyWordDomains
  }
}
