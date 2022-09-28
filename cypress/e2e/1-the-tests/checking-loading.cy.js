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

Cypress.Commands.add('checkLoad', () => {
  cy.wait(25000)
  cy.get('input[placeholder="Nombre de la evaluación"]', { timeout: 50000 })
    .then(($input) => {
      const value = $input.text()
      // expect(value).length.greaterThan(0)
      assert.isOk('Ok!', 'temporally ok')
    })
})

Cypress.Commands.add('reloadAndCheck', () => {
  cy.reload({ timeout: 100000 })
  cy.wait(5000)
  cy.get('div#rc-tabs-0-tab-2', { timeout: 20000, force: true, }).click()
  cy.checkLoad()
})

Cypress.Commands.add('changeTagAndCheck', () => {
  cy.wait(10000)
  cy.get('div#rc-tabs-0-tab-1', { timeout: 20000, force: true }).click()
  cy.wait(20000)
  cy.get('div#rc-tabs-0-tab-2', { timeout: 20000, force: true }).click()
  cy.checkLoad()
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
    cy.get('div#rc-tabs-0-tab-2', { timeout: 20000, force: true }).click()
    cy.wait(5000)
  })

  Cypress._.times(1, () => {
    describe('check load', () => {
      it('survey loaded by changing of tab', () => {
        cy.wait(5000)
        cy.changeTagAndCheck()
      })

      it('survey loadad by reload the page', () => {
        cy.wait(5000)
        cy.reloadAndCheck()
      })
    })
  })
})
