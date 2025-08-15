FROM --platform=linux/amd64 node:22-alpine
RUN apk add --no-cache build-base
RUN apk add --no-cache python3
RUN apk add --no-cache make
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

USER root

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node . .

RUN npm install

EXPOSE 5000

CMD ["node", "index.js" ]
