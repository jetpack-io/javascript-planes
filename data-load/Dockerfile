# build container
FROM node:alpine as build

WORKDIR /src

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production
RUN cp package.json dist/.
RUN cp -R node_modules dist/.


# production container
FROM node:alpine as prod

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /src/dist .

CMD ["node", "index"]
