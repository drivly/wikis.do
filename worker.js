import { Router } from 'itty-router'
import { json } from 'itty-router-extras'
import wtf from 'wtf_wikipedia'

router.any('*', async (req, env, ctx) => {
  req.ctx = await this.env.CTX.fetch(req).then(res => res.json())
}

router.get('/', async (req, env, ctx) => {
  data = await wtf.fetch('Tony Hawk', 'en')
  return json({data})
})

export default {
  fetch: router.handle 
}