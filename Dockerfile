FROM node:16

WORKDIR /app

# Install nodemon globally
RUN npm install -g nodemon

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "start"]
