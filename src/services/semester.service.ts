import { Injectable } from '@nestjs/common'
import { DUMMY_SEMESTERS } from '@/domains/semester/index.dummy'
import { ISemester } from '@/domains/semester/index.interface'

@Injectable()
export class SemesterService {
  getSemesters(): Partial<ISemester>[] {
    return DUMMY_SEMESTERS.map((e) => e.toResDTO())
  }
}
