export const stringCaseHandler = {
  toSentence: (str = ``) => str.slice(0, 1).toUpperCase() + str.slice(1),
  toPascal: (str: string) =>
    str
      .split(` `)
      .map((el) => el.slice(0, 1).toUpperCase() + el.slice(1).toLowerCase())
      .join(` `),
  toPlural: (cnt: number, singular: string, plural: string) =>
    cnt === 1 ? `${cnt} ${singular}` : `${cnt} ${plural}`,
}
