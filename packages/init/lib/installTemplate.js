import path from 'node:path'
import fse from 'fs-extra'
import { pathExistsSync } from 'path-exists'
import ora from 'ora'
import ejs from 'ejs'
import { glob } from 'glob'
import { log, makeInput, makeList, printErrorLog } from '@loogeek/cli-utils'

function getCacheFilePath(targetPath, template) {
  return path.resolve(targetPath, 'node_modules', template.npmName, 'template')
}

function getCachePluginPath(targetPath, template) {
  return path.resolve(targetPath, 'node_modules', template.npmName, 'plugins', 'index.js')
}

function copyFile(targetPath, template, installDir) {
  const originFile = getCacheFilePath(targetPath, template)
  const fileList = fse.readdirSync(originFile)
  const spinner = ora('正在拷贝模板文件...').start()
  fileList?.forEach((file) => {
    fse.copySync(`${originFile}/${file}`, `${installDir}/${file}`)
  })
  spinner.stop()
  log.success('模板拷贝成功！')
}

async function ejsRender(targetPath, installDir, template, name) {
  log.verbose('ejsRender', installDir, template)
  const { ignore = [] } = template

  let data = {}
  const pluginPath = getCachePluginPath(targetPath, template)
  if (pathExistsSync(pluginPath)) {
    const pluginFn = (await import(pluginPath)).default
    const api = {
      makeList,
      makeInput,
    }

    data = await pluginFn(api)
  }

  const ejsData = {
    data: {
      name, // 渲染package name名称
      ...data,
    },
  }

  try {
    const files = await glob('**', {
      cwd: installDir,
      nodir: true,
      ignore: [
        ...ignore,
        '**/node_modules/**',
      ],
    })

    files?.forEach((file) => {
      const filePath = path.join(installDir, file)
      log.verbose('filePath', filePath)
      ejs.renderFile(filePath, ejsData, (err, result) => {
        if (!err)
          fse.writeFileSync(filePath, result)
        else
          printErrorLog(err)
      })
    })
    // })
  }
  catch (error) {
    printErrorLog(error)
  }
}

export default async function installTemplate(selectedTemplate, opts) {
  const { force = false } = opts
  const { targetPath, name, template } = selectedTemplate
  const rootDir = process.cwd()

  fse.ensureDirSync(targetPath)
  const installDir = path.resolve(`${rootDir}/${name}`)
  log.verbose('installDir', installDir)

  if (pathExistsSync(installDir)) {
    if (!force) {
      log.error(`当前目录下已存在 ${installDir} 文件夹`)
      return
    }
    else {
      fse.removeSync(installDir)
      fse.ensureDirSync(installDir)
    }
  }
  else {
    fse.ensureDirSync(installDir)
  }
  copyFile(targetPath, template, installDir)

  // 渲染ejs模板数据
  await ejsRender(targetPath, installDir, template, name)
}
