FROM node:alphine
COPY . /queue-server
WORKDIR /queue-server
CMD node server.js
