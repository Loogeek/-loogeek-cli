import path from 'node:path'
import { homedir } from 'node:os'
import { getLatestVersion, log, makeInput, makeList, printErrorLog, request } from '@loogeek/cli-utils'

const ADD_TYPE_PROJECT = 'project'
const ADD_TYPE_PAGE = 'page'
const ADD_TYPE = [
  {
    name: '项目',
    value: ADD_TYPE_PROJECT,
  },
  {
    name: '页面',
    value: ADD_TYPE_PAGE,
  },
]
// const ADD_TEMPLATE = [
//   {
//     name: 'vue3项目模板',
//     npmName: '@imooc.com/template-vue3',
//     version: '1.0.0',
//     value: 'template-vue3',
//   },
//   {
//     name: 'react18项目模板',
//     npmName: '@imooc.com/template-react18',
//     version: '1.0.0',
//     value: 'template-react18',
//   },
// ]

const TEMP_HOME = '.loogeek-cli'

// 获取创建类型
function getAddType() {
  return makeList({
    choices: ADD_TYPE,
    message: '请选择初始化类型',
    defaultValue: ADD_TYPE_PROJECT,
  })
}

// 获取项目名称
function getAddName() {
  return makeInput({
    message: '请输入项目名称',
    defaultValue: '',
    validate(v) {
      if (v.length > 0)
        return true

      return '项目名称必须输入'
    },
  })
}

// 获取项目模板
function getAddTemplate(addTemplate) {
  return makeList({
    choices: addTemplate,
    message: '请选择项目模板',
  })
}

// 选择所在团队
function getAddTeam(team) {
  return makeList({
    choices: team.map(item => ({ name: item, value: item })),
    message: '请选择团队',
  })
}

// 安装缓存目录
function makeTargetPath() {
  return path.resolve(`${homedir()}/${TEMP_HOME}`, 'addTemplate')
}

// 通过API获取项目模板
async function getTemplateFromAPI() {
  try {
    const data = await request({
      url: '/v1/project',
      method: 'get',
    })
    log.verbose('getTemplateFromAPI', data)
    return data
  }
  catch (error) {
    printErrorLog(error)

    return null
  }
}

export default async function createTemplate(name, opts) {
  const { type, template } = opts
  let addType // 创建项目名称
  let addName // 项目名称
  let selectedTemplate // 项目模板

  const addTemplate = await getTemplateFromAPI()
  if (!addTemplate)
    throw new Error('项目模板不存在！')

  if (type)
    addType = type
  else
    addType = await getAddType()

  log.verbose('addType', addType)

  if (addType === ADD_TYPE_PROJECT) {
    if (name)
      addName = name
    else
      addName = await getAddName()

    log.verbose('addName', addName)

    if (template) {
      selectedTemplate = addTemplate.find(tp => tp.value === template)
      if (!selectedTemplate)
        throw new Error(`项目模板 ${template} 不存在！`)
    }
    else {
      // 获取团队信息
      let teamList = addTemplate.map(t => t.team)
      teamList = [...new Set(teamList)]
      const addTeam = await getAddTeam(teamList)
      log.verbose('addTeam', addTeam)

      const curAddTemplate = await getAddTemplate(addTemplate.filter(t => t.team === addTeam))
      log.verbose('curAddTemplate', curAddTemplate)
      selectedTemplate = addTemplate.find(tp => tp.value === curAddTemplate)
      if (!selectedTemplate)
        throw new Error(`项目模板不存在！`)
    }
    log.verbose('selectedTemplate', selectedTemplate)

    // 获取最新版本号
    const latestVersion = await getLatestVersion(selectedTemplate.npmName)
    log.verbose('latestVersion', latestVersion)
    selectedTemplate.version = latestVersion
    const targetPath = makeTargetPath()

    return {
      type: addType,
      name: addName,
      template: selectedTemplate,
      targetPath,
    }
  }
}
