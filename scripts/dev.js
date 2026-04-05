import { spawn } from 'node:child_process'

const buildProc = spawn('node', ['src/client/build.js', '--watch'], {
  stdio: 'inherit',
})

const serverProc = spawn('node', ['--watch-path=src/server', '--watch-path=src/shared', 'src/server/index.js', '--dev'], {
  stdio: 'inherit',
})

process.on('SIGINT', () => {
  buildProc.kill()
  serverProc.kill()
  process.exit()
})

process.on('SIGTERM', () => {
  buildProc.kill()
  serverProc.kill()
  process.exit()
})
