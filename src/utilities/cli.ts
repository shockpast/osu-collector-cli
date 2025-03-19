export function waitForClose(message = "Press any key to exit...") {
  return new Promise<void>(() => {
    console.log(message)

    process.stdin.setRawMode(true)
    process.stdin.resume()

    process.stdin.on("data", () => {
      process.exit(0)
    })
  })
}