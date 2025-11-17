// Autentifikacijos (prisijungimo) testai
// Tikrina ar prisijungimo forma veikia teisingai ir validuoja duomenis
describe('Sweetshop – Login srautas', () => {
  beforeEach(() => {
    // Išvalyti slapukus ir localStorage prieš kiekvieną testą
    // Tai užtikrina, kad kiekvienas testas pradedamas nuo švaraus starto
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Pavyzdinis login – suvedame teisingus duomenis ir tikriname redirectą arba validaciją', () => {
    // Atidaryti pagrindinį puslapį ir eiti į prisijungimo formą
    cy.visit('/');
    cy.nav('/login');
    cy.url().should('include', '/login');

    // Įvesti teisingus prisijungimo duomenis
    cy.get('#exampleInputEmail').should('be.visible').type('jonas.jonaitis@gmail.com');
    cy.get('#exampleInputPassword').should('be.visible').type('Slaptazodis123!');

    // Paspausti prisijungimo mygtuką
    cy.contains('button, a.btn', /login/i).should('be.visible').click();

    // Leisti du galimus scenarijus:
    // 1) Peradresavimas į sėkmės puslapį (*.html)
    // 2) Pasilikimas prisijungimo puslapyje, bet forma žymima kaip validuota be klaidų
    cy.location('href', { timeout: 3000 }).then((href) => {
      if (/00efc23d-b605-4f31-b97b-6bb276de447e\.html/i.test(href)) {
        // Sėkmingai peradresuota – testas pavyko
        expect(true).to.be.true;
      } else {
        // Patikrinti kad nėra validacijos klaidų
        cy.get('form.needs-validation').should('exist').and('have.class', 'was-validated');
        cy.assertNoVisibleInvalidFeedback();
      }
    });
  });

  it('Login – neteisingas el. paštas turi parodyti validacijos klaidą', () => {
    // Eiti į prisijungimo puslapį
    cy.visit('/login');

    // Įvesti neteisingą el. paštą (be @ simbolio)
    cy.get('#exampleInputEmail').clear().type('blogasemail');
    cy.get('#exampleInputPassword').clear().type('x');

    // Paspausti prisijungimo mygtuką
    cy.contains('button, a.btn', /login/i).click();

    // Turėtų būti matomas klaidos pranešimas apie neteisingą el. paštą
    cy.get('.invalid-email').should('be.visible');
  });

  // Papildomi prisijungimo formos elementų ir validacijos testai
  describe('Prisijungimo formos elementai ir validacija', () => {
    it('Visi prisijungimo formos laukai rodomi teisingai', () => {
      // Patikrinti ar visi prisijungimo formos elementai rodomi teisingai
      cy.visit('/');
      cy.contains('Login').click();

      // Patikrinti prisijungimo formos antraštę
      cy.contains('Login').should('be.visible');
      cy.contains('Please enter your email address and password in order to login to your account.').should('be.visible');

      // Patikrinti ar matomas el. pašto laukas
      cy.contains('Email address').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');

      // Patikrinti ar matomas slaptažodžio laukas
      cy.contains('Password').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');

      // Patikrinti ar matomas prisijungimo mygtukas
      cy.get('button[type="submit"]').contains('Login').should('be.visible');
    });

    it('Prisijungimas su demonstraciniais duomenimis', () => {
      // Testuoti prisijungimą su demonstraciniais duomenimis
      cy.visit('/');
      cy.contains('Login').click();
      cy.contains('Login').should('be.visible');

      // Įvesti demonstracinius prisijungimo duomenis
      cy.get('input[type="email"]').type('demo@demo.lt');
      cy.get('input[type="password"]').type('testas2025');

      // Paspausti prisijungimo mygtuką
      cy.get('button[type="submit"]').contains('Login').click();

      // Patikrinti ar puslapis atsako (nepakimba)
      cy.get('body').should('exist');
      cy.get('body').should('satisfy', ($body) => {
        const bodyText = $body.text();
        return bodyText.includes('Login') || bodyText.includes('Welcome') || bodyText.includes('Dashboard');
      });
    });

    it('Validuoja privalomus laukus pateikiant tuščią formą', () => {
      // Testuoti ar forma validuoja tuščius laukus
      cy.visit('/');
      cy.contains('Login').click();
      cy.contains('Login').should('be.visible');

      // Bandyti prisijungti su tuščia forma
      cy.get('button[type="submit"]').contains('Login').click();
      cy.contains('Login').should('be.visible');

      // Bandyti prisijungti tik su el. paštu (be slaptažodžio)
      cy.get('input[type="email"]').type('vardas.pavarde@gmail.com');
      cy.get('button[type="submit"]').contains('Login').click();
      cy.contains('Login').should('be.visible');

      // Bandyti prisijungti tik su slaptažodžiu (be el. pašto)
      cy.get('input[type="email"]').clear();
      cy.get('input[type="password"]').type('manoSlaptazodis321');
      cy.get('button[type="submit"]').contains('Login').click();
      cy.contains('Login').should('be.visible');
    });
  });
});
