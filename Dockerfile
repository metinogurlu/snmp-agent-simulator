FROM node:latest
WORKDIR /
COPY package*.json /
RUN npm install

COPY . .
EXPOSE 40000-41000/udp 34380
CMD [ "npm", "start" ]
