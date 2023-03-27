/// <reference types="cypress" />

context('BlocksBadge', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/tests/components/badge.html')
  })

  it('value', () => {
    cy.get('[data-cy="badge"]').then($el => {
      const badge = $el.get(0)

      expect(badge.textContent).to.equal('innerText')

      expect(badge.value).to.equal('0')
      expect(badge.$badge.innerText).to.equal('0')

      badge.value = '1'
      expect(badge.value).to.equal('1')
      expect(badge.$badge.innerText).to.equal('1')
    })
  })
})
