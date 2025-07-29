FROM mcr.microsoft.com/playwright/node:lts

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 3000
CMD ["node", "index.js"]
