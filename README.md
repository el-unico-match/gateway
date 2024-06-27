# Gateway

<center><image src="https://adictosaltrabajo.com/wp-content/uploads/2020/05/client-mssc-with-gateway-1.png" alt="Gateway"></center>

La responsabilidad de este módulo esta dada por el enrutamiento de las solicitudes REST de la App móvil y el Backoffice hacia los microservicios del Backend utilizando el esquema de apikeys. También realiza solicitudes que terminan en llamadas complejas que comprenden a varios servicios en el mismo endpoint para armar una respuesta única. Además se encarga de validar el token correspondiente a solicitudes que no estén destinadas al microservicio de usuario ya que este último realiza sus propios chequeos de autenticación.

## Documentación de los endpoints en Swagger:

<center><image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_9WelGnPrPva68rnqGLSPDnb-wNIAgv7ziQ&s" alt="Swagger"></center>


Enlace: https://gateway-uniquegroup-match-fiuba.azurewebsites.net/api-docs

## Liberías utilizadas:
<center><image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSJscx615heuSsv1tw02aEq7gBPkLohEBuxw&s" alt="Nodejs"></center>

* Framework Express: https://www.npmjs.com/package/express
* Validación de request's Express-Validator: https://www.npmjs.com/package/express-validator 
* Encriptado/desencriptado de tokens y apikeys JWT: 
    * https://www.npmjs.com/package/jsonwebtoken
    * https://www.npmjs.com/package/jwt-decode
* Documentación de endpoints Swagger-Jsdoc: https://www.npmjs.com/package/swagger-jsdoc
* Manejo de formatos de tiempo Moment: https://www.npmjs.com/package/moment
* Realización de solicitudes REST a otros microservicios Axios: https://www.npmjs.com/package/axios

# Instrucciones de uso:

<center><image src="https://miro.medium.com/v2/resize:fit:512/1*Bue3__BaT0wSxwB0zTh-gw.png" alt="Instrucciones"></center>

## Ejecución sobre servicios remotos:

1) Se debe disponer de las siguientes variables de entorno para su ejecución (las cuales podrían
econtrarse en un archivo .env en la raíz del proyecto):

```
PORT=4001
MATCHES_API_DOMAIN=<url servicio matches>
PROFILES_API_DOMAIN=<url servicio profiles>
USERS_API_DOMAIN=<url servicio users>
SERVICES_API_DOMAIN=<url servicio services>
SECRET_JWT_SEED=******
LOG_FILENAME=<log file name>
LOG_LEVEL=<log level>
HOST=<host>

APIKEY_WHITELIST="<apikey 1> <apikey gateway> <apikey n>"
APIKEY_VALUE="<apikey gateway>"
APIKEY_ACTIVATE_ENDPOINT="<ruta services>"

IS_APIKEY_CHECKING_DISABLED=<true o false>
```
Ejemplo 1:

```
PORT=4001
MATCHES_API_DOMAIN=https://match-uniquegroup-match-fiuba.azurewebsites.net
PROFILES_API_DOMAIN=https://profile-uniquegroup-match-fiuba.azurewebsites.net
SERVICES_API_DOMAIN=https://services-uniquegroup-match-fiuba.azurewebsites.net
USERS_API_DOMAIN=https://users-uniquegroup-match-fiuba.azurewebsites.net/api
SECRET_JWT_SEED=<API KEY pasada por privado solicitar a rafaelputaro@gmail.com>
LOG_FILENAME="log.txt"
LOG_LEVEL=10
HOST=0.0.0.0

APIKEY_WHITELIST=""
APIKEY_VALUE=""
APIKEY_ACTIVATE_ENDPOINT=""

IS_APIKEY_CHECKING_DISABLED=true
```
**NOTA: En este ejemplo no se hará el chequeo de apikey's ya que la variable IS_APIKEY_CHECKING_DISABLED desactiva esta funcionalidad.**

Ejemplo 2:

```
PORT=4001
MATCHES_API_DOMAIN=https://match-uniquegroup-match-fiuba.azurewebsites.net
PROFILES_API_DOMAIN=https://profile-uniquegroup-match-fiuba.azurewebsites.net
SERVICES_API_DOMAIN=https://services-uniquegroup-match-fiuba.azurewebsites.net
USERS_API_DOMAIN=https://users-uniquegroup-match-fiuba.azurewebsites.net/api
SECRET_JWT_SEED=<API KEY pasada por privado solicitar a rafaelputaro@gmail.com>
LOG_FILENAME="log.txt"
LOG_LEVEL=10
HOST=0.0.0.0

APIKEY_WHITELIST="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2JjZTAyMmZmM2EyNGVhMmZlYzczMiIsImJhc2VVcmwiOiJodHRwOi8vbG9jYWxob3N0OjQwMDMiLCJ0eXBlIjoic2VydmljZSIsImV4cCI6MTcxOTM5MzI5OH0.jekCLZWfl1dhFiwFddHj1k3D38u2mtcQ_AXbSKwHcQQ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2JkNmM5M2JmMjE4NmYzZjg2ZDg4OSIsImJhc2VVcmwiOiJodHRwOi8vbG9jYWxob3N0OjQwMDAiLCJ0eXBlIjoidXNlciIsImV4cCI6MTcyNzE2Nzk0NX0.iFoGnJmUUU-Vvlp38UbrHrMzKt1o5cwxugm5qUcSXeg"

APIKEY_VALUE='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2JkNmM5M2JmMjE4NmYzZjg2ZDg4OSIsImJhc2VVcmwiOiJodHRwOi8vbG9jYWxob3N0OjQwMDAiLCJ0eXBlIjoidXNlciIsImV4cCI6MTcyNzE2Nzk0NX0.iFoGnJmUUU-Vvlp38UbrHrMzKt1o5cwxugm5qUcSXeg'

APIKEY_ACTIVATE_ENDPOINT='http://localhost:4003/api/v1/services/'

IS_APIKEY_CHECKING_DISABLED=false
```
**NOTA: En este ejemplo se hará el chequeo de apikey's.**

2) Ejecutar el siguiente comando:

```
docker compose -f docker-compose.yml up --build
```

3) Acceder a documentación en local: http://localhost:<PORT>/api-docs/

NOTA 1: PORT normalmente es 4001 o sea: http://localhost:4001/api-docs/

NOTA 2: Verificar que la opción Servers de Swagger sea "localhost".
