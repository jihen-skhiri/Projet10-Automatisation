const apiUrl = Cypress.env("apiUrl")
const username = Cypress.env("username")
const password = Cypress.env("password")

describe('Login Page', () => {
    it('should navigate to login page and verify elements of login page', () => {
        cy.visit('#/login')
        cy.getBySel('login-input-username').should('exist').and('be.visible');
        cy.getBySel('login-input-password').should('exist').and('be.visible');
        cy.getBySel('login-submit').should('have.text', "Se connecter").and('be.visible');
    })
})