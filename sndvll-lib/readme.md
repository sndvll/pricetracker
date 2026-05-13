# SNDVLL CORE/COMPONTENTS/ICONS REPO

In the current state, support is limited to Angular 13.
Instructions for how to use with an angular project:

1. Clone the repo into the root of the project.
2. In tsconfig.json paste these paths in:
```
"paths": {
  "@sndvll/icons": ["dist/sndvll-icons"],
  "@sndvll/icons/*": ["dist/sndvll-icons/*"],
  "@sndvll/components": ["dist/sndvll-components"],
  "@sndvll/components/*": ["dist/sndvll-components/*"],
  "@sndvll/core": ["dist/sndvll-core"],
  "@sndvll/core/*": ["dist/sndvll-core/*"],
  "@sndvll/food-icons": ["dist/sndvll-food-icons"],
  "@sndvll/food-icons/*": ["dist/sndvll-food-icons/*"],
}
```
3. In angular.json paste these configs in under "projects" key:
```
    "sndvll-icons": {
      "projectType": "library",
      "root": "sndvll-lib/sndvll-icons",
      "sourceRoot": "sndvll-lib/sndvll-icons/src",
      "prefix": "lib",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:ng-packagr",
          "options": {
            "project": "sndvll-lib/sndvll-icons/ng-package.json"
          },
          "configurations": {
            "production": {
              "tsConfig": "sndvll-lib/sndvll-icons/tsconfig.lib.prod.json"
            },
            "development": {
              "tsConfig": "sndvll-lib/sndvll-icons/tsconfig.lib.json"
            }
          },
          "defaultConfiguration": "production"
        }
      }
    },
    "sndvll-components": {
      "projectType": "library",
      "root": "sndvll-lib/sndvll-components",
      "sourceRoot": "sndvll-lib/sndvll-components/src",
      "prefix": "lib",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:ng-packagr",
          "options": {
            "project": "sndvll-lib/sndvll-components/ng-package.json"
          },
          "configurations": {
            "production": {
              "tsConfig": "sndvll-lib/sndvll-components/tsconfig.lib.prod.json"
            },
            "development": {
              "tsConfig": "sndvll-lib/sndvll-components/tsconfig.lib.json"
            }
          },
          "defaultConfiguration": "production"
        }
      }
    },
    "sndvll-core": {
      "projectType": "library",
      "root": "sndvll-lib/sndvll-core",
      "sourceRoot": "sndvll-lib/sndvll-core/src",
      "prefix": "lib",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:ng-packagr",
          "options": {
            "project": "sndvll-lib/sndvll-core/ng-package.json"
          },
          "configurations": {
            "production": {
              "tsConfig": "sndvll-lib/sndvll-core/tsconfig.lib.prod.json"
            },
            "development": {
              "tsConfig": "sndvll-lib/sndvll-core/tsconfig.lib.json"
            }
          },
          "defaultConfiguration": "production"
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "main": "sndvll-lib/sndvll-core/src/test.ts",
            "tsConfig": "sndvll-lib/sndvll-core/tsconfig.spec.json",
            "karmaConfig": "sndvll-lib/sndvll-core/karma.conf.js"
          }
        }
      }
    },
    "sndvll-food-icons": {
      "projectType": "library",
      "root": "sndvll-lib/sndvll-food-icons",
      "sourceRoot": "sndvll-lib/sndvll-food-icons/src",
      "prefix": "lib",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:ng-packagr",
          "options": {
            "project": "sndvll-lib/sndvll-food-icons/ng-package.json"
          },
          "configurations": {
            "production": {
              "tsConfig": "sndvll-lib/sndvll-food-icons/tsconfig.lib.prod.json"
            },
            "development": {
              "tsConfig": "sndvll-lib/sndvll-food-icons/tsconfig.lib.json"
            }
          },
          "defaultConfiguration": "production"
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "main": "sndvll-lib/sndvll-food-icons/src/test.ts",
            "tsConfig": "sndvll-lib/sndvll-food-icons/tsconfig.spec.json",
            "karmaConfig": "sndvll-lib/sndvll-food-icons/karma.conf.js"
          }
        }
      }
    }
```
4. In root package.json, add these scripts:
```
"icons:build": "ng build sndvll-icons",
"components:build": "ng build sndvll-components",
"core:build": "ng build sndvll-core",
"lib:build": "npm run core:build && npm run icons:build && npm run components:build",
```
5. Then run ```npm run lib:build```

6. To use the food-icons add:
```
"food-icons:build": "ng build sndvll-food-icons",
```
and run:```npm run food-icons:build```and maybe also add that to the lib:build script.

Import components in modules where you want them, or create a ShareModule and import what you need there.<br />
Create an IconsModule to use icons. Take a look in components library for an example.

Also don't forget to  add ```/sndvll-lib``` to .gitignore file, and ``` './sndvll-lib/sndvll-core/purgecss-safelist.txt'``` to tailwind.config.js content-array.
