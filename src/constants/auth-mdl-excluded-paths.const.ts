import { ApiHomePath } from '@/controllers/app.controller'
import { AuthControllerPath } from '@/controllers/auth.controller'
import { AjkTownApiVersion } from '@/controllers/index.interface'
import { SharedResourceControllerPath } from '@/controllers/shared-resource.controller'
import { UserControllerPath } from '@/controllers/user.controller'
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
  [UserControllerPath.GetUserByNickname, RequestMethod.GET],
  [UserControllerPath.GetRitualsOfUserByNickname, RequestMethod.GET],
  [UserControllerPath.GetActionGroupsOfUserById, RequestMethod.GET],
  [AuthControllerPath.PostSignOut, RequestMethod.POST],
  [AuthControllerPath.PostGoogleAuth, RequestMethod.POST],
  [AuthControllerPath.PostDevTokenAuth, RequestMethod.POST],
  [AuthControllerPath.GetAuthPrep, RequestMethod.GET],
  [SharedResourceControllerPath.DeprecatedGetSharedResource, RequestMethod.GET],
  [SharedResourceControllerPath.GetSharedResources, RequestMethod.GET],
]

// API Second version paths
// const privateV2Paths: PathAndMethod[] = [
//   [AuthControllerPath.PostSignOut, RequestMethod.POST],
//   [AuthControllerPath.PostGoogleAuth, RequestMethod.POST],
//   [AuthControllerPath.PostDevTokenAuth, RequestMethod.POST],
//   [AuthControllerPath.GetAuthPrep, RequestMethod.GET],
//   [SharedResourceControllerPath.GetSharedResource, RequestMethod.GET],
// ]

const getV1Path = ([path, method]: PathAndMethod): PathAndMethod => {
  return [AjkTownApiVersion.V1 + '/' + path, method]
}

// const getV2Path = ([path, method]: PathAndMethod): PathAndMethod => {
//   return [AjkTownApiVersion.V2 + '/' + path, method]
// }

export const authMdlExcludedPaths: RouteInfo[] = [
  ...privateRootPaths,
  ...privateV1Paths.map(getV1Path),
  // ...privateV2Paths.map(getV2Path),
].map(([path, method]) => ({ path, method }))
