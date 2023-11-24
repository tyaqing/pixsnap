FROM node:16-alpine as build

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm i pnpm  -g
RUN pnpm i

COPY . .

RUN pnpm build
RUN pnpm prune --prod

FROM node:16-alpine AS deploy

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json /usr/src/app/
COPY --from=build /usr/src/app/pnpm-lock.yaml /usr/src/app/
COPY --from=build /usr/src/app/dist/ /usr/src/app/dist/
COPY --from=build /usr/src/app/node_modules/ /usr/src/app/node_modules/

CMD [ "node", "dist/main.js" ]
