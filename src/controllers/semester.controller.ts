import { Controller, Get, Param } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'
import { SemesterService } from '@/services/semester.service'

enum ApiHomePath {
  GetSemesters = `semesters`,
  GetSemesterById = `semesters/:id`,
}
@Controller(AjkTownApiVersion.V1)
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Get(ApiHomePath.GetSemesters)
  getSemesters() {
    return this.semesterService.getSemesters()
  }

  @Get(ApiHomePath.GetSemesterById)
  getSemesterById(
    @Param('id') id: string,
  ) {
    return this.semesterService.getSemesterById(id)
  }
}
