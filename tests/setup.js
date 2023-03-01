import './libs/chai.min.js'
import './libs/mocha.min.js'
import * as Bl from '../dist/index.js'

mocha.setup('bdd')
window.Bl = Bl

const $testRoot = document.createElement('div')
$testRoot.id = 'test-root'
$testRoot.style.cssText =
  'position:absolute;top:0;left:-99999px;width:100%;height:100%;'
document.body.appendChild($testRoot)
window.$testRoot = $testRoot

window.mount = $el => $testRoot.appendChild($el)
window.unmount = $el => {
  $testRoot.removeChild($el)
}

window.delay = n =>
  new Promise(resolve => {
    setTimeout(resolve, n)
  })
