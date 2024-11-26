import { faker } from '@faker-js/faker'

const apiUrl = Cypress.env("apiUrl")
const username = Cypress.env("username")
const password = Cypress.env("password")
describe('Orders API', () => {
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
context("GET /orders", () => {
    it("should returns 403 if the user is not connected", () => {
        cy.request({
            method: "GET",
            url: apiUrl + "/orders", 
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(403)
        })
    
      })
    })
    it('should returns a list of products in the cart', () => {
        cy.request({
            method: "GET", 
            url: apiUrl + "/orders",
            headers: {
                "Authorization" : `Bearer ${Cypress.env('authToken')}`
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).exist
            
        })
    })
    context("should add a product in the cart successfully", () => {
        const randomQuantity = faker.number.int({ min : 1, max: 10 })
        let productId; 
        let cartId;
        it('should returns a random product', () => {
            cy.request({
                method: 'GET',
                url: "http://localhost:8081/products/",
                headers: {
                    "Authorization": `Bearer ${Cypress.env('authToken')}`
                }
            }).then((response) => {
                productId = response.body[Math.floor(Math.random() * response.body.length)].id;
                cy.log(productId)
            })
        })
        it('should adds the product in the cart', () => {
            cy.request({
                method: 'POST', 
                url: apiUrl + "/orders/add",
                failOnStatusCode: false,
                headers: {
                    "Authorization" : `Bearer ${Cypress.env('authToken')}`
                },
                body: {
                    "product" : productId,
                    "quantity" : randomQuantity,
                }
            }).then((response) => {
                expect(response.status).to.eq(200)

            })
            
            
        })
        it('should not add an Out-of-Stock product in the cart', () => {
            cy.request({
                method: "POST",
                failOnStatusCode: false,
                url: apiUrl + "/orders/add", 
                headers: {
                    "Authorization" : `Bearer ${Cypress.env('authToken')}`
                }, 
                body: {
                    "product" :  productId, 
                    "quantity" : 1, 
                }
            }).then((response) => {
                expect(response.status).to.eq(405)
              
            })
        })  
    })
    
})
describe('Products API', () => {
    let productId;

    before(() => {
        // Supprimer le token d'accès après chaque test
        Cypress.env('authToken', null);
        cy.request({
            method: "POST",
            url: apiUrl + "/login",
            body: {
                "username": username,
                "password": password,
            }
        }).then((response) => {
            Cypress.env('authToken', response.body.token)
            expect(response.status).to.eq(200)
        })
    })
    beforeEach(() => {
        // Récupérer les produits à chaque test
        cy.request({
            method: 'GET',
            url: "http://localhost:8081/products/",
            failOnStatusCode: false,
            headers: {
                "Authorization": `Bearer ${Cypress.env('authToken')}`
            }
        }).then((response) => {
            productId = response.body[Math.floor(Math.random() * response.body.length)].id;
           
        })
    })
    it('should return details of a product by ID', () => {
        expect(productId).to.be.a("number");
    
        cy.request("http://localhost:8081/products/" + `${productId}`)
            .then((response) => {
                expect(response.status).to.equal(200);
                
                cy.visit('/products/'+ productId)
            
                expect(response.body).to.have.property('name').and.be.a('string'); 
                expect(response.body).to.have.property('id', productId); 
                expect(response.body).to.have.property('availableStock').and.be.a('number');
                expect(response.body).to.have.property("skin").and.be.a('string');
                expect(response.body).to.have.property("aromas").and.be.a('string');
                expect(response.body).to.have.property('ingredients').and.be.a('string');
                expect(response.body).to.have.property('description').and.be.a('string'); 
                expect(response.body).to.have.property('price').and.be.a('number'); 
                expect(response.body).to.have.property('picture').and.be.a('string'); 
                expect(response.body).to.have.property('varieties').and.be.a('number');
            });
    });        
       
})


describe('Login API', () => {
    const wrongUsername = faker.internet.email()
    const wrongPassword = faker.internet.password()
    it('should returns 401 in case of error', () => {
        cy.request({
            method: 'POST', 
            url: apiUrl + '/login',
            failOnStatusCode: false, 
            body: {
                username: wrongUsername,
                password: wrongPassword,
            }, 
        }).then((response) => {
            expect(response.status).to.eq(401)
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.eq('Invalid credentials.'); 
        })
    })

    it('should returns 200 if the user is registered', () => {
        cy.request({
            method: 'POST',
            url: apiUrl + '/login',
            body: {
                username: username, 
                password: password,
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('token').and.be.a('string');
        })
    })

})

describe('Reviews API', () => {
    const Comment = faker.lorem.lines(2)
    const Rate = faker.number.int({ min: 1, max: 5})
    const Title = faker.lorem.words(3)

    before(() => {
        // Supprimer le token d'accès après chaque test
        Cypress.env('authToken', null);
        cy.request({
            method: "POST",
            url: apiUrl + "/login",
            body: {
                "username": username,
                "password": password,
            }
        }).then((response) => {
            Cypress.env('authToken', response.body.token)
            expect(response.status).to.eq(200)
        })
    })
    it('should adds a review', () => {
        cy.request({
            method: 'POST',
            url: apiUrl + "/reviews", 
            failOnStatusCode: false,
            headers: {
                "Authorization" :  `Bearer ${Cypress.env('authToken')}`
            },
            body: {
                "title": Title,
                "comment": Comment,
                "rating": Rate,
            }
        }).then((response) => {
            expect(response.status).to.be.eq(200)
        })
    })
    it('should not adds a review with script', () => {
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
        cy.request({
            method: 'POST',
            url: apiUrl + "/reviews", 
            failOnStatusCode: true, 
            headers: {
                "Authorization" : `Bearer ${Cypress.env('authToken')}` 
            },
            body: {
                "title": Title,
                "comment": "<script> alert('Test') </script> ",
                "rating": Rate,
            }
        }).then((response) => {
            expect(response.status).to.be.oneOf([400, 422]);
        })
    })

   
})

   

