FROM node:19

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 5001

CMD ["npm", "start"]