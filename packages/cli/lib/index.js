import createCLI from './createCLI.js'

export default function () {
  const program = createCLI()

  program.parse(process.argv)
}
