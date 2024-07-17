#!/usr/bin/env node
import importLocal from 'import-local'
import { filename } from 'dirname-filename-esm'
import entry from '../lib/index.js'

const __filename = filename(import.meta)
console.log(234234, process.argv.slice(2))

if (importLocal(__filename))
  console.log('cli', '使用本次 @loogeek-cli 版本')

else
  entry(process.argv.slice(2))
