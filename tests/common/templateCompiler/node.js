import * as BlNode from '../../../dist/common/templateCompiler/node.js'

describe('common/templateCompiler/node.js', () => {
  it('parseText', async () => {
    const format = arr => {
      return arr.map(item => item.type + '.' + (item.propName ?? item.textContent)).join(';')
    }
    chai.expect('static.{').to.equal(format(BlNode.parseText('{')))
    chai.expect('static.{}').to.equal(format(BlNode.parseText('{}')))
    chai.expect('static.}').to.equal(format(BlNode.parseText('}')))
    chai.expect('static.1{}2').to.equal(format(BlNode.parseText('1{}2')))
    chai.expect('static.1;reactive.a;static.2').to.equal(format(BlNode.parseText('1{a}2')))
    chai.expect('static.123{{}}1{}21;reactive.a;static.2').to.equal(format(BlNode.parseText('123{{}}1{}21{a}2')))
  })
})
