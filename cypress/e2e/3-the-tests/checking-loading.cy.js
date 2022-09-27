/// <reference types="cypress" />

Cypress.on('uncaught:exception', () => {
  debugger
  console.log(arguments)
  return false
})

Cypress.Server.defaults({
  ignore: (xhr) => {
      return true;
  }
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


  it('adminpage', () => {
    cy.wait(5000)
    cy.visit(Cypress.env('TARGET_ADMIN_LOCATION'))
    cy.location().should((location) => {
      expect(location.href).to.equal(Cypress.env('TARGET_ADMIN_LOCATION'))
    })
    cy.get('.ant-empty-image').should('not.exist')
  })

  it('open activity', () => {
    cy.wait(10000)
    cy.get('#editActionundefined')
      .first()
      .click()
    cy.location().should((location) => {
      expect(location.href).to.equal(Cypress.env('TARGET_ADMIN_LOCATION') + '/actividad')
    })
    cy.wait(5000)
    // cy.document().should('have.text', 'Temas')
  })

  it('change tag', () => {
    cy.wait(5000)
    cy.get('div#rc-tabs-0-tab-2', { timeout: 20000 }).click()
    cy.wait(5000)
  })

  it('survey loaded', () => {
    cy.get('input[placeholder="Nombre de la evaluación"]')
      .then(($input) => {
        const value = $input.text()
        expect(value).length.greaterThan(0)
      })
  })
})
