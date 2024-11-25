const username = Cypress.env("username")
const password = Cypress.env("password")

describe('Connexion et vérification du bouton Panier', () => {
    beforeEach(() => {
      cy.visit('/'); 
    });
  
    it('should connect the user and button cart be visible', () => {
      cy.getBySel('nav-link-login').should('be.visible') .click(); 
      cy.url().should('include', '/login'); 
      cy.getBySel('login-form').should('be.visible'); 
      cy.getBySel('login-input-username').should('be.visible').type(username);
      cy.getBySel('login-input-password').should('be.visible').type(password); 
      cy.getBySel('login-submit').should('be.visible').click();
      cy.url().should('not.include', '/login'); 
      cy.getBySel('nav-link-cart').should('be.visible').should('contain.text', 'Mon panier');;
      cy.getBySel('nav-link-logout').should('be.visible').should('contain.text', 'Déconnexion');;
    });
  });
  