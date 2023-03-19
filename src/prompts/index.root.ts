const PRIVATE_RES_HEADER = `Answer`

type PrivateSample = {
  req: string // sample questions
  res: string // expecting answer
}
interface PrivateArgs {
  command: string
  reqHeader: string
  samples: PrivateSample[]
  mainRequestStr: string
}
export class PromptRoot {
  protected buildString(args: PrivateArgs) {
    return `${args.command}
    ${args.samples
      .map(
        (sample) =>
          `${args.reqHeader}: ${sample.req}\n${PRIVATE_RES_HEADER}: ${sample.res}`,
      )
      .join('\n')}
    ${args.reqHeader}: ${args.mainRequestStr}
    ${PRIVATE_RES_HEADER}:`
  }
}
