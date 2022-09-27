/// <reference types="cypress" />

Cypress.on('uncaught:exception', () => {
  debugger
  console.log(arguments)
  return false
})

context('Checking Loading', () => {
  before(() => {
    cy.clearCookies()
    cy.visit(Cypress.env('TARGET_LOCATION'))
  })

  it('website is right', () => {
    cy.location().should((location) => {
      expect(location.href).to.equal(Cypress.env('TARGET_LOCATION'))
    })
  })

  it('login', () => {
    cy.wait(5000)
    cy.get('body').then(($body) => {
      if ($body.find('span.ant-avatar.ant-avatar-circle.ant-avatar-image').length) {
        assert.isOk('OK?', 'login button not found')
      } else {
        cy.get('button.ant-btn.ant-btn-default').first().click()
        cy.get('#email').type(Cypress.env('EMAIL'))
        cy.get('#password').type(Cypress.env('PASSWORD'))
        cy.get('button[type=submit]').click()
      }
    })
  })
})
