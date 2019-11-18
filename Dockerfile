FROM node:10

ADD index.js /opt/ss/
ADD package.json /opt/ss/
ADD package-lock.json /opt/ss/

WORKDIR /opt/ss/

RUN npm install

CMD [ "/bin/bash" ]