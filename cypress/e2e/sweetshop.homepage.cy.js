// Pagrindinio puslapio (homepage) testai
// Tikrina ar pagrindinis puslapis veikia teisingai ir rodo visą reikiamą informaciją
describe('Sweetshop – Homepage', () => {
  beforeEach(() => {
    // Prieš kiekvieną testą atidaryti pagrindinį puslapį
    cy.visit('/');
  });

  it('Puslapio pavadinimas (title) yra teisingas', () => {
    // Patikrinti ar puslapio pavadinimas (title) atitinka laukiamą tekstą
    cy.title().should('match', /Sweet Shop/i);
  });

  it('Browse sweets nuoroda nukreipia į /sweets su teisinga antrašte', () => {
    // Paspausti ant "Browse Sweets" nuorodos ir patikrinti ar nueina į teisingą puslapį
    cy.contains('a', /Browse Sweets/i).click();

    // Patikrinti ar puslapyje matomas teisingas antraštė
    cy.get('h1, h2').contains(/Browse sweets/i).should('be.visible');

    // Patikrinti ar URL pasikeitė į /sweets
    cy.url().should('include', '/sweets');
  });

  it('Populiariausi saldainiai rodo 4 korteles su paveikslėliais ir Add to Basket mygtuku', () => {
    // Patikrinti ar parodoma 4 populiariausi saldainiai pagrindiniame puslapyje
    cy.get('div.card').should('have.length', 4).each(($card) => {
      // Kiekviena kortelė turi turėti "Add to Basket" mygtuką
      cy.wrap($card).find('a.addItem').should('be.visible');

      // Kiekviena kortelė turi turėti užkrautą paveikslėlį
      cy.wrap($card).find('img').should('be.visible').and(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
    });
  });

  // Navigacijos matrica - apibrėžia visus puslapius ir laukiamus rezultatus
  const navMatrix = [
    { linkText: 'Sweets', expectedHeading: /Browse sweets/i, path: '/sweets' },
    { linkText: 'About', expectedHeading: /Sweet Shop Project/i, path: '/about' },
    { linkText: 'Login', expectedHeading: /Login/i, path: '/login' },
    { linkText: 'Basket', expectedHeading: /Your Basket/i, path: '/basket' },
  ];

  // Kiekvienam navigacijos elementui sukurti atskirą testą
  navMatrix.forEach(({ linkText, expectedHeading, path }) => {
    it(`${linkText} navigacijos nuoroda atidaro teisingą puslapį`, () => {
      // Krepšelio nuoroda gali turėti badge su skaičiumi, todėl naudojame specialų selektorių
      if (linkText === 'Basket') {
        cy.get('a.nav-link[href="/basket"]').click();
      } else {
        cy.get('a.nav-link').contains(new RegExp(`^${linkText}$`, 'i')).click();
      }

      // Patikrinti ar URL pasikeitė į teisingą kelią
      cy.url().should('include', path);

      // Patikrinti ar matoma laukiama antraštė
      cy.get('h1, h2').contains(expectedHeading).should('be.visible');
    });
  });

  // Papildomi pagrindinio puslapio turinio testai
  it('Pagrindinio puslapio turinys - pasisveikinimo pranešimas ir aprašymas', () => {
    // Patikrinti ar visi svarbūs pagrindinio puslapio elementai yra matomi

    // Pagrindinis pasisveikinimo pranešimas
    cy.contains('Welcome to the sweet shop!').should('be.visible');

    // Aprašymas
    cy.contains('The sweetest online shop out there.').should('be.visible');

    // Nuoroda į katalogą
    cy.contains('Browse Sweets').should('be.visible');

    // Navigacijos juosta
    cy.get('.navbar').should('be.visible');

    // Populiariausių saldainių sekcijos pavadinimas
    cy.contains('Our most popular choice of retro sweets.').should('be.visible');
  });
});
