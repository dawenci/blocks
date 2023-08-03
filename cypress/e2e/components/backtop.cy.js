/// <reference types="cypress" />

context('BlBackTop', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/tests/components/backtop.html')
  })

  it('scroll', () => {
    cy.get('[data-cy="scrollable"]').then($el => {
      const scrollable = $el.get(0)
      cy.get('[data-cy="backtop"]').then($el => {
        const backtop = $el.get(0)

        scrollable.scrollTo(0, backtop.threshold)

        cy.wait(50)
          .then(() => {
            expect(scrollable.scrollTop).to.equal(backtop.threshold)
          })
          .wrap(backtop)
          .click()
          .wait(backtop.duration * 1000 + 50)
          .then(() => {
            expect(scrollable.scrollTop).to.equal(0)
          })
      })
    })
  })

  it('threshold', () => {
    cy.get('[data-cy="scrollable2"]').then($el => {
      const scrollable = $el.get(0)
      cy.get('[data-cy="backtop2"]').then($el => {
        const backtop = $el.get(0)

        scrollable.scrollTo(0, backtop.threshold)

        cy.wait(50)
          .then(() => {
            expect(scrollable.scrollTop).to.equal(backtop.threshold)
            expect(getComputedStyle(backtop).display).to.not.equal('none')
          })
          .wait(50)
          .then(() => {
            scrollable.scrollTo(0, backtop.threshold - 1)
          })
          .wait(50)
          .then(() => {
            expect(getComputedStyle(backtop).display).to.equal('none')
          })
      })
    })
  })
})
