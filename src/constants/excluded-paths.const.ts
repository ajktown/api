import { ApiHomePath } from '@/controllers/app.controller'
import { AuthControllerPath } from '@/controllers/auth.controller'
import { AjkTownApiVersion } from '@/controllers/index.interface'
import { RequestMethod } from '@nestjs/common'
import { RouteInfo } from '@nestjs/common/interfaces'

type PathAndMethod = [string, RequestMethod]

// Does not have /api/v1 paths
const privateExcludedPaths: PathAndMethod[] = [
  [ApiHomePath.Home, RequestMethod.GET],
  [ApiHomePath.HomeHelloWorld, RequestMethod.GET],
]

// Does have /api/v1 prefix
const privateV1Paths: PathAndMethod[] = [
  [AuthControllerPath.PostSignOut, RequestMethod.POST],
  [AuthControllerPath.GetAuthPrep, RequestMethod.GET],
  [AuthControllerPath.PostGoogleAuth, RequestMethod.POST],
  [AuthControllerPath.PostDevTokenAuth, RequestMethod.POST],
]

const getV1Path = ([path, method]: PathAndMethod): PathAndMethod => {
  return [AjkTownApiVersion.V1 + '/' + path, method]
}

export const excludedPaths: RouteInfo[] = [
  ...privateExcludedPaths,
  ...privateV1Paths.map(getV1Path),
].map(([path, method]) => ({ path, method }))
