FROM node:15
WORKDIR /app
COPY package.json .
#unterscheidet zwischen dev und prodmode
ARG NODE_ENV
RUN echo "NODE_ENV=${NODE_ENV}"
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi
COPY . . 
# ENV PORT 3000
EXPOSE $PORT
CMD ["node", "index.js"]

#docker build -t express-devops-image .
#docker rm express-devops -f #v löscht auch die anonymen volumes die wir immer erzeugen beim docker run
# erstes -v syncronisiert(bindes) alles aus dem aktuellen Verzeichnis(%cd%, ${pwd}) in workdirectory im container
# zweies sagt synce bitte nicht den node_modules ordner weil der in dev mode eh gelöscht bzw leer ist und innerhalb des containers mit npm install gefüllt wird
# hat den vorteil das bei änderungen nicht immer auch den node_modules ordner mit gesynct werden muss was die geschichte deutlich schneller macht
#docker run -v ${pwd}:/app -v /app/node_modules -d -p 3000:3000 --name express-devops express-devops-image
# mit dem nachfolgenden machen wir das filesystem im container read only das kann uns schützen weil dadurch kein sync vom container auf das hostsystem stattfinden kann
#docker run -v ${pwd}:/app:ro -v /app/node_modules -d -p 3000:3000 --name express-devops express-devops-image
#docker run -v ${pwd}:/app:ro -v /app/node_modules -d --env-file -p 3000:3000 --name express-devops express-devops-image  --> --env-file und "EXPOSE $PORT" im Dockerfile
