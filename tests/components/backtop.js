describe('backtop', () => {
  let caseIndex = 0
  const makeEl = () => {
    const index = ++caseIndex
    const $test = document.createElement('div')
    $test.innerHTML = /*html*/ `
    <div class="scrollable" style="width:100px;height:100px;overflow:auto;" id="test-backtop-target-${index}">
      <div style="height:1000px;"></div>
    </div>
    <bl-backtop class="backtop" duration=".1" target="#test-backtop-target-${index}"></bl-backtop>
    `
    return {
      $test,
      $scrollable: $test.querySelector('.scrollable'),
      $backtop: $test.querySelector('.backtop'),
    }
  }

  it('scroll', async () => {
    const { $test, $scrollable, $backtop } = makeEl()
    mount($test)

    $scrollable.scrollTo(0, $backtop.visibilityHeight)
    await delay(50)
    $backtop.dispatchEvent(new MouseEvent('click'))
    await delay($backtop.duration * 1000 + 50)
    chai.expect(0).to.equal($scrollable.scrollTop)
    unmount($test)
  })

  it('visibilityHeight', async () => {
    const { $test, $scrollable, $backtop } = makeEl()
    mount($test)
    $scrollable.scrollTo(0, $backtop.visibilityHeight)
    await delay(50)
    chai.expect('none').not.equal(getComputedStyle($backtop).display)
    await delay(50)
    $scrollable.scrollTo(0, $backtop.visibilityHeight - 1)
    await delay(50)
    chai.expect('none').to.equal(getComputedStyle($backtop).display)
    unmount($test)
  })
})
