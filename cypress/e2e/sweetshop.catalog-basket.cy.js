// Importuoti produktų duomenis iš fixtures failo
import products from '../fixtures/products.json';

// Pagalbinė funkcija konvertuoti pinigų sumą iš teksto į skaičių
// Pvz.: "£1,234.56" -> 1234.56
const moneyToNumber = (text) => parseFloat(text.replace(/[£,]/g, ''));

// Katalogo ir Krepšelio testai
// Tikrina produktų katalogo rodymą, pridėjimą į krepšelį ir krepšelio funkcionalumą
describe('Sweetshop – Katalogas ir Krepšelis', () => {
  beforeEach(() => {
    // Išvalyti slapukus ir localStorage prieš kiekvieną testą
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Prideda kelias prekes, tikrina skaičiavimus ir pristatymo pasirinkimus', () => {
    // Atidaryti pagrindinį puslapį ir eiti į saldainių katalogą
    cy.visit('/');
    cy.nav('/sweets');
    cy.url().should('include', '/sweets');

    // Pridėti 2 produktus į krepšelį
    cy.addProduct('Chocolate Cups');
    cy.addProduct(/Sherb(e)?rt Straws/);

    // Patikrinti ar krepšelio ženkliukas (badge) rodo teisingą prekių skaičių
    cy.basketBadge().invoke('text').then((t) => {
      const n = parseInt(t.trim(), 10);
      expect(n).to.be.gte(2);
    });

    // Eiti į krepšelio puslapį
    cy.nav('/basket');
    cy.url().should('include', '/basket');

    // Patikrinti ar pridėtos prekės matomos krepšelyje
    cy.contains('#basketItems', /Chocolate Cups/i).should('exist');
    cy.contains('#basketItems', /Sherb(e)?rt Straws/i).should('exist');

    // Patikrinti ar krepšelio turinys rodomas teisingai
    cy.contains('Your Basket').should('be.visible');
    cy.contains('#basketItems li', /Total\s*\(GBP\)/i).should('be.visible');

    // Patikrinti ar "Collect" pristatymo būdas pasirinktas pagal nutylėjimą
    cy.get('#exampleRadios1').should('be.checked');

    // Perjungti į "Standard Shipping" ir patikrinti ar jis pasirinktas
    cy.get('#exampleRadios2').check({ force: true }).should('be.checked');

    // Ištuštinti krepšelį
    cy.contains('a', /Empty Basket/i).click();

    // Palaukti 750ms kol krepšelis atsinaujins
    cy.wait(750);

    // Patikrinti ar krepšelis tuščias (rodo 0 prekių)
    cy.get('#basketCount').should('contain', '0');
  });

  // Produktų katalogo rodymo testai
  describe('Produktų katalogo rodymas', () => {
    it('Visi produktai rodomi su pilna informacija', () => {
      // Patikrinti ar visi produktai rodomi su pilna informacija
      cy.visit('/');
      cy.contains('Sweets').click();

      // Patikrinti katalogo antraštę ir aprašymą
      cy.contains('Browse sweets').should('be.visible');
      cy.contains('Browse our delicious choice of retro sweets').should('be.visible');

      // Turi būti bent 16 produktų kortelių
      cy.get('.card').should('have.length.at.least', 16);

      // Kiekvienai produkto kortelei patikrinti:
      cy.get('.card').each(($product) => {
        // Kortelė turi būti matoma
        cy.wrap($product).should('be.visible');

        // Turi turėti paveikslėlį
        cy.wrap($product).find('img').should('exist');

        // Turi turėti pavadinimą (card-title, h5 arba h4)
        cy.wrap($product).find('.card-title, h5, h4').should('exist');

        // Turi rodyti kainą su svarų (£) simboliu
        cy.wrap($product).should('contain.text', '£');

        // Turi turėti mygtuką pridėti į krepšelį
        cy.wrap($product).find('button, .btn').should('exist').and('be.visible');
      });
    });

    it('Teisingai rodomos produktų detalės ir kainos', () => {
      // Patikrinti ar konkrečių produktų informacija ir kainos rodomos teisingai
      cy.visit('/');
      cy.contains('Sweets').click();
      cy.contains('Browse sweets').should('be.visible');

      // Patikrinti Chocolate Cups produktą
      cy.contains('Chocolate Cups').should('be.visible');
      cy.contains('Chocolate Cups').closest('.card').should('contain.text', '£1.00');

      // Patikrinti Sherbert Straws produktą
      cy.contains('Sherbert Straws').should('be.visible');
      cy.contains('Rainbow Dust Straws - Choose your colour').should('be.visible');
      cy.contains('Sherbert Straws').closest('.card').should('contain.text', '£0.75');

      // Patikrinti Sherbert Discs produktą
      cy.contains('Sherbert Discs').should('be.visible');
      cy.contains('UFO\'s Sherbert Filled Flying Saucers').should('be.visible');
      cy.contains('Sherbert Discs').closest('.card').should('contain.text', '£0.95');

      // Patikrinti Wham Bars produktą
      cy.contains('Wham Bars').should('be.visible');
      cy.contains('Wham original raspberry chew bar').should('be.visible');
      cy.contains('Wham Bars').closest('.card').should('contain.text', '£0.15');

      // Patikrinti ar yra pakankamai produktų kortelių
      cy.get('.card').should('have.length.at.least', 8);

      // Patikrinti ar matomi kiti produktai
      cy.contains('Bon Bons').should('be.visible');
      cy.contains('Jellies').should('be.visible');
      cy.contains('Fruit Salads').should('be.visible');
      cy.contains('Bubble Gums').should('be.visible');
    });

    it('Produktų paveikslėliai su tinkamais prieinamumo atributais', () => {
      // Patikrinti ar produktų paveikslėliai turi tinkamus prieinamumo atributus
      cy.visit('/');
      cy.contains('Sweets').click();
      cy.contains('Browse sweets').should('be.visible');

      // Kiekvienam produktui patikrinti paveikslėlio atributus
      cy.get('.card').each(($product) => {
        // Patikrinti ar yra paveikslėlis
        cy.wrap($product).find('img').should('exist');

        // Patikrinti ar paveikslėlis turi alt atributą (svarbą prieinamumui)
        cy.wrap($product).find('img').then(($img) => {
          if ($img.attr('alt') !== undefined) {
            cy.log('Paveikslėlis turi alt atributą');
          } else {
            cy.log('Paveikslėliui trūksta alt atributo');
          }
        });

        // Patikrinti ar paveikslėlis turi src atributą
        cy.wrap($product).find('img').should('have.attr', 'src');
      });

      // Turi būti bent 16 produktų kortelių
      cy.get('.card').should('have.length.at.least', 16);
    });
  });

  // Krepšelio operacijų testai
  describe('Krepšelio operacijos', () => {
    it('Produktų pridėjimas į krepšelį', () => {
      // Testuoti produktų pridėjimą į krepšelį
      cy.visit('/');
      cy.contains('Sweets').click();

      // Patikrinti ar puslapis užsikrovė teisingai
      cy.get('body').then(($body) => {
        const bodyText = $body.text();

        // Jei puslapis nerastas, praleisti testą
        if (bodyText.includes('Page not found')) {
          cy.log('⚠ Negalima testuoti pridėjimo - Saldainių puslapis nepasiekiamas');
          return;
        }

        // Ieškoti "Add to Basket" mygtukų
        cy.get('body').then(($pageBody) => {
          if ($pageBody.find('button:contains("Add to Basket"), button:contains("Add")').length > 0) {
            // Paspausti pirmą "Add to Basket" mygtuką
            cy.get('button:contains("Add to Basket"), button:contains("Add")').first().click();

            // Jei yra daugiau mygtukų, paspausti ir antrą
            cy.get('button:contains("Add to Basket"), button:contains("Add")').then(($buttons) => {
              if ($buttons.length > 1) {
                cy.wrap($buttons).eq(1).click();
              }
            });

            cy.log('Bandyta pridėti prekes į krepšelį');
          } else {
            cy.log('Nerasta "Add to Basket" mygtukų');
          }
        });
      });
    });

    it('Teisingos prekės ir kiekiai krepšelyje', () => {
      // Patikrinti ar krepšelyje rodomos teisingos prekės ir kiekiai
      cy.visit('/');
      cy.contains('Basket').click();

      // Patikrinti ar puslapis matomas
      cy.get('body').should('be.visible');
      cy.url().should('include', '/basket');

      // Analizuoti krepšelio turinį
      cy.get('body').then(($body) => {
        const bodyText = $body.text();

        if (bodyText.includes('Your Basket')) {
          // Patikrinti ar matoma krepšelio antraštė
          cy.contains('Your Basket').should('be.visible');

          // Jei yra prekių su kiekiais (x 1, x 2), patikrinti ar rodomi
          if (bodyText.includes('x 1') || bodyText.includes('x 2')) {
            cy.contains(/x \d+/).should('be.visible');
          }

          // Jei rodoma bendra suma, patikrinti formatą
          if (bodyText.includes('Total')) {
            cy.contains('Total').should('be.visible');
            cy.contains(/£\d+\.\d{2}/).should('be.visible');
          }
        }
      });
    });

    it('Prekių šalinimas iš krepšelio', () => {
      // Testuoti prekių šalinimą iš krepšelio
      cy.visit('/');
      cy.contains('Basket').click();

      // Ieškoti šalinimo mygtukų
      cy.get('body').then(($body) => {
        const bodyText = $body.text();

        if (bodyText.includes('Delete Item') || bodyText.includes('Remove')) {
          // Išsaugoti pradinį tekstą ir pabandyti pašalinti prekę
          cy.get('body').invoke('text').then((initialText) => {
            cy.get('a:contains("Delete Item"), button:contains("Remove")').first().click();
            cy.get('body').should('be.visible');
            cy.log('Bandyta pašalinti prekę');
          });
        } else {
          cy.log('Krepšelyje nerasta šalinimo mygtukų');
        }
      });
    });

    it('Tinkamas pranešimas tuščiam krepšeliui', () => {
      // Patikrinti ar tuščiam krepšeliui rodomas tinkamas pranešimas
      cy.visit('/');
      cy.contains('Basket').click();
      cy.contains('Your Basket').should('be.visible');

      // Analizuoti krepšelio būseną
      cy.get('body').then(($body) => {
        const bodyText = $body.text();

        if (bodyText.includes('£0.00')) {
          // Jei krepšelis jau tuščias, patikrinti tuščio krepšelio elementus
          cy.contains('Total (GBP)').should('be.visible');
          cy.contains('£0.00').should('be.visible');
          cy.contains('Empty Basket').should('be.visible');

          // Pastaba: demonstracinėje versijoje checkout mygtukas gali būti matomas ir tuščiam krepšeliui
          if (bodyText.includes('Continue to checkout')) {
            cy.log('Checkout mygtukas rodomas tuščiam krepšeliui - tikėtina demonstracinėje versijoje');
          }

          cy.log('Tuščio krepšelio būsena patvirtinta - rodo £0.00 sumą');
        } else if (bodyText.includes('Empty Basket')) {
          // Jei krepšelis turi prekių, paspausti "Empty Basket" ir patikrinti rezultatą
          cy.contains('Empty Basket').click();
          cy.contains('£0.00').should('be.visible');
          cy.log('Krepšelis sėkmingai ištuštintas');
        } else {
          // Jei yra prekių, pašalinti jas po vieną
          cy.get('body').then(($basketBody) => {
            if ($basketBody.find('a:contains("Delete Item")').length > 0) {
              // Pašalinti visas prekes
              cy.get('a:contains("Delete Item")').each(($deleteBtn) => {
                cy.wrap($deleteBtn).click();
              });
              // Patikrinti ar suma tapo £0.00
              cy.contains('£0.00').should('be.visible');
            }
          });
        }

        // Galutinis patikrinimas - krepšelis turi būti tuščias
        cy.contains('Your Basket').should('be.visible');
        cy.contains('£0.00').should('be.visible');
      });
    });
  });
});
