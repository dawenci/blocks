/// <reference types="cypress" />

context('templateCompiler', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/tests/common/template-compiler.html')
  })

  function template(innerHTML) {
    const $t = document.createElement('template')
    $t.innerHTML = innerHTML
    return $t
  }

  it('element', () => {
    cy.window().then(win => {
      const { create } = win.compile(document.createElement('div')).make()
      const $el = create()
      expect(1).to.equal($el.childNodes.length)
      expect('DIV').to.equal($el.childNodes[0].tagName)
    })
  })

  it('text', () => {
    cy.window().then(win => {
      const $t = template(`<t text="TEXT"></t>`)

      var { create } = win.compile($t.content.querySelector('t')).make()
      var $el = create()
      expect(1).to.equal($el.childNodes.length)
      expect('').to.equal($el.childNodes[0].nodeValue)

      var { create, set } = win.compile($t.content.querySelector('t')).make({
        model: { TEXT: 'TEXT-value' },
      })
      $el = create()
      expect(1).to.equal($el.childNodes.length)
      expect('TEXT-value').to.equal($el.childNodes[0].nodeValue)
      set({ TEXT: 'TEXT-value-2' })
      expect('TEXT-value-2').to.equal($el.childNodes[0].nodeValue)
    })
  })

  it('attribute', () => {
    cy.window().then(win => {
      const $t = template(`<div test="test" bl-attr="test2<-test2"></div>`)

      const { create, set } = win.compile($t.content.querySelector('div')).make({ model: { test2: 'test2-value' } })
      const $el = create()
      expect('test').to.equal($el.childNodes[0].getAttribute('test'))
      expect('test2-value').to.equal($el.childNodes[0].getAttribute('test2'))

      set({ test2: 'test2-value-2' })
      expect('test2-value-2').to.equal($el.childNodes[0].getAttribute('test2'))
    })
  })

  it('prop', () => {
    cy.window().then(win => {
      const $t = template(`<div bl-prop="prop-name<-dataKey, propName<-dataKey2"></div>`)
      const { create, set } = win.compile($t.content.querySelector('div')).make({ model: { dataKey: 1, dataKey2: 2 } })
      const $el = create()
      expect(1).to.equal($el.childNodes[0]['prop-name'])
      expect(2).to.equal($el.childNodes[0].propName)

      set({ dataKey: 3, dataKey2: 4 })
      expect(3).to.equal($el.childNodes[0]['prop-name'])
      expect(4).to.equal($el.childNodes[0].propName)
    })
  })

  it('event', () => {
    cy.window().then(win => {
      const $t = template(`<div bl-on="click<-onClick, click.once<-onClickOnce"></div>`)
      let onClick = 0
      let onClickOnce = 0

      const { create } = win.compile($t.content.querySelector('div')).make({
        model: {
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
      expect(1).to.equal(onClick)
      expect(1).to.equal(onClickOnce)

      $test.dispatchEvent(new MouseEvent('click'))
      expect(2).to.equal(onClick)
      expect(1).to.equal(onClickOnce)
    })
  })

  it('html', () => {
    cy.window().then(win => {
      const $t = document.createElement('template')
      $t.innerHTML = `<rich html="html"></rich>`

      const { create, set } = win.compile($t.content.querySelector('rich')).make({
        model: { html: '<div style="color:red"></div>' },
      })
      const $el = create()
      expect('DIV').to.equal($el.childNodes[0].nodeName)
      expect('red').to.equal($el.childNodes[0].style.color)

      set({ html: '<span style="color:blue"></span>' })
      expect('SPAN').to.equal($el.childNodes[0].nodeName)
      expect('blue').to.equal($el.childNodes[0].style.color)
    })
  })

  it('if', () => {
    cy.window().then(win => {
      const $t = document.createElement('template')
      $t.innerHTML = `<if cond="cond"><div></div></if>`

      var { create, set } = win.compile($t.content.querySelector('if')).make({
        model: { cond: true },
      })
      var $el = create()

      expect('DIV').to.equal($el.childNodes[0].nodeName)

      set({ cond: false })
      expect(8).to.equal($el.childNodes[0].nodeType)

      set({ cond: true })
      expect('DIV').to.equal($el.childNodes[0].nodeName)

      const $t2 = document.createElement('template')
      $t2.innerHTML = `
      <if cond="cond1">
        <span class="cond1"></span>
        <if cond="cond2">
          <span class="cond2"></span>
        </if>
      </if>
      `
      var t2 = win.compile($t2.content.querySelector('if')).make({
        model: {
          cond1: true,
          cond2: true,
        },
      })
      var $el2 = t2.create()
      expect('cond1').to.equal($el2.querySelector('.cond1').className)
      expect('cond2').to.equal($el2.querySelector('.cond2').className)

      // 避免 set({ cond: false });set({ cond: true, cond2: false });set({ cond: false }) 报错
      t2.set({ cond1: false })
      t2.set({ cond1: true, cond2: false })
      t2.set({ cond1: false })
      // 避免 set({ cond: false, cond2: false });set({ cond: true });set({ cond: false }) 报错
      t2.set({ cond1: false, cond2: false })
      t2.set({ cond1: true })
      t2.set({ cond1: false })
    })
  })

  it('for', () => {
    cy.window().then(win => {
      const $t1 = document.createElement('template')
      $t1.innerHTML = /*html*/ `<for each="list" as="item"><p><t text="item.name"></t><t text="item.nested.value"></t></p></for>`

      var $for = $t1.content.querySelector('for')
      var { create, set } = win.compile($for).make({
        model: {
          list: [
            { name: 'item', nested: { value: 1 } },
            { name: 'item', nested: { value: 2 } },
          ],
        },
      })
      var $el = create()
      expect(3).to.equal($el.childNodes.length)
      expect('item1').to.equal($el.childNodes[0].innerText)
      expect('item2').to.equal($el.childNodes[1].innerText)

      set({
        list: [
          { name: 'item', nested: { value: 3 } },
          { name: 'item', nested: { value: 4 } },
        ],
      })
      expect(3).to.equal($el.childNodes.length)
      expect('item3').to.equal($el.childNodes[0].innerText)
      expect('item4').to.equal($el.childNodes[1].innerText)

      set({
        list: [{ name: 'item', nested: { value: 5 } }],
      })
      expect(2).to.equal($el.childNodes.length)
      expect('item5').to.equal($el.childNodes[0].innerText)

      set({
        list: [
          { name: 'item', nested: { value: 6 } },
          { name: 'item', nested: { value: 7 } },
        ],
      })
      expect(3).to.equal($el.childNodes.length)
      expect('item6').to.equal($el.childNodes[0].innerText)
      expect('item7').to.equal($el.childNodes[1].innerText)
    })
  })

  it('for:outer env access', () => {
    cy.window().then(win => {
      const $t = template(
        `<for each="outerList" as="outerItem"><for each="innerList" as="innerItem"><t text="text"></t><t text="outerItem.text"></t><t text="innerItem.text"></t></for></for>`
      )
      var { create } = win.compile($t.content.childNodes[0]).make({
        model: {
          text: 'ROOT TEXT',
          outerList: [{ text: 'OUTER TEXT' }],
          innerList: [{ text: 'INNER TEXT' }],
        },
      })
      const $el = create()
      expect('ROOT TEXT').to.equal($el.childNodes[0].nodeValue)
      expect('OUTER TEXT').to.equal($el.childNodes[1].nodeValue)
      expect('INNER TEXT').to.equal($el.childNodes[2].nodeValue)
    })
  })
})
