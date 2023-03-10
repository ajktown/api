import { dummyWordDomains } from '@/domains/word/index.dummy'
import { WordDomain } from '@/domains/word/word.domain'
import { Injectable } from '@nestjs/common'

@Injectable()
export class WordService {
  get(): WordDomain[] {
    return dummyWordDomains
  }

  getById(id: string): WordDomain | undefined {
    console.log({ id }) // TODO: Remove it
    return dummyWordDomains[0] // TODO: Fix it, it just returns the first index
  }
}
