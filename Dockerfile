FROM node:8-alpine AS build

COPY . /app/
RUN cd /app/ && \
    npm install --no-audit && \
    npm run build


FROM node:8-alpine

WORKDIR /app/

COPY --from=build /app/index.js index.js
COPY --from=build /app/dist dist
RUN npm install express

EXPOSE 8000

CMD node index.js
