import fs from 'fs'
import path from 'path'
import * as url from 'url'

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

let oConfig = null;

async function setConfig() {
  try {    
    oConfig = fs.readFileSync(path.join(__dirname,'../config.json'),'utf8')
    oConfig = JSON.parse(oConfig)
    return oConfig
  }
  catch (e) {
    console.error('setConfig Error',e, e.stack);
    throw e
  }
}

const config = await setConfig()
export default config
