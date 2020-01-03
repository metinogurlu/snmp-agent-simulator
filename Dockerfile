FROM node:10
WORKDIR /
COPY package*.json /
RUN npm install

COPY . .
EXPOSE 40000-40100/udp
CMD [ "node", "/core/app.js" ]
