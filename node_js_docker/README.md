# Node js docker

## How to start service

### To run prod

```bash
npm run start
```

### To run dev with hot-reload

```bash
npm run start:dev
```

### Stop container

```bash
npm run stop
```

### Testing

```bash
curl http://localhost:8080/kv/foo
```

```bash
curl -H 'Content-Type: application/json' \
      -d '{ "key":"foo","value":"some" }' \
      -X POST \
      http://localhost:8080/kv
```

### Mini compose

```bash
node miniCompose.js up
```

```bash
node miniCompose.js down
```
