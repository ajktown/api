export class DomainRoot {
  /** For now it is private */
  private intoUniqueArray<T>(arr: T[]): T[] {
    return [...new Set(arr)]
  }

  /** For now it is private */
  private intoTrimmedArray(arr: string[]): string[] {
    return arr.map((v) => v.trim())
  }

  intoTrimmedAndUniqueArray(arr: string[]): string[] {
    // The order matters here as we want to trim first then remove duplicates
    return this.intoUniqueArray(this.intoTrimmedArray(arr))
  }
}
