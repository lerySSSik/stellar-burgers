/// <reference types="cypress" />

describe('Constructor Page', () => {
  const SELECTORS = {
    ingredient: '[data-testid="ingredient"]',
    constructor: '[data-testid="constructor"]',
    modal: '[data-testid="modal"]',
    modalClose: '[data-testid="modal-close"]',
    modalOverlay: '[data-testid="modal-overlay"]',
    orderButton: '[data-testid="order-button"]',
    orderModal: '[data-testid="order-modal"]'
  };

  const TEST_DATA = {
    bunName: 'Краторная булка N-200i',
    orderNumber: '12345'
  };

  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
    
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
    });
    cy.setCookie('accessToken', 'fake-access-token');
    
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
    cy.clearCookies();
  });

  it('should display the main title', () => {
    cy.contains('Соберите бургер').should('be.visible');
  });

  it('should display ingredients sections', () => {
    cy.contains('Булки').should('be.visible');
    cy.contains('Соусы').should('be.visible');
    cy.contains('Начинки').should('be.visible');
  });

  it('should display constructor area', () => {
    cy.get(SELECTORS.constructor).should('be.visible');
  });

  it('should add ingredient to constructor', () => {
    cy.get(SELECTORS.ingredient).first().trigger('dragstart');
    cy.get(SELECTORS.constructor).trigger('drop');
    
    cy.get(SELECTORS.constructor).should('contain', TEST_DATA.bunName);
  });

  it('should open ingredient modal on click', () => {
    cy.get(SELECTORS.ingredient).first().click();
    
    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.modal).should('contain', TEST_DATA.bunName);
  });

  it('should close ingredient modal on close button click', () => {
    cy.get(SELECTORS.ingredient).first().click();
    cy.get(SELECTORS.modal).should('be.visible');
    
    cy.get(SELECTORS.modalClose).click();
    
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('should close ingredient modal on overlay click', () => {
    cy.get(SELECTORS.ingredient).first().click();
    cy.get(SELECTORS.modal).should('be.visible');
    
    cy.get(SELECTORS.modalOverlay).click({ force: true });
    
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('should create order successfully', () => {
    cy.get(SELECTORS.ingredient).first().trigger('dragstart');
    cy.get(SELECTORS.constructor).trigger('drop');
    
    cy.get(SELECTORS.constructor).should('contain', TEST_DATA.bunName);
    
    cy.get(SELECTORS.orderButton).click();
    
    cy.wait('@createOrder');
    
    cy.get(SELECTORS.orderModal).should('be.visible');
    cy.get(SELECTORS.orderModal).should('contain', TEST_DATA.orderNumber);
    
    cy.get(SELECTORS.modalClose).click();
    
    cy.get(SELECTORS.constructor).should('not.contain', TEST_DATA.bunName);
  });

  it('should show order button', () => {
    cy.contains('Оформить заказ').should('be.visible');
  });
});