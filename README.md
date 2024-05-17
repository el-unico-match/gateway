# gateway

# Ejecución sobre servicios remotos:

1) Se debe disponer de las siguientes variables de entorno para su ejecución (las cuales podrían
econtrarse en un archivo .env en la raíz del proyecto):

```
PORT=4001
MATCHES_API_DOMAIN=<url servicio matches>
MESSAGES_API_DOMAIN=<url servicio messages>
PROFILES_API_DOMAIN=<url servicio profiles>
USERS_API_DOMAIN=<url servicio users>
SERVICES_API_DOMAIN=<url servicio services>
HOST=<host>
```
Por ejemplo:

```
PORT=4001
MATCHES_API_DOMAIN=<url servicio matches>
MESSAGES_API_DOMAIN=<url servicio messages>
PROFILES_API_DOMAIN=https://profile-uniquegroup-match-fiuba.azurewebsites.net
USERS_API_DOMAIN=https://users-uniquegroup-match-fiuba.azurewebsites.net/api
SERVICES_API_DOMAIN=https://services-uniquegroup-match-fiuba.azurewebsites.net
HOST=<host>
```

2) Ejecutar el siguiente comando:

```
docker compose -f docker-compose.yml up --build
```
3) Acceder a documentación en el servidor de desarrollo: https://gateway-uniquegroup-match-fiuba.azurewebsites.net/api-doc

4) Endpoint GET para testear rápidamente desde un browser si la app funciona correctamente: https://gateway-uniquegroup-match-fiuba.azurewebsites.net/services

# Ejecución sobre servicios locales 

1) Se debe disponer de las siguientes variables de entorno para su ejecución (las cuales podrían
econtrarse en un archivo .dev.env en la raíz del proyecto):

```
PORT=4001
MATCHES_API_DOMAIN=TODO
MESSAGES_API_DOMAIN=TODO
PROFILES_API_DOMAIN=TODO
PROFILES_API_ENDPOINTS="picture pictures profile profiles"
USERS_API_DOMAIN=https://<your ipv4>:4000/api
SERVICES_API_DOMAIN=http://<ip/localhost>:<port>
HOST=localhost
```
Por ejemplo:

```
PORT=4001
MATCHES_API_DOMAIN=https://match-api-uniquegroup-match-fiuba.azurewebsites.net
MESSAGES_API_DOMAIN=https://messages-uniquegroup-match-fiuba.azurewebsites.net
PROFILES_API_DOMAIN=https://profile-uniquegroup-match-fiuba.azurewebsites.net
SERVICES_API_DOMAIN=https://services-uniquegroup-match-fiuba.azurewebsites.net/
USERS_API_DOMAIN=https://users-uniquegroup-match-fiuba.azurewebsites.net/api
HOST=0.0.0.0

```
2) Ejecutar el siguiente comando en la carpeta del proyecto:

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

3) Ejecutar el servicio de "usuario" en una terminal separada de acuerdo a las instrucciones del servicio 
"usuario".

4) Acceder a documentación en local: http://localhost:<PORT>/api-doc/

NOTA: PORT normalmente es 4001 o sea: http://localhost:4001/api-doc/

5) Endpoint GET para testear rápidamente desde un browser si la app funciona correctamente: http://localhost:<PORT>/api/services

NOTA: PORT normalmente es 4001 o sea: http://localhost:4001/services