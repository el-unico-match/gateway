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

1) Se debe disponer de las siguientes variables de entorno para su ejecución (las cuales podrían
econtrarse en un archivo .dev.env en la raíz del proyecto):

```
PORT=4001
MATCHES_API_DOMAIN=TODO
MESSAGES_API_DOMAIN=TODO
PROFILES_API_DOMAIN=TODO
USERS_API_DOMAIN=https://<your ipv4>:4000/api
HOST=localhost
```
Por ejemplo:

```
PORT=4001
MATCHES_API_DOMAIN=TODO
MESSAGES_API_DOMAIN=TODO
PROFILES_API_DOMAIN=TODO
USERS_API_DOMAIN=http://192.168.100.203:4000/api

```
2) Ejecutar el siguien comando en la carpeta del proyecto:

```
docker compose -f dev.docker-compose.yml up --build
```

# Como obtener tu ipv4:

Son del estilo 172.26.x.x o 192.168.x.x.

Terminal Windows:

```
ipconfig
```

Terminal Linux:

```
ip address
```

3) Acceder a documentación en local: http://localhost:/api-doc/

NOTA: PORT normalmente es 4001 o sea: http://localhost:4000/api-doc/

