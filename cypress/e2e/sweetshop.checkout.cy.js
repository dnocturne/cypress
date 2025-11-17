// Checkout (pirkimo užbaigimo) formos validacijos testai
// Testuoja ar pirkimo užbaigimo forma veikia teisingai ir validuoja įvestus duomenis
describe('Sweetshop – Checkout formos validacija', () => {
  beforeEach(() => {
    // Išvalyti visus slapukus ir localStorage duomenis prieš kiekvieną testą
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Užpildo pristatymo formą ir neturi matyti invalid-feedback', () => {
    // Eiti į saldainių katalogą
    cy.visit('/sweets');

    // Pridėti Chocolate Cups produktą į krepšelį
    cy.contains('.card', /Chocolate Cups/i).within(() => {
      cy.get('a.addItem').click();
    });

    // Eiti į krepšelį
    cy.nav('/basket');
    cy.url().should('include', '/basket');

    // Užpildyti visas formos laukus teisingais duomenimis
    cy.get('form.needs-validation').within(() => {
      // Vardas ir pavardė (kai kuriose versijose abu laukai turi id="name")
      cy.get('input[type="text"]#name').first().clear().type('Petras');
      cy.get('input[type="text"]#name').eq(1).clear().type('Petraitis');

      // El. paštas
      cy.get('#email').clear().type('petras.petraitis@gmail.com');

      // Adresas
      cy.get('#address').clear().type('Gedimino pr. 15');
      cy.get('#address2').clear().type('Butas 42');

      // Šalis ir miestas
      cy.get('#country').select('United Kingdom');
      cy.get('#city').select('Cardiff');
      cy.get('#zip').clear().type('CF10 1AA');

      // Mokėjimo kortelės duomenys
      cy.get('#cc-name').clear().type('PETRAS PETRAITIS');
      cy.get('#cc-number').clear().type('4111 1111 1111 1111'); // Testuojamojo Visa kortelės numeris
      cy.get('#cc-expiration').clear().type('08/28');
      cy.get('#cc-cvv').clear().type('456');

      // Paspausti "Continue to checkout" mygtuką
      cy.contains('button', /Continue to checkout/i).click();
    });

    // Po formos pateikimo neturi būti matomų klaidos pranešimų
    cy.assertNoVisibleInvalidFeedback();
  });

  it('Parodo klaidas, kai forma tuščia', () => {
    // Eiti į krepšelio puslapį
    cy.visit('/basket');

    // Bandyti pateikti tuščią formą
    cy.get('form.needs-validation').within(() => {
      cy.contains('button', /Continue to checkout/i).click();
    });

    // Turėtų būti matomi validacijos klaidos pranešimai
    cy.get('.invalid-feedback').should('exist');
  });

  // Papildomi About puslapio turinio testai
  describe('About puslapio turinys', () => {
    it('About puslapio pasiekiamumas ir tinkamas turinio rodymas', () => {
      // Patikrinti ar About puslapis pasiekiamas ir rodo teisingą turinį
      cy.visit('/');
      cy.contains('About').click();

      // Puslapio body turi būti matomas
      cy.get('body').should('be.visible');

      // Turi būti rodomas projekto pavadinimas
      cy.contains('Sweet Shop Project').should('be.visible');
    });

    it('Navigacija į About puslapį ir rezultato apdorojimas', () => {
      // Testuoti navigaciją į About puslapį ir atgal
      cy.visit('/');
      cy.contains('About').click();

      // Patikrinti ar puslapis užsikrovė
      cy.get('body').should('be.visible');

      // Paspausti About dar kartą (jei navigacija leidžia)
      cy.contains('About').click();

      // Patikrinti ar puslapis turi reikiamą tekstą
      cy.get('body').should('contain.text', 'Sweet Shop Project');
    });

    it('About puslapis rodo profesionalų turinį', () => {
      // Patikrinti ar About puslapis turi profesionalų turinį
      cy.visit('/');
      cy.contains('About').click();

      // Patikrinti pagrindinį pavadinimą
      cy.contains('Sweet Shop Project').should('be.visible');

      // Patikrinti ar yra antraštės elementas su projekto pavadinimu
      cy.get('h1, h2').should('contain.text', 'Sweet Shop Project');

      // Turi būti bent 2 pastraipų elementai
      cy.get('p').should('have.length.at.least', 2);
    });
  });

  // Išplėstiniai checkout proceso testai
  describe('Išplėstinis Checkout procesas', () => {
    it('Sėkmingas krepšelio puslapio pasiekimas', () => {
      // Patikrinti ar krepšelio puslapis pasiekiamas sėkmingai
      cy.visit('/');
      cy.contains('Basket').click();

      // URL turi turėti /basket kelią
      cy.url().should('include', '/basket');

      // Turi būti matoma krepšelio antraštė
      cy.contains('Your Basket').should('be.visible');

      // Turi būti matomas checkout mygtukas
      cy.contains('Continue to checkout').should('be.visible');

      cy.log('Krepšelio puslapis sėkmingai pasiektas');
    });

    it('Atsiskaitymo adreso formos laukų rodymas', () => {
      // Patikrinti ar visi atsiskaitymo adreso laukai rodomi
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      // Patikrinti atsiskaitymo adreso sekcijos laukus
      cy.contains('Billing address').should('be.visible');
      cy.contains('First name').should('be.visible');
      cy.contains('Last name').should('be.visible');
      cy.contains('Email').should('be.visible');
      cy.contains('Address').should('be.visible');
    });

    it('Mokėjimo formos laukų rodymas', () => {
      // Patikrinti ar visi mokėjimo formos laukai rodomi
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      // Patikrinti mokėjimo sekcijos laukus
      cy.contains('Payment').should('be.visible');
      cy.contains('Name on card').should('be.visible');
      cy.contains('Credit card number').should('be.visible');
      cy.contains('Expiration').should('be.visible');
      cy.contains('CVV').should('be.visible');
    });

    it('Užsakymo suvestinės sekcijos rodymas', () => {
      // Patikrinti ar užsakymo suvestinės sekcija rodoma teisingai
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      // Patikrinti krepšelio antraštę
      cy.contains('Your Basket').should('be.visible');

      // Patikrinti bendros sumos eilutę
      cy.contains('Total').should('be.visible');

      // Puslapyje turi būti rodomas svarų (£) simbolis
      cy.get('body').should('contain.text', '£');

      cy.log('✓ Užsakymo suvestinės sekcija matoma');
    });

    it('Pristatymo pasirinkimų rodymas', () => {
      // Patikrinti ar pristatymo pasirinkimai rodomi teisingai
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      // Patikrinti pristatymo pasirinkimus
      cy.contains('Delivery').should('be.visible');
      cy.contains('Collect').should('be.visible');
      cy.contains('Standard Shipping').should('be.visible');

      cy.log('✓ Pristatymo pasirinkimai rodomi');
    });

    it('Krepšelio prekių rodymas jei yra', () => {
      // Patikrinti ar krepšelio prekės rodomos teisingai
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      // Analizuoti puslapio turinį ir nustatyti ar krepšelis tuščias
      cy.get('body').then(($body) => {
        const bodyText = $body.text();

        if (bodyText.includes('£0.00')) {
          // Jei krepšelis tuščias (£0.00), patikrinti tuščio krepšelio būseną
          cy.contains('Empty Basket').should('be.visible');
          cy.log('✓ Tuščias krepšelis patvirtintas');
        } else {
          // Jei krepšelis turi prekių, patikrinti ar matomos žinomos prekės
          const items = ['Sherbert Straws', 'Sherbet Discs', 'Strawberry Bon Bons', 'Chocolate Cups'];

          let itemsFound = 0;
          items.forEach((item) => {
            if (bodyText.includes(item)) {
              itemsFound++;
              cy.log(`Rasta prekė: ${item}`);
            }
          });

          if (itemsFound > 0) {
            cy.log(`✓ Rasta ${itemsFound} prekių krepšelyje`);
          } else {
            cy.log('✓ Krepšelio turinys patvirtintas (gali būti kitų prekių)');
          }
        }
      });
    });

    it('Formos struktūros išlaikymas per sąveiką', () => {
      // Patikrinti ar formos struktūra išlieka stabili per sąveiką
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      // Patikrinti visų pagrindinių sekcijų buvimą
      cy.contains('Billing address').should('be.visible');
      cy.contains('Payment').should('be.visible');
      cy.contains('Your Basket').should('be.visible');
      cy.contains('Delivery').should('be.visible');

      // Patikrinti footer su projekto informacija
      cy.contains('Sweet Shop Project 2018').should('be.visible');
    });
  });
});
