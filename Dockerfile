FROM node:10
WORKDIR /
COPY package*.json /
RUN npm install

COPY . .
EXPOSE 40000-50000/udp
CMD [ "node", "/core/app.js" ]
