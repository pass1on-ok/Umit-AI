FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/


RUN npm install
RUN npx prisma generate


COPY . .

RUN npm run build


# CMD [ "npm", "run", "start:prod" ]

CMD [ "node", "dist/src/main.js" ]