FROM node:alpine

ENV ASSET_NAME="smartreporting"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .

RUN apk add --no-cache bash
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
RUN git --version
RUN npm i -g @angular/cli
RUN ng -v
RUN npm run boot

EXPOSE 4201

LABEL vf-OS=true
LABEL vf-OS.icon=img/2.png
LABEL vf-OS.urlprefixReplace=true
LABEL vf-OS.frontendUri="/smartreporting"
LABEL vf-OS.name=smartreporting
LABEL vf-OS.version.version=1
LABEL vf-OS.market.price=7

CMD ["npm", "start"]
