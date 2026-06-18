import { unlinkSync, rmdirSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

const dir = new URL('frontend/src/components/layout', import.meta.url).pathname

unlinkSync(join(dir, 'AppSidebar.vue'))
console.log('Deleted AppSidebar.vue')

unlinkSync(join(dir, '.gitkeep'))
console.log('Deleted .gitkeep')

const remaining = readdirSync(dir)
if (remaining.length === 0) {
  rmdirSync(dir)
  console.log('Deleted layout directory')
} else {
  console.log('Directory not empty, skipping deletion. Contents:', remaining)
}
