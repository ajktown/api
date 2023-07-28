import { ApiHomePath } from '@/controllers/app.controller'
import { AuthControllerPath } from '@/controllers/auth.controller'
import { AjkTownApiVersion } from '@/controllers/index.interface'
import { RequestMethod } from '@nestjs/common'
import { RouteInfo } from '@nestjs/common/interfaces'

/**
 * All of the paths that should be excluded from auth middleware.
 */

type PathAndMethod = [string, RequestMethod]

/** Root paths do not contain basic prefix like /api/v1 unlike other api paths. */
const privateRootPaths: PathAndMethod[] = [
  [ApiHomePath.Home, RequestMethod.GET],
  [ApiHomePath.Healthz, RequestMethod.GET],
  [ApiHomePath.HomeHelloWorld, RequestMethod.GET],
]

// API First version paths
const privateV1Paths: PathAndMethod[] = [
  [AuthControllerPath.PostSignOut, RequestMethod.POST],
  [AuthControllerPath.PostGoogleAuth, RequestMethod.POST],
  [AuthControllerPath.PostDevTokenAuth, RequestMethod.POST],
  [AuthControllerPath.GetAuthPrep, RequestMethod.GET],
]

const getV1Path = ([path, method]: PathAndMethod): PathAndMethod => {
  return [AjkTownApiVersion.V1 + '/' + path, method]
}

export const authMdlExcludedPaths: RouteInfo[] = [
  ...privateRootPaths,
  ...privateV1Paths.map(getV1Path),
].map(([path, method]) => ({ path, method }))
