# BlockSplit dApp Workshop 

## Development

```
# ensure you use node version ^14 or ^16
nvm use 14

# install dependencies
npm install

# run development server
npm start
```

Navigate to `http://localhost:4200/` to open the app. 

## Code scaffolding

```
# generate a component
ng g c my-component

# generate a service
ng g s shared/my-service

# generate a feature state (Akita)
ng g @datorama/akita:af my-feature/my-feature --plain --entityService=default
```

## Build

```
# generate production build. produced artifacts
# will be located in `/dist` directory
npm run build
```

### Try production build

```
# serve and open in a browser
npm run serve-build
```

## Lint & Test

```
# run linter (eslint)
npm run lint

# run linter and fix issues
npm run lint:fix

# run tests
npm run test
```

There are precommit rules set by [husky](https://github.com/typicode/husky). For more information, check the [docs](https://typicode.github.io/husky/#/).

