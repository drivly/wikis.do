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
  type: 'https://apis.do/data',
  repo: 'https://github.com/drivly/wikis.do',
}

router.any('*', async (req, env, ctx) => {
  const {user} = await env.CTX.fetch(req).then(res => res.json())
  req.user = user
})

router.get('/:id', withParams, async ({id,user}) => {
  const doc = await wtf.fetch(decodeURI(id), 'en')
  const json = doc?.json()
  const infoboxes = camelcaseKeys(data?.sections[0]?.infoboxes, { deep: true }) //doc.infoboxes()
  
  const data = infoboxes?.map(infobox => Object.entries(infobox).reduce((obj,[key,val]) => ({ ...obj, [key]: val.links ? val.links.reduce((acc, val) => ({...acc, [val.text ?? val.page]: 'https://wikis.do/' + val.page}),{}) : val.text }),{}))
    
  const links = doc?.links().reduce((acc,l) => ({...acc, [l.page()]: 'https://wikis.do/' + l.page()}),{})
  const text = doc?.text()
//   const markdown = doc.markdown()
  const categories = doc?.categories().reduce((acc, val) => ({...acc, [val]: 'https://wikis.do/' + val}),{})
  
  return json({api, data, categories, links, user, })
})

export default {
  fetch: router.handle 
}
