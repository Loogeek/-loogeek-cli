import ora from 'ora'
import { execa } from 'execa'
import { ESLint } from 'eslint'
import Command from '@loogeek/cli-command'
import { log, printErrorLog } from '@loogeek/cli-utils'
import vueConfig from './eslint/vueConfig.js'

/**
 * examples:
 */
class LintCommand extends Command {
  get command() {
    return 'lint'
  }

  get description() {
    return 'lint project'
  }

  get options() {
    return []
  }

  extractESLint(resultText, type) {
    const problems = /[0-9]+ problems/
    const warnings = /([0-9]+) warnings/
    const errors = /([0-9]+) errors/
    switch (type) {
      case 'problems':
        return resultText.match(problems)?.[0].match(/[0-9]+/)[0]
      case 'warnings':
        return resultText.match(warnings)?.[0].match(/[0-9]+/)[0]
      case 'errors':
        return resultText.match(errors)?.[0].match(/[0-9]+/)[0]
      default:
        return null
    }
  }

  parseESLintResult(resultText) {
    const problems = this.extractESLint(resultText, 'problems')
    const errors = this.extractESLint(resultText, 'errors')
    const warnings = this.extractESLint(resultText, 'warnings')
    return {
      problems: +problems || 0,
      errors: +errors || 0,
      warnings: +warnings || 0,
    }
  }

  async eslint() {
    // 1. eslint
    // 准备工作，安装依赖
    const spinner = ora('正在安装依赖').start()
    try {
      await execa('npm', ['install', '-D', 'eslint-plugin-vue'])
      await execa('npm', ['install', '-D', '@vue/eslint-config-airbnb'])
      // await execa('npm', ['install', '-D', '@rushstack/eslint-patch'])
    }
    catch (error) {
      printErrorLog(error)
    }
    finally {
      spinner.stop()
    }

    log.info('正在执行eslint检查')
    // 执行工作，eslint
    const cwd = process.cwd()
    const eslint = new ESLint({
      cwd,
      overrideConfig: vueConfig,
    })
    const results = await eslint.lintFiles(['./src/**/*.js', './src/**/*.vue'])
    const formatter = await eslint.loadFormatter('stylish')
    const resultText = formatter.format(results)
    console.log(resultText)
    const eslintResult = this.parseESLintResult(resultText)
    log.verbose('eslintResult', eslintResult)
    log.success('eslint检查完毕', `错误: ${eslintResult.errors}`, `，警告: ${eslintResult.warnings}`)
  }

  async action() {
    log.verbose('lint')
    await this.eslint()
    // await
  }
}

function Lint(instance) {
  return new LintCommand(instance)
}

export default Lint
