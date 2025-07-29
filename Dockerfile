FROM node:18

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

RUN npx playwright install --with-deps

CMD ["npm", "start"]
