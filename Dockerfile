FROM node:16.15.0-stretch-slim

ENV DEBIAN_FRONTEND noninteractive
ARG DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y net-tools telnet iputils-ping procps curl

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --chown=node . .

RUN npm install --production

ENTRYPOINT ["/bin/bash", "-c", "node --max-old-space-size=700 ./http/server.js"]