# PriceTracker

Mobile-focused PWA för att tracka krypto/tillgångspriser. Använder CoinGecko API + FreeCurrencyAPI. Lagrar data lokalt i IndexedDB (Dexie.js).

## Tech Stack

- **Angular 20**
- **@ngrx/signals** (migrerat från NgRx store/effects)
- **Standalone components** (migrerat från NgModules)
- **sndvll-lib** — eget komponent/ikon-bibliotek (absorberat i repot)
- **Tailwind CSS**
- **Dexie.js** (IndexedDB)
- **@ngx-translate/core** — i18n (sv + en)
- **CoinGecko API** — kryptopriser
- **FreeCurrencyAPI** — fiat-valutor
- **@swimlane/ngx-charts** — diagram
- **Jest** — tester
- **GitHub Pages** — hosting

## Projektstruktur

```
pricetracker/
├── sndvll-lib/                 ← Absorberat komponentbibliotek
│   ├── sndvll-icons/           ← Egna ikoner
│   ├── sndvll-components/      ← Accordion, modal, tooltip, drag-drop, m.m.
│   ├── sndvll-core/            ← Overlay, persistence, language, utils
│   └── sndvll-food-icons/      ← Mat-ikoner
├── src/
│   ├── app/
│   │   ├── core/               ← Services, store, API, persistence, modeller
│   │   │   ├── api/            ← CoinGeckoApiService, FreeCurrencyApiService
│   │   │   ├── crypto/         ← CryptoCurrencyService
│   │   │   ├── fiat/           ← FiatCurrencyService
│   │   │   ├── persistence/    ← ListDbService, DataExportService, m.fl.
│   │   │   ├── store/          ← GameStore (signalStore)
│   │   │   └── model/          ← Interfaces: AssetList, AssetModel, PriceTrackerState
│   │   ├── assets-list/        ← Huvudvyn — listor med tillgångar
│   │   ├── add-asset/          ← Lägg till tillgång
│   │   ├── total-amount/       ← Totalbelopp för alla listor
│   │   ├── currency-details/   ← Detaljvy för en valuta (diagram)
│   │   ├── crypto-searchbar/   ← Sök efter kryptovalutor
│   │   ├── settings/           ← Inställningar, export/import
│   │   ├── i18n/               ← Översättningar (sv, en)
│   │   └── shared/             ← Delade pipes, moduler
│   ├── environments/           ← environment.ts / environment.prod.ts
│   └── assets/                 ← Statiska filer
├── angular.json                ← Mono-repo config (app + 4 library-projekt)
├── tailwind.config.js
└── .github/workflows/
    ├── deploy.yml              ← GH Actions deploy till GH Pages (push main)
    └── ci.yml                  ← PR-tester mot main
```

## Migration Plan — slutförd ✅

Alla migrationsfaser är klara. Appen är fullt migrerad till Angular 20, standalone components, @ngrx/signals och hostas på GitHub Pages.

### Fas 1: Förberedelse
- [x] Absorbera sndvll-lib i repot
- [x] Dataexport/import
- [x] VERSION_PLACEHOLDER i environment.prod.ts

### Fas 2: Angular 13 → 20
- [x] Uppgradera Angular major-version i taget (13→14→...→20)
- [x] Uppgradera sndvll-lib-biblioteken parallellt
- [x] shortid → nanoid
- [x] @ngx-translate — behåll (fungerar)
- [x] Tailwind — behåll
- [x] Jest-uppgradering

### Fas 3: NgRx → @ngrx/signals + Standalone
- [x] Konvertera NgRx store/effects → signalStore
- [x] Konvertera alla NgModules → standalone components
- [x] Rensa bort gamla NgRx-deps
- [x] Rensa bort FontAwesome → Lucide-icons (i sndvll-lib)

### Fas 4: Produktionssättning
- [x] Sätt upp GH Actions + GH Pages-deploy
- [x] Stäng ner DigitalOcean-deploy
- [x] Peka om domän (pricetrckr.sndvll.dev → GH Pages)
- [x] CalVer-releases via GH Actions (YYYY.MM.RUN_NUMBER)

## Commands

```bash
npm start           # ng serve — local dev
npm run build       # angular-build-info && ng build
npm run lib:build   # Bygg alla sndvll-lib-bibliotek
npm test            # Jest — enhetstester
```

## Deploy

### Production (GitHub Pages)
Automatisk vid merge till `main` via GitHub Actions-workflow:
1. Bygger sndvll-lib-bibliotek (`npm run lib:build`)
2. Kör tester (`npm test`)
3. Injecterar CalVer-version + commit hash i `environment.prod.ts`
4. Bygger med `--configuration production --base-href /`
5. Skapar git-tagg + GitHub Release
6. Deployar till GitHub Pages

Domän: **pricetrckr.sndvll.dev**

### Stage (svc.orb.local)
```bash
./deploy.sh stage
```
Bygger med `--configuration production --base-href=/pricetracker/` och rsynkar till svc.orb.local. Branch guard: stage endast från feature-branches.

## Data Export/Import

Settings → Data → **Exportera data**: laddar ner all IndexedDB-data som JSON.
Settings → Data → **Importera data**: ersätter befintlig data med JSON-fil.
Använd före större migrationer.
