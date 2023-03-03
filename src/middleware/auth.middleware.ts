import { Injectable } from "@nestjs/common"
import { NextFunction, Request, Response } from "express"



@Injectable()
export class AuthMiddleware {
  // TODO: Can we use that @Request stuff here?
  async use (req: Request, res: Response, next: NextFunction) {
     // TODO: Temporary, wait for 1 second
    console.log("passing middleware...")
    await new Promise((resolve) => setTimeout(resolve, 1000))

    next()
  }
}