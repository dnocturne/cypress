// Smoke testai - greiti testai patikrinantys pagrindinę sistemos funkcionalumą
// Šie testai užtikrina, kad svarbiausios sistemos funkcijos veikia
describe('Sweetshop – Smoke testai', () => {
  beforeEach(() => {
    // Išvalyti slapukus (cookies) ir localStorage prieš kiekvieną testą
    // Tai užtikrina švarius testavimo sąlygas
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Atidaro pradinį puslapį ir patikrina antraštę bei navigaciją', () => {
    // Atidaryti pagrindinį puslapį
    cy.visit('/');

    // Patikrinti ar pagrindinis pavadinimas matomas ir turi teisingą tekstą
    cy.get('header h1.display-3')
      .should('be.visible')
      .invoke('text')
      .then((t) => {
        const txt = t.trim().toLowerCase();
        expect(txt).to.match(/welcome|browse sweets|sweet shop project/);
      });

    // Patikrinti ar visos navigacijos nuorodos matomos ir turi teisingą tekstą
    cy.get('a.nav-link[href="/sweets"]').should('be.visible').and('contain', 'Sweets');
    cy.get('a.nav-link[href="/about"]').should('be.visible').and('contain', 'About');
    cy.get('a.nav-link[href="/login"]').should('be.visible').and('contain', 'Login');
    cy.get('a.nav-link[href="/basket"]').should('be.visible').and('contain', 'Basket');

    // Eiti į About puslapį ir patikrinti ar URL pasikeitė
    cy.nav('/about');
    cy.url().should('include', '/about');
    cy.contains(/Sweet Shop Project/i).should('be.visible');

    // Grįžti atgal į saldainių katalogą
    cy.nav('/sweets');
    cy.url().should('include', '/sweets');
  });

  it('Patikrina ar visi paveikslėliai užkrauti teisingai (naturalWidth > 0)', () => {
    // Patikrinti ar visi paveikslėliai puslapyje yra sėkmingai užkrauti
    cy.visit('/');

    // Turi būti bent vienas paveikslėlis puslapyje
    cy.get('img').its('length').should('be.gte', 1);

    // Kiekvienam paveikslėliui patikrinti ar jis matomas ir užkrautas
    // naturalWidth > 0 reiškia kad paveikslėlis sėkmingai užkrautas
    cy.get('img').each(($img) => {
      cy.wrap($img)
        .should('be.visible')
        .and(($el) => expect($el[0].naturalWidth).to.be.greaterThan(0));
    });
  });

  // Išplėstiniai navigacijos testai
  describe('Išplėstiniai navigacijos testai', () => {
    it('Navigacija tarp visų puslapių skirtingomis kombinacijomis', () => {
      // Testuoti navigaciją tarp skirtingų puslapių įvairiomis kombinacijomis
      cy.visit('/');

      // Iš pagrindinio puslapio į Saldainių katalogą
      cy.contains('Sweets').click();
      cy.contains('Browse sweets').should('be.visible');

      // Iš Saldainių katalogo į Apie puslapį
      cy.contains('About').click();
      cy.contains('Sweet Shop Project').should('be.visible');

      // Iš Apie puslapio į Prisijungimo formą
      cy.contains('Login').click();
      cy.contains('Login').should('be.visible');
      cy.contains('Please enter your email address and password').should('be.visible');

      // Iš Prisijungimo į Krepšelį
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');
    });

    it('Navigacija iš Krepšelio į kitus puslapius', () => {
      // Testuoti navigaciją iš Krepšelio puslapio į kitus puslapius
      cy.visit('/');
      cy.contains('Basket').click();

      // Grįžti į pagrindinį puslapį
      cy.contains('Sweet Shop').click();
      cy.contains('Welcome to the sweet shop!').should('be.visible');

      // Iš pagrindinio puslapio atgal į Krepšelį, tada į Saldainių katalogą
      cy.contains('Basket').click();
      cy.contains('Sweets').click();
      cy.contains('Browse sweets').should('be.visible');
    });
  });
});
