FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 3000

CMD ["npm", "run", "start:dev"]