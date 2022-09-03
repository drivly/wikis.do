import { Router } from 'itty-router'
import { json, withParams } from 'itty-router-extras'
import wtf from 'wtf_wikipedia'
import camelcaseKeys from 'camelcase-keys'

const router = Router()

const api = {
  icon: '🪄✨',
  name: 'wikis.do',
  description: 'Wikipedia Metadata API',
  url: 'https://wikis.do',
  api: 'https://wikis.do/api',
  endpoints: {
    data: 'https://wikis.do/:topic',
  },
  type: 'https://apis.do',
  repo: 'https://github.com/drivly/wikis.do',
}

router.any('*', async (req, env, ctx) => {
  req.ctx = await env.CTX.fetch(req).then(res => res.json())
})

router.get('/:id', withParams, async ({id,ctx:{user}}) => {
  const doc = await wtf.fetch(decodeURI(id), 'en')
  const data = doc?.json()
  const infoboxes = camelcaseKeys(data?.sections[0]?.infoboxes, { deep: true }) //doc.infoboxes()
  
  const infobox = infoboxes.map(infobox => Object.entries(infobox).reduce((obj,[key,val]) => ({ ...obj, [key]: val.links ? val.links.reduce((acc, val) => ({...acc, [val.text ?? val.page]: 'https://wikis.do/' + val.page}),{}) : val.text }),{}))
  
  const infoboxKeys = infobox ? Object.keys(infobox[0]) : undefined
  
  const links = doc?.links()
  const text = doc?.text()
//   const markdown = doc.markdown()
  const categories = doc?.categories().reduce((acc, val) => ({...acc, [val]: 'https://wikis.do/' + val}),{})
  
  return json({api, categories, infoboxKeys, infoboxes, user, infobox, data, links, text})
})

export default {
  fetch: router.handle 
}
