import { Router } from 'itty-router'
import { json, withParams } from 'itty-router-extras'
import wtf from 'wtf_wikipedia'
import camelcaseKeys from 'camelcase-keys'

const router = Router()

const api = {
  icon: '🪄✨',
  name: 'wikis.do',
  description: 'Wiki Data',
  url: 'https://wikis.do',
  api: 'https://wikis.do/api',
  endpoints: {
    data: 'https://wikis.do/:topic',
  },
  type: 'https://apis.do/data',
  repo: 'https://github.com/drivly/wikis.do',
}

// router.any('*', async (req, env, ctx) => {
//   const {user} = await env.CTX.fetch(req).then(res => res.json())
//   req.user = user
// })

router.get('/:id', withParams, async (req, env) => {
  const {id} = req
  const {user} = await env.CTX.fetch(req).then(res => res.json())
  const doc = await wtf.fetch(decodeURI(id), 'en')
  const article = doc?.json()
  const infoboxes = article?.sections[0] && article?.sections[0]?.infoboxes ? camelcaseKeys(article?.sections[0]?.infoboxes, { deep: true }) : []
//   const infoboxes = doc?.infoboxes().map(infobox => camelcaseKeys(infobox.json(), { deep: true }))
  
//   const data = infoboxes?.map(infobox => Object.entries(infobox).reduce((obj,[key,val]) => ({ ...obj, [key]: val.links ? val.links.reduce((acc, val) => ({...acc, [val.text ?? val.page]: 'https://wikis.do/' + val.page}),{}) : val.text }),{})) ?? article
  const data = Object.entries(infoboxes[0]).reduce((obj,[key,val]) => ({ ...obj, [key]: val.links ? val.links.reduce((acc, val) => ({...acc, [val.text ?? val.page]: 'https://wikis.do/' + val.page}),{}) : val.text }),{}) ?? article
  const tables = doc?.tables().map(table => table.keyValue())
  const templates = doc?.templates().map(template => template.json())
  const links = doc?.links().reduce((acc,l) => ({...acc, [l.page()]: 'https://wikis.do/' + l.page()}),{})
  const text = doc?.text()
//   const markdown = doc.markdown()
  const categories = doc?.categories().reduce((acc, val) => ({...acc, [val]: 'https://wikis.do/' + val}),{})
  
  return json({api, title: decodeURI(id), data, categories, links, tables, templates, user })
})

export default {
  fetch: router.handle 
}
