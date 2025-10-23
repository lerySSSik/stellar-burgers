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
    cy.wait('@getUser'); // ← КЛЮЧЕВАЯ СТРОКА!
    cy.get('[data-testid="ingredient"]', { timeout: 10000 }).should('have.length.greaterThan', 0);
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

  it('should add bun to constructor on click', () => {
    // Кликаем по КНОПКЕ внутри карточки, а не по всей карточке
    cy.get(SELECTORS.ingredient).first().find('button').click();
    cy.get(SELECTORS.constructor).contains(TEST_DATA.bunName);
  });

  // ✅ Модалка открывается только для НАЧИНКИ (не для булки!)
  it('should open ingredient modal on click', () => {
    cy.get(SELECTORS.ingredient).eq(1).click(); // ← eq(1) = начинка
    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.modal).should('contain', 'Биокотлета из марсианской Магнолии');
  });

  it('should close ingredient modal on close button click', () => {
    cy.get(SELECTORS.ingredient).eq(1).click();
    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.modalClose).click();
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('should close ingredient modal on overlay click', () => {
    cy.get(SELECTORS.ingredient).eq(1).click();
    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.modalOverlay).click({ force: true });
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('should create order successfully', () => {
    // Кликаем по КНОПКЕ
    cy.get(SELECTORS.ingredient).first().find('button').click();
    cy.get(SELECTORS.constructor).contains(TEST_DATA.bunName);

    cy.get(SELECTORS.orderButton).click();
    cy.wait('@createOrder');

    cy.get(SELECTORS.orderModal).should('be.visible');
    cy.get(SELECTORS.orderModal).contains(TEST_DATA.orderNumber);

    cy.get(SELECTORS.modalClose).click();
    cy.get(SELECTORS.constructor).should('not.contain', TEST_DATA.bunName);
  });
});