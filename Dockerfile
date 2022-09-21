FROM node:12

ENV HOME /blink

WORKDIR ${HOME}

RUN apt-get update && apt-get install rsync -y

RUN npm install nodemon -g
