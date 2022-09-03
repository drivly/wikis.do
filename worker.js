import { Router } from 'itty-router'
import { json, withParams } from 'itty-router-extras'
import wtf from 'wtf_wikipedia'
import camelcaseKeys from 'camelcase-keys'

const router = Router()

router.any('*', async (req, env, ctx) => {
  req.ctx = await env.CTX.fetch(req).then(res => res.json())
})

router.get('/:id', withParams, async ({id}) => {
  const doc = await wtf.fetch(id.replace('%20', '_').replace(' ', '_').replace('+','_'), 'en')
  const data = doc.json()
  const infobox = camelcaseKeys(data.sections[0].infoboxes, { deep: true }) //doc.infoboxes()
  
  const infoboxes = Object.keys(infobox).map(key => infobox[key].links = infobox[key].links?.reduce((acc, val) => ({...acc, [val.text ?? val.page]: 'https://wikis.do/' + val.page}),{}))
  
 
  
  const links = doc.links()
  const text = doc.text()
//   const markdown = doc.markdown()
  const categories = doc.categories().
  
  return json({infoboxes, infobox, data, links, text, categories}).reduce((acc, val) => ({...acc, [val]: 'https://wikis.do/' + val}),{}))
})

export default {
  fetch: router.handle 
}
