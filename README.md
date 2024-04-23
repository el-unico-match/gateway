# gateway

# Ejecución sobre servicios remotos:

1) Se debe disponer de las siguientes variables de entorno para su ejecución (las cuales podrían
econtrarse en un archivo .env en la raíz del proyecto):

```
PORT=4001
MATCHES_API_DOMAIN=<urel servicio matches>
MESSAGES_API_DOMAIN=<url servicio messages>
PROFILES_API_DOMAIN=<url servicio profiles>
USERS_API_DOMAIN=https://users-uniquegroup-match-fiuba.azurewebsites.net/api
HOST=<host>
```

2) Ejecutar el siguiente comando:

```
docker compose -f docker-compose.yml up --build
```

# Ejecución sobre servicios locales 

# TODO

1) Se debe disponer de las siguientes variables de entorno para su ejecución (las cuales podrían
econtrarse en un archivo .env en la raíz del proyecto):

```
PORT=4001
MATCHES_API_DOMAIN=TODO
MESSAGES_API_DOMAIN=TODO
PROFILES_API_DOMAIN=TODO
USERS_API_DOMAIN=https://users-uniquegroup-match-fiuba.azurewebsites.net/api
HOST=localhost
```



```
docker compose -f dev.docker-compose.yml up --build
```