import promisify from './promisify'
import fs from 'fs'

export default function promisedFileRead(filepath) {
  return promisify(fs.readFile)(filepath);
}
