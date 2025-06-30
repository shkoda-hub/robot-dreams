# Node js architecture
Only dev dependencies for eslint were used 
## Giude how to run
1. Install linter dependencies
```
npm install
```
2. To add new habit use
```
DAY_OFFSET=2 node server.ts add --name "nameOfHabbit" --freq "daily"
```
where DAY_OFFSET is an env of day offset for testing. By default offset is 0. So you can run without this env.

3. To check eslint issues
```
npm run lint
```
