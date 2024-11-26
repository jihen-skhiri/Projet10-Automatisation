import { faker } from '@faker-js/faker'
const apiUrl = Cypress.env("apiUrl")
const username = Cypress.env("username")
const password = Cypress.env("password")

describe('Cart tests', () => {
    let initialStock;
    beforeEach(() => {
        cy.visit('#/login'); 
        cy.getBySel('login-input-username').type(username);
        cy.getBySel('login-input-password').type(password);
        cy.getBySel('login-submit').click();
        cy.url().should('not.include', '/login'); 
    });
    it('should add a product with valid stock in the cart and update stock', () => {
        cy.getBySel('nav-link-products').click()
        cy.getBySel('product-link').eq(2).click()
        // Étape 1 : Vérifiez que le texte du stock est valide
        cy.getBySel('detail-product-stock').invoke('text').should('match',/(-?\d+)\s*en\s*stock/i)
        .then((stockText) => {
            cy.log('Stock Text:', stockText);
            const stockMatch = stockText.trim()
            initialStock = parseInt(stockMatch.match(/-?\d+/));
        // Vérifier que le stock est supérieur à 1
        expect(initialStock).to.be.greaterThan(1);

        cy.getBySel('detail-product-add').click(); 
        cy.visit('#/products/5'); 
        cy.reload();      
        const newStock = initialStock - 1;
        cy.getBySel('detail-product-stock').invoke('text').should('match', new RegExp(`^${newStock} en stock$`));
        
        })
    })
    
        it('Verify that the product has been added to the cart', () => {
            cy.visit('#/products/5'); 
            cy.getBySel('detail-product-add').should('be.visible').and('not.be.disabled').click();
            cy.getBySel('nav-link-cart').click();
            cy.getBySel('cart-line').should('be.visible')
          
        })
        it('shouldn\'t change the cart with negative number', () => {
            cy.getBySel('product-home-link').first().click();
            cy.getBySel('detail-product-quantity').clear().type(-1);
            cy.getBySel('detail-product-add').click();
            cy.getBySel('detail-product-form').should('have.class', 'ng-invalid');
          });
          it('shouldn\'t change the cart with 20+ number', () => {
            cy.getBySel('product-home-link').first().click()
            cy.getBySel('detail-product-quantity').clear().type(21)
            cy.getBySel('detail-product-add').click()
            cy.getBySel('detail-product-form').should('have.class', 'ng-invalid')
          })
          it('should adds a product to the cart and shows up in the API', () => {
            let id;
            before(() => {
                cy.request({
                    method: "POST",
                    url: apiUrl +  "/login",
                    body: {
                     "username" : username,
                     "password" : password,
                    }
                }).then((response) => {
                    Cypress.env('authToken', response.body.token); // Stocke le token dans les variables d’environnement de Cypress
                });
            });
            cy.getBySel('product-home-link').first().click()
            
            cy.url().then(url => {
              const segments = url.split('/') 
              id = parseInt(segments[segments.length - 1]);
              cy.log(id)
          
              cy.wait(2000);
      
              cy.contains('[data-cy="detail-product-add"]', 'Ajouter au panier').click();
          
          
                cy.request({
                  method: 'GET',
                  url: apiUrl + '/orders',
                  headers: {
                    headers: {
                        "Authorization" : `Bearer ${Cypress.env('authToken')}`
                    }
                  },
                }).then((response) => {
                  cy.log(response.body.orderLines[0].product.id);
                  const idInApi = response.body.orderLines[0].product.id
                  expect(idInApi).to.equal(id);
                });
             
            })
            cy.visit('/cart')
            cy.getBySel('cart-line-delete').click({ multiple : true })
          });

})