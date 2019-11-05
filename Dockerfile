#KBZ @ vf-OS project
#David Aleixo david.aleixo@knowledgebiz.pt
# Dockerfile for a node container

#nodejs
FROM node:alpine

ENV ASSET_NAME="smartreportingenabler"

#Maintainer
LABEL description="Smart Reporting Enabler" 
LABEL maintainer="david.aleixo@knowledgebiz.pt"
LABEL author="David Aleixo"

LABEL vf-OS=true
LABEL vf-OS.icon=img/2.png
LABEL vf-OS.urlprefixReplace=true
LABEL vf-OS.frontendUri="/smartreportingenabler"
LABEL vf-OS.name=smartreportingenabler

# SRE enabler directory
RUN mkdir -p /usr/src/sre
# this lets the working directory for every COPY RUN and CMD command
WORKDIR /usr/src/sre
COPY . .
# get the node package file
# wildcard used to ensure both package.json and package-lock.json are copied
#COPY package*.json /usr/src/sre/
#COPY bower.json /usr/src/sre/
#COPY .bowerrc /usr/src/sre/

# install dependencies
#RUN npm i -g @angular/cli
#RUN npm install


# remove version warnings
# RUN cd fe/sre-app && ng config cli.warnings.versionMismatch false

# Install angular dependencies
#RUN cd fe/sre-app && npm install

# build angular cli app
#RUN cd fe/sre-app && ng build
RUN npm run boot
# expose the Smart Reporting enabler port
EXPOSE 4201

CMD [ "npm", "start" ]
