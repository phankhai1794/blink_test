FROM node:12.22.0

WORKDIR /shine

# COPY ./ ./

RUN apt-get update && apt-get install rsync -y
RUN npm i nodemon -g
