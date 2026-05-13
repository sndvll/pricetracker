# PriceTracker

Mobile-focused PWA för att tracka krypto/tillgångspriser. Använder CoinGecko API + FreeCurrencyAPI. Lagrar data lokalt i IndexedDB (Dexie.js).

## Tech Stack

- **Angular 13** (ska migreras → 20+)
- **NgRx store/effects** (ska migreras → @ngrx/signals)
- **NgModules** (ska migreras → standalone)
- **sndvll-lib** — eget komponent/ikon-bibliotek (absorberat i repot)
- **Tailwind CSS**
- **Dexie.js** (IndexedDB)
- **@ngx-translate/core** — i18n (sv + en)
- **CoinGecko API** — kryptopriser
- **FreeCurrencyAPI** — fiat-valutor
- **@swimlane/ngx-charts** — diagram
- **Jest** — tester
- **PWA** — service worker (ngsw-config.json)

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
│   │   │   ├── store/          ← NgRx store, effects, actions, selectors, reducer
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
└── tailwind.config.js
```

## Migration Plan

### Fas 1: Förberedelse ✅
- [x] Absorbera sndvll-lib i repot (ta bort separat .git, ta bort från .gitignore)
- [x] Dataexport/import — backup/återställning av Dexie-data (Settings → Data)
- [x] VERSION_PLACEHOLDER i environment.prod.ts (för CalVer-releases)

### Fas 2: Angular 13 → 20 ✅
- [x] Uppgradera Angular major-version i taget (13→14→...→20)
- [x] Uppgradera sndvll-lib-biblioteken parallellt (ng-packagr)
- [ ] shortid → nanoid
- [ ] @ngx-translate — behåll (fungerar, wrap:as av sndvll-core)
- [x] Tailwind — behåll
- [ ] Jest — behåll, uppgradera versioner

### Fas 3: NgRx → @ngrx/signals + Standalone ✅
- [x] Konvertera NgRx store/effects → signalStore
- [x] Konvertera alla NgModules → standalone components
- [x] Rensa bort gamla NgRx-deps (actions/effects/reducers/selectors/moduler)
- [x] shortid → nanoid
- [x] Jest-uppgradering (ts-jest, @types/jest ^29)
### Fas 4: Produktionssättning 🚧
- [x] Sätt upp GH Actions + GH Pages-deploy (deploy.yml + ci.yml)
- [ ] Stäng ner DO-deploy
- [ ] Peka om domän (pricetrckr.sndvll.dev) från DO → GH Pages
- [ ] Exportera data → deploy → importera data på nya domänen
- [x] CalVer-releases via GH Actions (YYYY.MM.RUN_NUMBER)

## Commands

```bash
npm start           # ng serve — local dev
npm run build       # angular-build-info && ng build
npm test            # Jest — enhetstester
npm run lib:build   # Bygg alla sndvll-lib-bibliotek
npm run start:prod  # Build + serve lokalt (för test)
```

## Deploy

### Nuvarande
Deployad på DigitalOcean via `angular-cli-ghpages` (historiskt).

### Mål
GitHub Actions vid merge till `main` → GH Pages, CalVer-tagg + release.

## Data Export/Import

Settings → Data → **Exportera data**: laddar ner all IndexedDB-data som JSON.
Settings → Data → **Importera data**: ersätter befintlig data med JSON-fil.
Använd före domänbyte eller större migrationer.
