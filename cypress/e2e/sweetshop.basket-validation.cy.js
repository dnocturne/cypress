// Krepšelio formos validacijos testai
// Tikrina ar checkout forma tinkamai validuoja įvestus duomenis ir rodo klaidas
describe('Sweetshop – Basket form validation', () => {
  beforeEach(() => {
    // Prieš kiekvieną testą atidaryti krepšelio puslapį
    cy.visit('/basket');
  });

  it('Neužpildyta forma rodo visas klaidas', () => {
    // Bandyti pateikti neužpildytą formą ir patikrinti ar rodomos visos klaidos
    cy.contains('button', /Continue to checkout/i).click();

    // Sąrašas visų laukiamų klaidos pranešimų
    const messages = [
      'Valid first name is required.',
      'Valid last name is required.',
      'Please enter a valid email address for shipping updates.',
      'Please enter your shipping address.',
      'Please select a valid country.',
      'Please provide a valid state.',
      'Zip code required.',
      'Name on card is required',
      'Credit card number is required',
      'Expiration date required',
      'Security code required',
    ];

    // Patikrinti ar kiekviena klaida matoma
    messages.forEach((m) => {
      cy.contains('.invalid-feedback', m).should('be.visible');
    });
  });

  // HTML5 el. pašto validacija priima tekstus su '@' bet be '.' kaip teisingus
  // Todėl tik trūkstamas @ simbolis turėtų rodyti klaidą
  it('Neteisingas el. paštas: trūkstamas @ rodo klaidą', () => {
    // Įvesti el. paštą be @ simbolio
    cy.get('#email').clear().type('martynas');

    // Bandyti pateikti formą
    cy.contains('button', /Continue to checkout/i).click();

    // Turėtų būti matomas el. pašto validacijos klaidos pranešimas
    cy.contains('.invalid-feedback', 'Please enter a valid email address for shipping updates.').should('be.visible');
  });

  it('El. paštas be taško domene priimamas (be klaidos)', () => {
    // El. paštas su @ bet be taško domene priimamas (HTML5 validacija)
    cy.get('#email').clear().type('vardenis@pavardenis');

    // Bandyti pateikti formą
    cy.contains('button', /Continue to checkout/i).click();

    // El. pašto klaida neturėtų būti rodoma
    cy.contains('.invalid-feedback', 'Please enter a valid email address for shipping updates.').should('not.be.visible');
  });

  it('Skaitmenys vardų laukuose priimami (dabartinė implementacija)', () => {
    // Dabartinė implementacija priima skaičius vardų laukuose
    // Turi būti bent du vardo laukai (vardas ir pavardė)
    cy.get('input#name').should('have.length.gte', 2);

    // Įvesti skaičius į vardo laukus
    cy.get('input#name').eq(0).type('12345');
    cy.get('input#name').eq(1).type('67890');

    // Įvesti skaičius į kortelės vardo lauką
    cy.get('#cc-name').type('12345 67890');

    // Bandyti pateikti formą
    cy.contains('button', /Continue to checkout/i).click();

    // Vardo klaidos pranešimai neturėtų būti matomi (priima skaičius)
    cy.contains('.invalid-feedback', 'Valid first name is required.').should('not.be.visible');
    cy.contains('.invalid-feedback', 'Valid last name is required.').should('not.be.visible');
  });

  // Ne skaitmeninių simbolių rinkiniai testavimui
  const nonNumericSets = [
    { label: 'tik raidės', card: 'ABCDABCDABCDABCD', exp: 'ABCD' },
    { label: 'tik simboliai', card: '!@#$!@#$!@#$!@#$', exp: '!@#$' },
    { label: 'raidės ir simboliai', card: 'AB!@AB!@AB!@AB!@', exp: 'AB!@' },
  ];

  // Testuoti kaip kortelės laukai apdoroja ne skaitmeninius simbolius
  nonNumericSets.forEach(({ label, card, exp }) => {
    it(`Ne skaitmeniniai kortelės laukai (${label}) išlaiko įvestus simbolius`, () => {
      // Įvesti ne skaitmeninį tekstą į kortelės numerio lauką
      cy.get('#cc-number').type(card, { force: true });

      // Patikrinti ar simboliai išliko (nėra įmontuoto validavimo)
      cy.get('#cc-number').invoke('val').should('eq', card);

      // Įvesti ne skaitmeninį tekstą į galiojimo datos lauką
      cy.get('#cc-expiration').type(exp, { force: true });

      // Patikrinti ar simboliai išliko
      cy.get('#cc-expiration').invoke('val').should('eq', exp);
    });
  });

  // CVV variantai su neteisingais simboliais
  const cvvVariants = [ 'ABC', '*&(', 'A$C' ];

  cvvVariants.forEach((cvv) => {
    it(`CVV laukas ignoruoja neteisingus simbolius: ${cvv}`, () => {
      // Gauti CVV lauką
      const field = cy.get('#cc-cvv');

      // Bandyti įvesti neteisingus simbolius
      field.type(cvv, { force: true });

      // type=number automatiškai pašalina neteisingus simbolius
      // Patikrinti ar likusi reikšmė yra tik skaičiai arba tuščia
      field.invoke('val').then((val) => {
        expect(val).to.match(/^\d*$/);  // Tik skaičiai arba tuščia
        expect(val.length).to.be.lte(cvv.length);  // Neturėtų būti raidžių/simbolių
      });
    });
  });

  it('Teisingų duomenų pateikimas be validacijos klaidų', () => {
    // Užpildyti formą teisingais duomenimis ir patikrinti ar nėra klaidų
    // Patikrinti ar yra bent du vardo laukai
    cy.get('input#name').should('have.length.gte', 2);

    // Įvesti vardą ir pavardę
    cy.get('input#name').eq(0).type('Antanas');
    cy.get('input#name').eq(1).type('Antanaitis');

    // Įvesti el. pašto adresą
    cy.get('#email').type('antanas.antanaitis@gmail.com');

    // Įvesti adreso informaciją
    cy.get('#address').type('Vytauto pr. 25');
    cy.get('#country').select('United Kingdom');
    cy.get('#city').select('Bristol');
    cy.get('#zip').type('BS1 3DB');

    // Įvesti mokėjimo kortelės duomenis
    cy.get('#cc-name').type('ANTANAS ANTANAITIS');
    cy.get('#cc-number').type('4111 1111 1111 1111');  // Testavimo Visa kortelė
    cy.get('#cc-expiration').type('06/29');
    cy.get('#cc-cvv').type('789');

    // Pateikti formą
    cy.contains('button', /Continue to checkout/i).click();

    // Forma turėtų validuotis be klaidų - jokie klaidos pranešimai neturėtų būti matomi
    cy.get('.invalid-feedback:visible').should('have.length', 0);
  });
});
