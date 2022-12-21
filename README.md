# AuthMiddleware

This middleware check for a jwt token in the headers and decode the user


Version 2 will return a `407` if any problem found with the `TOKEN`

## Env Variables
`JWT_SECRET` is needed

## how to install
create a file `.npmrc` and append this
```
@designa:registry=https://gitlab.com/api/v4/packages/npm/
```

then to install `npm install --save @designa/auth-middleware`