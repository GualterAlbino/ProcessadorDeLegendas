import { parentPort, workerData } from 'worker_threads'
import fs from 'node:fs'

// O worker recebe o caminho e processa o arquivo
const processSubtitles = async (path: string) => {
  const rows = await pathsToRows(path)
  const words = await prepareData(rows)
  const groupedWords = await groupWords(words)
  return groupedWords
}

processSubtitles(workerData).then((result) => {
  parentPort?.postMessage(result)
})

function groupWords(words) {
  return new Promise((resolver, reject) => {
    try {
      const groupedWords = words.reduce((obj, word) => {
        if (obj[word]) {
          obj[word] = obj[word] + 1
        } else {
          obj[word] = 1
        }
        return obj
      }, {})

      const groupedWordsArray = Object.keys(groupedWords)
        .map((key) => ({ name: key, amount: groupedWords[key] }))
        .sort((w1, w2) => w2.amount - w1.amount)

      resolver(groupedWordsArray)
    } catch (e) {
      reject(e)
    }
  })
}

function prepareData(rows) {
  return new Promise((resolver, reject) => {
    try {
      const words = rows
        .filter(filterValidRow)
        .map(removePunctuation)
        .map(removeTags)
        .reduce(mergeRows)
        .split(' ')
        .map((word) => word.toLowerCase())
        .map((word) => word.replace('"', ''))

      resolver(words)
    } catch (e) {
      reject(e)
    }
  })
}

function filterValidRow(row) {
  const notNumber = !parseInt(row.trim())
  const notEmpty = !!row.trim()
  const notInterval = !row.includes('-->')
  return notNumber && notEmpty && notInterval
}

const removePunctuation = (row) => row.replace(/[,?!.-]/g, '')
const removeTags = (row) => row.replace(/(<[^>]+)>/gi, '').trim()
const mergeRows = (fullText, row) => `${fullText} ${row}`

function pathsToRows(paths) {
  return new Promise((resolver, reject) => {
    try {
      const rows = paths
        .map((path) => fs.readFileSync(path).toString('utf-8'))
        .reduce((fullText, fileText) => `${fullText}\n${fileText}`)
        .split('\n')
      resolver(rows)
    } catch (e) {
      reject(e)
    }
  })
}
