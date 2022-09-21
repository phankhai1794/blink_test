FROM node:12

ENV HOME /blink

WORKDIR ${HOME}

RUN npm install nodemon -g
