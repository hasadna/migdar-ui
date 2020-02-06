FROM node:10-alpine AS build

COPY . /app/
RUN cd /app/ && \
    npm install --no-audit && \
    npm run build


FROM node:10-alpine

WORKDIR /app/

COPY --from=build /app/index.js index.js
COPY --from=build /app/dist dist
COPY --from=build /app/server/package.json .
COPY --from=build /app/server/package-lock.json .
RUN npm install

EXPOSE 8000

CMD node index.js
