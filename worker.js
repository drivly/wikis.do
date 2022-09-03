import { Router } from 'itty-router'
import { json, withParams } from 'itty-router-extras'
import wtf from 'wtf_wikipedia'

const router = Router()

router.any('*', async (req, env, ctx) => {
  req.ctx = await env.CTX.fetch(req).then(res => res.json())
})

router.get('/:id', withParams, async ({id}) => {
  const data = await wtf.fetch(id, 'en').then(doc => doc.json())
  return json({data})
})

export default {
  fetch: router.handle 
}
