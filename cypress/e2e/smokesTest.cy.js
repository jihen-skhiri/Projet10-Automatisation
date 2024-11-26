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

describe('Cart for connected user', () => {
    before(() => {
        // Simuler la connexion via une requête API
        cy.request({
            method:"POST", 
            url: apiUrl + "/login", 
            failOnStatusCode: false,
            body: {
                "username" : username,
                "password" : password,
               }
           
        }).then((response) => {
                Cypress.env('authToken', response.body.token); 
            });
        cy.visit('/'); 
    });

    it('should find an add to cart button on product page', () => {
        // Vérifier que les boutons d’ajout au panier sont visibles
        cy.contains("Voir les produits").click()
        cy.getBySel('product-link').first().click()
        cy.getBySel('detail-product-add').click()

        
    });
});

describe('Availability field', () => {
    it('should exist on product page', () => {
        cy.visit('/')
        cy.getBySel('nav-link-products').click()
        cy.getBySel('product-link').first().click()
        cy.getBySel('detail-product-stock').should('exist').and('be.visible')
    })
})