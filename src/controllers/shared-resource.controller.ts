import { Controller, Post } from '@nestjs/common'
import { AjkTownApiVersion } from './index.interface'

enum SemesterControllerPath {
  PostSharedResource = `shared-resource`,
}
@Controller(AjkTownApiVersion.V1)
export class SharedResourceController {
  @Post(SemesterControllerPath.PostSharedResource)
  async postSharedResource() {
    return 'hello world! post shared resource!'
  }
}
