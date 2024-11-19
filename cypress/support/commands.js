const apiUrl = Cypress.env("apiUrl")
Cypress.Commands.add("getBySel", (selector, ...args) => {
    return cy.get(`[data-cy=${selector}]`, ...args)
  })