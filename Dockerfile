FROM alpine:latest AS fetcher
RUN apk add --no-cache curl
RUN curl -o swagger-theme.css https://settings-uniquegroup-match-fiuba.azurewebsites.net/swagger-theme.css

FROM node:21

COPY [".", "package.json","package-lock.json" , "/usr/src/"]
COPY --from=fetcher swagger-theme.css /

WORKDIR /usr/src

RUN npm install

EXPOSE 4001

ENTRYPOINT [ "node", "index.js"]