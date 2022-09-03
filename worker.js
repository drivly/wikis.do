import { Router } from 'itty-router'
import { json } from 'itty-router-extras'
import wtf from 'wtf_wikipedia'

router.get('/', (req, env, ctx) => {
  data = await wtf.fetch('Tony Hawk', 'en')
  return json({data})
})

export default {
  fetch: router.handle 
}
