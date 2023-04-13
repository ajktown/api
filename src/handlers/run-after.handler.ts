// if you want to make sure the action is conditionally called afterSeconds,
// Please put the logic inside of the action itself, rather than modifying this simple purposed handler.\

// TODO: This handler requires spec test
// TODO: The spec test should include conditional action, so that the developer can compare and understand how to use.

export const runAfterHandler = (action: () => any, afterSeconds: number) => {
  const milliseconds: number = afterSeconds * 1000
  setTimeout(() => {
    action()
  }, milliseconds)
}
