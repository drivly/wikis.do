import { Router } from 'itty-router'
import { json, withParams } from 'itty-router-extras'
import wtf from 'wtf_wikipedia'

const router = Router()

router.any('*', async (req, env, ctx) => {
  req.ctx = await env.CTX.fetch(req).then(res => res.json())
})

router.get('/:id', withParams, async ({id}) => {
  const doc = await wtf.fetch(id, 'en')
  const infobox = doc.infobox()
  const links = doc.links()
  const text = doc.text()
//   const markdown = doc.markdown()
  const categories = doc.categories()
  
  return json({infobox, links, text, markdown, categories})
})

export default {
  fetch: router.handle 
}
