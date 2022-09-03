import { Router } from 'itty-router'
import { json, withParams } from 'itty-router-extras'
import wtf from 'wtf_wikipedia'

const router = Router()

router.any('*', async (req, env, ctx) => {
  req.ctx = await env.CTX.fetch(req).then(res => res.json())
})

router.get('/:id', withParams, async ({id}) => {
  const doc = await wtf.fetch(id.replace('%20', '_').replace(' ', '_').replace('+','_'), 'en')
  const data = doc.json()
  const infobox = data.sections[0].infoboxes //doc.infoboxes()
  
 
  
  const links = doc.links()
  const text = doc.text()
//   const markdown = doc.markdown()
  const categories = doc.categories()
  
  return json({infobox, data, links, text, categories})
})

export default {
  fetch: router.handle 
}
