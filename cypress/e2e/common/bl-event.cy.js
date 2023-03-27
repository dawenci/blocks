/// <reference types="cypress" />

import { BlEvent } from '../../../tests/dist/common/BlEvent.js'
// import { BlEvent } from '../../../dist/common/BlEvent.js'

context('templateCompiler', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/tests/common/bl-event.html')
  })

  it('on', () => {
    // on(type, callback)
    const e1 = new BlEvent()
    const o1 = { v: 0 }
    e1.on('test', () => {
      o1.v++
    })
    expect(o1.v).to.equal(0)
    e1.trigger('test')
    expect(o1.v).to.equal(1)
    e1.trigger('test')
    expect(o1.v).to.equal(2)

    // on(types, callback)
    const e2 = new BlEvent()
    const o2 = { v: 0 }
    e2.on(['test1', 'test2'], () => {
      o2.v++
    })
    expect(o2.v).to.equal(0)
    e2.trigger('test1')
    expect(o2.v).to.equal(1)
    e2.trigger('test1')
    expect(o2.v).to.equal(2)
    e2.trigger('test2')
    expect(o2.v).to.equal(3)
    e2.trigger('test2')
    expect(o2.v).to.equal(4)

    // on(keyValue)
    const e3 = new BlEvent()
    const o3 = { v: 0 }
    e3.on({
      test: () => {
        o3.v++
      },
    })
    expect(o3.v).to.equal(0)
    e3.trigger('test')
    expect(o3.v).to.equal(1)
    e3.trigger('test')
    expect(o3.v).to.equal(2)

    // on('all', callback)
    const e4 = new BlEvent()
    const o4 = { v: 0 }
    e4.on('all', () => {
      o4.v++
    })
    expect(o4.v).to.equal(0)
    e4.trigger('any')
    expect(o4.v).to.equal(1)
    // trigger all 时，会触发 2 次，其中一次是 type 恰好等于 all 而触发的，另一次是自动触发的 all event
    e4.trigger('all')
    expect(o4.v).to.equal(3)
  })

  it('once', () => {
    // once(type, callback)
    const e1 = new BlEvent()
    const o1 = { v: 0 }
    e1.once('test', () => {
      o1.v++
    })
    expect(o1.v).to.equal(0)
    e1.trigger('test')
    expect(o1.v).to.equal(1)
    e1.trigger('test')
    expect(o1.v).to.equal(1)

    // once(types, callback)
    const e2 = new BlEvent()
    const o2 = { v: 0 }
    e2.once(['test1', 'test2'], () => {
      o2.v++
    })
    expect(o2.v).to.equal(0)
    e2.trigger('test1')
    expect(o2.v).to.equal(1)
    e2.trigger('test1')
    expect(o2.v).to.equal(1)
    e2.trigger('test2')
    expect(o2.v).to.equal(2)
    e2.trigger('test2')
    expect(o2.v).to.equal(2)

    // once(keyValue)
    const e3 = new BlEvent()
    const o3 = { v: 0 }
    e3.once({
      test: () => {
        o3.v++
      },
    })
    expect(o3.v).to.equal(0)
    e3.trigger('test')
    expect(o3.v).to.equal(1)
    e3.trigger('test')
    expect(o3.v).to.equal(1)

    // once('all', callback)
    const e4 = new BlEvent()
    const o4 = { v: 0 }
    e4.once('all', () => {
      o4.v++
    })
    expect(o4.v).to.equal(0)
    e4.trigger('test1')
    expect(o4.v).to.equal(1)
    e4.trigger('test2')
    expect(o4.v).to.equal(1)
  })

  it('listenTo', () => {
    // listenTo(obj, type, callback)
    const t1 = new BlEvent()
    const e1 = new BlEvent()
    const o1 = { v: 0 }
    const h1 = () => {
      o1.v++
    }
    e1.listenTo(t1, 'test', h1)
    expect(o1.v).to.equal(0)
    t1.trigger('test')
    expect(o1.v).to.equal(1)
    t1.trigger('test')
    expect(o1.v).to.equal(2)

    // listenTo(obj, types, callback)
    const t2 = new BlEvent()
    const e2 = new BlEvent()
    const o2 = { v: 0 }
    e2.listenTo(t2, ['test1', 'test2'], () => {
      o2.v++
    })
    expect(o2.v).to.equal(0)
    t2.trigger('test1')
    expect(o2.v).to.equal(1)
    t2.trigger('test1')
    expect(o2.v).to.equal(2)
    t2.trigger('test2')
    expect(o2.v).to.equal(3)
    t2.trigger('test2')
    expect(o2.v).to.equal(4)

    // listenTo(obj, keyValue)
    const t3 = new BlEvent()
    const e3 = new BlEvent()
    const o3 = { v: 0 }
    e3.listenTo(t3, {
      test: () => {
        o3.v++
      },
    })
    expect(o3.v).to.equal(0)
    t3.trigger('test')
    expect(o3.v).to.equal(1)
    t3.trigger('test')
    expect(o3.v).to.equal(2)

    // listenTo(obj, 'all', callback)
    const t4 = new BlEvent()
    const e4 = new BlEvent()
    const o4 = { v: 0 }
    e4.listenTo(t4, 'all', () => {
      o4.v++
    })
    expect(o4.v).to.equal(0)
    t4.trigger('any')
    expect(o4.v).to.equal(1)
    // trigger all 时，会触发 2 次，其中一次是 type 恰好等于 all 而触发的，另一次是自动触发的 all event
    t4.trigger('all')
    expect(o4.v).to.equal(3)

    // listenTo(notBlEvent, )
    const t5 = {}
    const e5 = new BlEvent()
    e5.listenTo(t5, 'all', () => {
      /* do nothing，不抛错 */
    })
  })

  it('listenToOnce', () => {
    // listenToOnce(other, type, callback)
    const t1 = new BlEvent()
    const e1 = new BlEvent()
    const o1 = { v: 0 }
    e1.listenToOnce(t1, 'test', () => {
      o1.v++
    })
    expect(o1.v).to.equal(0)
    t1.trigger('test')
    expect(o1.v).to.equal(1)
    t1.trigger('test')
    expect(o1.v).to.equal(1)

    // listenToOnce(other, types, callback)
    const t2 = new BlEvent()
    const e2 = new BlEvent()
    const o2 = { v: 0 }
    e2.listenToOnce(t2, ['test1', 'test2'], () => {
      o2.v++
    })
    expect(o2.v).to.equal(0)
    t2.trigger('test1')
    expect(o2.v).to.equal(1)
    t2.trigger('test1')
    expect(o2.v).to.equal(1)
    t2.trigger('test2')
    expect(o2.v).to.equal(2)
    t2.trigger('test2')
    expect(o2.v).to.equal(2)

    // listenToOnce(other, keyValue)
    const t3 = new BlEvent()
    const e3 = new BlEvent()
    const o3 = { v: 0 }
    e3.listenToOnce(t3, {
      test: () => {
        o3.v++
      },
    })
    expect(o3.v).to.equal(0)
    t3.trigger('test')
    expect(o3.v).to.equal(1)
    t3.trigger('test')
    expect(o3.v).to.equal(1)

    // listenToOnce(other, 'all', callback)
    const t4 = new BlEvent()
    const e4 = new BlEvent()
    const o4 = { v: 0 }
    e4.listenToOnce(t4, 'all', () => {
      o4.v++
    })
    expect(o4.v).to.equal(0)
    t4.trigger('test1')
    expect(o4.v).to.equal(1)
    t4.trigger('test2')
    expect(o4.v).to.equal(1)
  })

  it('stopListening', () => {
    // stopListening()
    const t1 = new BlEvent()
    const e1 = new BlEvent()
    const o1 = { v: 0 }
    const h1a = () => {
      o1.v++
    }
    const h1b = () => {
      o1.v++
    }
    e1.listenTo(t1, 'test', h1a)
    e1.listenTo(t1, 'test', h1b)
    expect(o1.v).to.equal(0)
    t1.trigger('test')
    expect(o1.v).to.equal(2)
    e1.stopListening()
    t1.trigger('test')
    expect(o1.v).to.equal(2)

    // stopListening(callback)
    const t2 = new BlEvent()
    const e2 = new BlEvent()
    const o2 = { v: 0 }
    const h2a = function () {
      o2.v++
    }
    const h2b = function () {
      o2.v++
    }
    e2.listenTo(t2, 'test', h2a)
    e2.listenTo(t2, 'test', h2b)
    expect(o2.v).to.equal(0)
    t2.trigger('test')
    expect(o2.v).to.equal(2)
    e2.stopListening(h2a)
    t2.trigger('test')
    expect(o2.v).to.equal(3)

    // stopListening(type)
    const t3 = new BlEvent()
    const e3 = new BlEvent()
    const o3 = { v: 0 }
    const h3 = function () {
      o3.v++
    }
    e3.listenTo(t3, ['test1', 'test2'], h3)
    expect(o3.v).to.equal(0)
    t3.trigger(['test1', 'test2'])
    expect(o3.v).to.equal(2)
    e3.stopListening('test1')
    t3.trigger(['test1', 'test2'])
    expect(o3.v).to.equal(3)

    // stopListening(types)
    const t4 = new BlEvent()
    const e4 = new BlEvent()
    const o4 = { v: 0 }
    const h4 = function () {
      o4.v++
    }
    e4.listenTo(t4, ['test1', 'test2', 'test3'], h4)
    expect(o4.v).to.equal(0)
    t4.trigger(['test1', 'test2', 'test3'])
    expect(o4.v).to.equal(3)
    e4.stopListening(['test1', 'test2'])
    t4.trigger(['test1', 'test2', 'test3'])
    expect(o4.v).to.equal(4)

    // stopListening(keyValue)
    const t5 = new BlEvent()
    const e5 = new BlEvent()
    const o5 = { v: 0 }
    const h5 = function () {
      o5.v++
    }
    e5.listenTo(t5, ['test1', 'test2', 'test3'], h5)
    expect(o5.v).to.equal(0)
    t5.trigger(['test1', 'test2', 'test3'])
    expect(o5.v).to.equal(3)
    e5.stopListening({ test1: h5, test2: h5 })
    t5.trigger(['test1', 'test2', 'test3'])
    expect(o5.v).to.equal(4)

    // stopListening(type, callback)
    const t6 = new BlEvent()
    const e6 = new BlEvent()
    const o6 = { v: 0 }
    const h6a = () => {
      o6.v++
    }
    const h6b = () => {
      o6.v++
    }
    e6.listenTo(t6, 'test', h6a)
    e6.listenTo(t6, 'test', h6b)
    expect(o6.v).to.equal(0)
    t6.trigger('test')
    expect(o6.v).to.equal(2)
    e6.stopListening('test', h6a)
    t6.trigger('test')
    expect(o6.v).to.equal(3)

    // stopListening(types, callback)
    const t7 = new BlEvent()
    const e7 = new BlEvent()
    const o7 = { v: 0 }
    const h7a = () => {
      o7.v++
    }
    const h7b = () => {
      o7.v++
    }
    e7.listenTo(t7, ['test1', 'test2'], h7a)
    e7.listenTo(t7, ['test1', 'test2'], h7b)
    expect(o7.v).to.equal(0)
    t7.trigger(['test1', 'test2'])
    expect(o7.v).to.equal(4)
    e7.stopListening(['test1', 'test2'], h7a)
    t7.trigger(['test1', 'test2'])
    expect(o7.v).to.equal(6)

    // stopListening(blEvent)
    const t8 = new BlEvent()
    const e8 = new BlEvent()
    const o8 = { v: 0 }
    const h8a = () => {
      o8.v++
    }
    const h8b = () => {
      o8.v++
    }
    e8.listenTo(t8, 'test', h8a, o8)
    e8.listenTo(t8, 'test', h8a)
    e8.listenTo(t8, 'test', h8b, o8)
    e8.listenTo(t8, 'test', h8b)
    expect(o8.v).to.equal(0)
    t8.trigger('test')
    expect(o8.v).to.equal(4)
    e8.stopListening(t8)
    t8.trigger('test')
    expect(o8.v).to.equal(4)

    // stopListening(blEvent, callback)
    const t9 = new BlEvent()
    const e9 = new BlEvent()
    const o9 = { v: 0 }
    const h9a = () => {
      o9.v++
    }
    const h9b = () => {
      o9.v++
    }
    e9.listenTo(t9, 'test', h9a)
    e9.listenTo(t9, 'test', h9b)
    expect(o9.v).to.equal(0)
    t9.trigger('test')
    expect(o9.v).to.equal(2)
    e9.stopListening(t9, h9a)
    t9.trigger('test')
    expect(o9.v).to.equal(3)

    // stopListening(blEvent, type)
    const t10 = new BlEvent()
    const e10 = new BlEvent()
    const o10 = { v: 0 }
    const h10 = () => {
      o10.v++
    }
    e10.listenTo(t10, 'test', h10)
    expect(o10.v).to.equal(0)
    t10.trigger('test')
    expect(o10.v).to.equal(1)
    e10.stopListening(t10, 'test')
    t10.trigger('test')
    expect(o10.v).to.equal(1)

    // stopListening(blEvent, types)
    const t11 = new BlEvent()
    const e11 = new BlEvent()
    const o11 = { v: 0 }
    const h11 = function () {
      o11.v++
    }
    e11.listenTo(t11, ['test1', 'test2', 'test3'], h11)
    expect(o11.v).to.equal(0)
    t11.trigger(['test1', 'test2', 'test3'])
    expect(o11.v).to.equal(3)
    e11.stopListening(t11, ['test1', 'test2'])
    t11.trigger(['test1', 'test2', 'test3'])
    expect(o11.v).to.equal(4)

    // stopListening(blEvent, keyValue)
    const t12 = new BlEvent()
    const e12 = new BlEvent()
    const o12 = { v: 0 }
    const h12 = function () {
      o12.v++
    }
    e12.listenTo(t12, ['test1', 'test2', 'test3'], h12)
    expect(o12.v).to.equal(0)
    t12.trigger(['test1', 'test2', 'test3'])
    expect(o12.v).to.equal(3)
    e12.stopListening(t12, { test1: h12, test2: h12 })
    t12.trigger(['test1', 'test2', 'test3'])
    expect(o12.v).to.equal(4)

    // stopListening(blEvent, type, callback)
    const t13 = new BlEvent()
    const e13 = new BlEvent()
    const o13 = { v: 0 }
    const h13a = () => {
      o13.v++
    }
    const h13b = () => {
      o13.v++
    }
    e13.listenTo(t13, 'test', h13a)
    e13.listenTo(t13, 'test', h13b)
    expect(o13.v).to.equal(0)
    t13.trigger('test')
    expect(o13.v).to.equal(2)
    e13.stopListening(t13, 'test', h13a)
    t13.trigger('test')
    expect(o13.v).to.equal(3)

    // stopListening(blEvent, types, callback)
    const t14 = new BlEvent()
    const e14 = new BlEvent()
    const o14 = { v: 0 }
    const h14a = () => {
      o14.v++
    }
    const h14b = () => {
      o14.v++
    }
    e14.listenTo(t14, ['test1', 'test2'], h14a)
    e14.listenTo(t14, ['test1', 'test2'], h14b)
    expect(o14.v).to.equal(0)
    t14.trigger(['test1', 'test2'])
    expect(o14.v).to.equal(4)
    e14.stopListening(t14, ['test1', 'test2'], h14a)
    t14.trigger(['test1', 'test2'])
    expect(o14.v).to.equal(6)

    // stopListening(blEvent/*未监听的*/)
    const t16 = new BlEvent()
    const e16 = new BlEvent()
    e16.stopListening(t16) // do nothing
    const o16 = { v: 0 }
    const h16 = () => {
      o16.v++
    }
    e16.listenTo(t16, 'test', h16)
    expect(o16.v).to.equal(0)
    t16.trigger('test')
    expect(o16.v).to.equal(1)
    e16.stopListening(new BlEvent())
    t16.trigger('test')
    expect(o16.v).to.equal(2)
  })

  it('off', () => {
    // off()
    const e1 = new BlEvent()
    const o1 = { v: 0 }
    const h1a = () => {
      o1.v++
    }
    const h1b = () => {
      o1.v++
    }
    e1.on('test', h1a)
    e1.on('test', h1a)
    e1.on('test', h1b)
    e1.on('test', h1b)
    expect(o1.v).to.equal(0)
    e1.trigger('test')
    expect(o1.v).to.equal(4)
    e1.off()
    e1.trigger('test')
    expect(o1.v).to.equal(4)

    // off(type)
    const e2 = new BlEvent()
    const o2 = { v: 0 }
    const h2 = () => {
      o2.v++
    }
    e2.on('test', h2)
    expect(o2.v).to.equal(0)
    e2.trigger('test')
    expect(o2.v).to.equal(1)
    e2.off('test')
    e2.trigger('test')
    expect(o2.v).to.equal(1)

    // off(callback)
    const e3 = new BlEvent()
    const o3 = { v: 0 }
    const h3a = function () {
      o3.v++
    }
    const h3b = function () {
      o3.v++
    }
    e3.on('test', h3a)
    e3.on('test', h3b)
    expect(o3.v).to.equal(0)
    e3.trigger('test')
    expect(o3.v).to.equal(2)
    e3.off(h3a)
    e3.trigger('test')
    expect(o3.v).to.equal(3)

    // off(type, callback)
    const e4 = new BlEvent()
    const o4 = { v: 0 }
    const h4a = () => {
      o4.v++
    }
    const h4b = () => {
      o4.v++
    }
    e4.on('test', h4a)
    e4.on('test', h4b)
    expect(o4.v).to.equal(0)
    e4.trigger('test')
    expect(o4.v).to.equal(2)
    e4.off('test', h4a)
    e4.trigger('test')
    expect(o4.v).to.equal(3)
  })

  it('off & listenTo', () => {
    const t1 = new BlEvent()
    const e1 = new BlEvent()
    const o1 = { v: 0 }
    const h1a = () => {
      o1.v++
    }
    const h1b = () => {
      o1.v++
    }
    t1.listenTo(e1, 'test', h1a)
    e1.on('test', h1a)
    t1.listenTo(e1, 'test', h1b)
    e1.on('test', h1b)
    expect(o1.v).to.equal(0)
    e1.trigger('test')
    expect(o1.v).to.equal(4)
    t1.off()
    e1.trigger('test')
    expect(o1.v).to.equal(8)
    e1.off()
    e1.trigger('test')
    expect(o1.v).to.equal(8)
  })

  it('trigger', () => {
    const e1 = new BlEvent()
    const o1 = { v: 0 }
    e1.on('test', function () {
      expect(arguments.length).to.equal(0)
      o1.v++
    })
    e1.trigger('test')
    expect(o1.v).to.equal(1)

    const e2 = new BlEvent()
    const o2 = { v: 0 }
    e2.on('test', function () {
      expect(arguments[0]).to.equal(1)
      o2.v += arguments.length
    })
    e2.trigger('test', 1)
    expect(o2.v).to.equal(1)

    const e3 = new BlEvent()
    const o3 = { v: 0 }
    e3.on('test', function () {
      expect(arguments[0]).to.equal(1)
      expect(arguments[1]).to.equal(1)
      o3.v += arguments.length
    })
    e3.trigger('test', 1, 1)
    expect(o3.v).to.equal(2)

    const e4 = new BlEvent()
    const o4 = { v: 0 }
    e4.on('test', function () {
      expect(arguments[0]).to.equal(1)
      expect(arguments[1]).to.equal(1)
      expect(arguments[2]).to.equal(1)
      o4.v += arguments.length
    })
    e4.trigger('test', 1, 1, 1)
    expect(o4.v).to.equal(3)

    const e5 = new BlEvent()
    const o5 = { v: 0 }
    e5.on('test', function (v) {
      expect(arguments[0]).to.equal(1)
      expect(arguments[1]).to.equal(1)
      expect(arguments[2]).to.equal(1)
      expect(arguments[3]).to.equal(1)
      o5.v += arguments.length
    })
    e5.trigger('test', 1, 1, 1, 1)
    expect(o5.v).to.equal(4)

    const e6 = new BlEvent()
    // do nothing, 不抛错
    e6.trigger('any')
  })
})
