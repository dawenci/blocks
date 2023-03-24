import { compile } from '../../../dist/common/templateCompiler/compile.js'

describe('common/templateCompiler/compile.js', () => {
  it('element', async () => {
    const { create } = compile(document.createElement('div'))()
    const $el = create()
    chai.expect(1).to.equal($el.childNodes.length)
    chai.expect('DIV').to.equal($el.childNodes[0].tagName)
  })

  it('text', async () => {
    var { create } = compile(document.createTextNode('TEXT'))()
    var $el = create()
    chai.expect(1).to.equal($el.childNodes.length)
    chai.expect('TEXT').to.equal($el.childNodes[0].nodeValue)
    var { create, set } = compile(document.createTextNode('{TEXT}'))({
      data: { TEXT: 'TEXT-value' },
    })
    $el = create()
    chai.expect(1).to.equal($el.childNodes.length)
    chai.expect('TEXT-value').to.equal($el.childNodes[0].nodeValue)
    set({ TEXT: 'TEXT-value-2' })
    chai.expect('TEXT-value-2').to.equal($el.childNodes[0].nodeValue)
  })

  it('attribute', async () => {
    const $div = document.createElement('div')
    $div.setAttribute('test', 'test')
    $div.setAttribute('bl:test2', 'test2')
    const { create, set } = compile($div)({ data: { test2: 'test2-value' } })
    const $el = create()
    chai.expect('test').to.equal($el.childNodes[0].getAttribute('test'))
    chai.expect('test2-value').to.equal($el.childNodes[0].getAttribute('test2'))

    set({ test2: 'test2-value-2' })
    chai.expect('test2-value-2').to.equal($el.childNodes[0].getAttribute('test2'))
  })

  it('prop', async () => {
    const $div = document.createElement('div')
    $div.setAttribute('bl-prop:prop-name', 'dataKey')
    $div.setAttribute('bl-prop:prop-name.camel', 'dataKey2')
    const { create, set } = compile($div)({ data: { dataKey: 1, dataKey2: 2 } })
    const $el = create()
    chai.expect(1).to.equal($el.childNodes[0]['prop-name'])
    chai.expect(2).to.equal($el.childNodes[0].propName)

    set({ dataKey: 3, dataKey2: 4 })
    chai.expect(3).to.equal($el.childNodes[0]['prop-name'])
    chai.expect(4).to.equal($el.childNodes[0].propName)
  })

  it('event', async () => {
    let onClick = 0
    let onClickOnce = 0

    const $div = document.createElement('div')
    $div.setAttribute('bl-on:click', 'onClick')
    $div.setAttribute('bl-on:click.once', 'onClickOnce')

    const { create } = compile($div)({
      data: {
        onClick: () => {
          onClick += 1
        },
        onClickOnce: () => {
          onClickOnce += 1
        },
      },
    })
    const $el = create()
    const $test = $el.childNodes[0]

    $test.dispatchEvent(new MouseEvent('click'))
    chai.expect(1).to.equal(onClick)
    chai.expect(1).to.equal(onClickOnce)

    $test.dispatchEvent(new MouseEvent('click'))
    chai.expect(2).to.equal(onClick)
    chai.expect(1).to.equal(onClickOnce)
  })

  it('html', async () => {
    const $div = document.createElement('bl-html')
    $div.setAttribute('content', 'html')
    const { create, set } = compile($div)({
      data: { html: '<div style="color:red"></div>' },
    })
    const $el = create()
    chai.expect('DIV').to.equal($el.childNodes[0].nodeName)
    chai.expect('red').to.equal($el.childNodes[0].style.color)

    set({ html: '<span style="color:blue"></span>' })
    chai.expect('SPAN').to.equal($el.childNodes[0].nodeName)
    chai.expect('blue').to.equal($el.childNodes[0].style.color)
  })

  it('if', async () => {
    const $if = document.createElement('bl-if')
    $if.setAttribute('cond', 'cond')
    $if.appendChild(document.createElement('div'))

    var { create, set } = compile($if)({
      data: { cond: true },
    })
    var $el = create()

    chai.expect('DIV').to.equal($el.childNodes[0].nodeName)

    set({ cond: false })
    chai.expect(8).to.equal($el.childNodes[0].nodeType)

    set({ cond: true })
    chai.expect('DIV').to.equal($el.childNodes[0].nodeName)

    const $template2 = document.createElement('template')
    $template2.innerHTML = `
    <bl-if cond="cond1">
      <span class="cond1"></span>
      <bl-if cond="cond2">
        <span class="cond2"></span>
      </bl-if>
    </bl-if>
    `
    var t2 = compile($template2.content.querySelector('bl-if'))({
      data: {
        cond1: true,
        cond2: true,
      },
    })
    var $el2 = t2.create()
    chai.expect('cond1').to.equal($el2.querySelector('.cond1').className)
    chai.expect('cond2').to.equal($el2.querySelector('.cond2').className)

    // 避免 set({ cond: false });set({ cond: true, cond2: false });set({ cond: false }) 报错
    t2.set({ cond1: false })
    t2.set({ cond1: true, cond2: false })
    t2.set({ cond1: false })
    // 避免 set({ cond: false, cond2: false });set({ cond: true });set({ cond: false }) 报错
    t2.set({ cond1: false, cond2: false })
    t2.set({ cond1: true })
    t2.set({ cond1: false })
  })

  it('for', async () => {
    const $t1 = document.createElement('template')
    $t1.innerHTML = /*html*/ `<bl-for each:item="list"><p>{item.name}{item.nested.value}</p></bl-for>`
    var $for = $t1.content.querySelector('bl-for')
    var { create, set } = compile($for)({
      data: {
        list: [
          { name: 'item', nested: { value: 1 } },
          { name: 'item', nested: { value: 2 } },
        ],
      },
    })
    var $el = create()
    chai.expect(3).to.equal($el.childNodes.length)
    chai.expect('item1').to.equal($el.childNodes[0].innerText)
    chai.expect('item2').to.equal($el.childNodes[1].innerText)

    set({
      list: [
        { name: 'item', nested: { value: 3 } },
        { name: 'item', nested: { value: 4 } },
      ],
    })
    chai.expect(3).to.equal($el.childNodes.length)
    chai.expect('item3').to.equal($el.childNodes[0].innerText)
    chai.expect('item4').to.equal($el.childNodes[1].innerText)

    set({
      list: [{ name: 'item', nested: { value: 5 } }],
    })
    chai.expect(2).to.equal($el.childNodes.length)
    chai.expect('item5').to.equal($el.childNodes[0].innerText)

    set({
      list: [
        { name: 'item', nested: { value: 6 } },
        { name: 'item', nested: { value: 7 } },
      ],
    })
    chai.expect(3).to.equal($el.childNodes.length)
    chai.expect('item6').to.equal($el.childNodes[0].innerText)
    chai.expect('item7').to.equal($el.childNodes[1].innerText)
  })
})
