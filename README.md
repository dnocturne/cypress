# Cypress Sweet Shop Tests

[![Cypress Tests](https://github.com/dnocturne/cypress/actions/workflows/cypress.yml/badge.svg)](https://github.com/dnocturne/cypress/actions/workflows/cypress.yml)
[![Nightly Tests](https://github.com/dnocturne/cypress/actions/workflows/nightly.yml/badge.svg)](https://github.com/dnocturne/cypress/actions/workflows/nightly.yml)
[![PR Tests](https://github.com/dnocturne/cypress/actions/workflows/pr-tests.yml/badge.svg)](https://github.com/dnocturne/cypress/actions/workflows/pr-tests.yml)

Automatizuoti E2E testai Sweet Shop demo aplikacijai naudojant Cypress.

## Turinys

- [Projekto aprašymas](#projekto-aprašymas)
- [Reikalavimai](#reikalavimai)
- [Įdiegimas](#įdiegimas)
- [Testų paleidimas](#testų-paleidimas)
- [CI/CD](#cicd)
- [Projekto struktūra](#projekto-struktūra)

## Projekto aprašymas

Šis projektas testuoja [Sweet Shop](https://sweetshop.netlify.app) demo aplikaciją, kuri yra sąmoningai sukurta su klaidomis testavimo tikslais.

### Testuojami scenarijai:

-  **Smoke tests** - pagrindiniai kritiniai testai
-  **Authentication** - login funkcionalumas
-  **Homepage** - pagrindinio puslapio turinio validacija
-  **Catalog & Basket** - prekių katalogas ir krepšelio operacijos
-  **Basket Validation** - formos validacijos testai
-  **Checkout** - checkout proceso testai

##  Reikalavimai

- Node.js 18+ arba 20+
- npm arba yarn
- Git

##  Įdiegimas

1. **Klonuoti repozitoriją:**
```bash
git clone https://github.com/dnocturne/cypress.git
cd cypress
```

2. **Įdiegti priklausomybes:**
```bash
npm install
```

##  Testų paleidimas

### Interaktyvi Cypress Console
```bash
npm run cy:open
```

### Headless režimas (CLI)
```bash
# Visi testai
npm test

# Tik sweetshop testai
npm run cy:run

# Specifiniai testai
npm run cy:run:smoke      # Smoke testai
npm run cy:run:auth       # Login testai
npm run cy:run:homepage   # Homepage testai
npm run cy:run:catalog    # Katalogo ir krepšelio testai
npm run cy:run:basket     # Basket validacijos testai
npm run cy:run:checkout   # Checkout testai
```

### Skirtingose naršyklėse
```bash
npm run test:chrome   # Chrome
npm run test:firefox  # Firefox
npm run test:edge     # Edge
```

### Headed režimas (matoma naršyklė)
```bash
npm run test:headed
```

##  CI/CD

### GitHub Actions Workflows

Projektas naudoja **4 GitHub Actions workflows**:

####  **Main Cypress Tests** (`.github/workflows/cypress.yml`)
-  Paleidžiamas: `push` į `master`/`develop` šakas, `pull request`, kasdien 14:45 UTC
-  Testuoja: **Chrome, Firefox, Edge** naršyklėse
-  Naudoja: Paralelizaciją su 3 naršyklėmis (fail-fast išjungtas)
-  Rezultatai: Automatiškai įkeliami screenshots esant klaidoms
-  Komentarai: Visi komentarai lietuvių kalba

**Kaip veikia:**
```yaml
Trigger: push to master → Install deps → Run tests in 3 browsers parallel → Upload artifacts
```

####  **Nightly Full Suite** (`.github/workflows/nightly.yml`)
-  Paleidžiamas: Kiekvieną naktį 3:30 UTC
-  Testuoja: Visus 6 test suites atskirai paraleliai (matrix strategy)
-  Siunčia: Pranešimus apie rezultatus lietuviškai
-  Tikslas: Pilnas regresijos testavimas
-  Komentarai: Visi komentarai lietuvių kalba

####  **PR Tests** (`.github/workflows/pr-tests.yml`)
-  Paleidžiamas: Pull Request atidarymas/atnaujinimas/peratidarymas
-  Testuoja: Tik smoke ir auth testus (greiti kritiškiausi testai)
-  Komentuoja: PR su rezultatais lietuviškai ("Smoke testai sėkmingai įvykdyti!")
-  Tikslas: Greitas feedback ciklas
-  Komentarai: Visi komentarai lietuvių kalba

####  **Manual Test Run** (`.github/workflows/manual-run.yml`)
-  Paleidžiamas: Rankiniu būdu per GitHub UI
-  Galima pasirinkti:
  - Kokį spec failą paleisti (all arba konkretų testą)
  - Kokią naršyklę naudoti (Chrome/Firefox/Edge)
  - Headed/headless režimą
-  Aprašymai: Lietuvių kalba GitHub UI
-  Tikslas: Debugging ir ad-hoc testavimas
-  Komentarai: Visi komentarai lietuvių kalba

### Kaip paleisti CI/CD:

#### Automatinis paleidimas:
```bash
# Commit ir push į master šaką
git add .
git commit -m "feat: add new tests"
git push origin master
```

#### Rankinis paleidimas:
1. Eiti į GitHub repository
2. Skiltis **Actions**
3. Pasirinkti **Manual Test Run**
4. Spausti **Run workflow**
5. Pasirinkti parametrus ir paleisti

### CI/CD Rezultatų peržiūra:

```
GitHub → Actions tab → Pasirinkti workflow run → Peržiūrėti:
├── Test results
├── Screenshots (jei failed)
├── Videos
└── Logs
```

### Artifacts:
Visi artifacts (screenshots, videos) saugomi **90 dienų** ir pasiekiami:
```
Actions → Workflow run → Artifacts section → Download
```

## Projekto struktūra

```
cypress/
├── e2e/                              # Test failai (su lietuviškais komentarais)
│   ├── sweetshop.smoke.cy.js         # Smoke testai (4 tests)
│   ├── sweetshop.auth.cy.js          # Login testai (5 tests)
│   ├── sweetshop.homepage.cy.js      # Homepage testai (8 tests)
│   ├── sweetshop.catalog-basket.cy.js # Katalogo testai (10 tests)
│   ├── sweetshop.basket-validation.cy.js # Validacijos testai (11 tests)
│   └── sweetshop.checkout.cy.js      # Checkout testai (13 tests)
├── fixtures/
│   └── products.json                 # Test duomenys
├── support/
│   ├── commands.js                   # Custom Cypress komandos
│   └── e2e.js                        # Global setup
├── screenshots/                      # Screenshots (kai testai failed)
└── videos/                          # Test execution videos

.github/
└── workflows/                        # CI/CD workflows (su lietuviškais komentarais)
    ├── cypress.yml                   # Pagrindiniai testai (14:45 UTC)
    ├── nightly.yml                   # Naktiniai testai (3:30 UTC)
    ├── pr-tests.yml                  # PR testai (on pull_request)
    └── manual-run.yml                # Rankiniai testai (workflow_dispatch)

cypress.config.js                     # Cypress konfiguracija
package.json                          # NPM dependencies ir scripts
```

## Custom Commands

Projektas turi kelis custom Cypress commands:

```javascript
cy.nav('/sweets')                    // Navigacija
cy.addProduct('Chocolate Cups')      // Pridėti produktą
cy.basketBadge()                     // Gauti krepšelio badge elementą
cy.assertNoVisibleInvalidFeedback()  // Tikrinti validacijos klaidas
```

## Lietuviški testų duomenys

Visi testai naudoja lietuviškus duomenis:

### Testų duomenų pavyzdžiai:
```javascript
// Vardai ir pavardės
- Petras Petraitis
- Jonas Jonaitis
- Antanas Antanaitis

// El. pašto adresai
- petras.petraitis@gmail.com
- jonas.jonaitis@gmail.com
- demo@demo.lt

// Adresai
- Gedimino pr. 15
- Vytauto pr. 25

// Slaptažodžiai
- Slaptazodis123!
- testas2025
- manoSlaptazodis321

// Kortelių duomenys
- Galiojimo datos: 08/28, 06/29
- CVV: 456, 789
```

### Wait times
Testai naudoja realistiškus wait times:
- Krepšelio atnaujinimas: 750ms (pakeista iš 500ms)
- Timeout: 3000ms navigacijai

## Žinomos aplikacijos problemos

Sweet Shop aplikacija turi sąmoningai įdėtų klaidų:

- Dubliuoti `id="name"` laukai (first name ir last name)
- Pristatymo kaina lieka po krepšelio ištuštinimo
- About puslapis kartais rodo "Page not found"
- JS skaičiavimai kartais netikslūs

Testai yra pritaikyti dirbti su šiomis problemomis.

## 📊 Testų Padengimas

| Test Suite | Testų skaičius | Būsena | Komentarai |
|-----------|-------------|--------|-----------|
| Smoke | 4 | ✅ | Lietuviški test names ir komentarai |
| Auth | 5 | ✅ | Lietuviški test names ir komentarai |
| Homepage | 8 | ✅ | Lietuviški test names ir komentarai |
| Catalog & Basket | 10 | ✅ | Lietuviški test names ir komentarai |
| Basket Validation | 11 | ✅ | Lietuviški test names ir komentarai |
| Checkout | 13 | ✅ | Lietuviški test names ir komentarai |
| **Total** | **51** | **✅** | **Visi testai su lietuviškais pavadinimais** |

### Testų pavyzdžiai:
- ✅ "Atidaro pradinį puslapį ir patikrina antraštę bei navigaciją"
- ✅ "Patikrina ar visi paveikslėliai užkrauti teisingai"
- ✅ "Prideda kelias prekes, tikrina skaičiavimus ir pristatymo pasirinkimus"
- ✅ "Visi prisijungimo formos laukai rodomi teisingai"
- ✅ "Neužpildyta forma rodo visas klaidas"

## Nuorodos

- [Sweet Shop Demo](https://sweetshop.netlify.app)
- [Cypress Documentation](https://docs.cypress.io)
- [GitHub Actions](https://docs.github.com/en/actions)
