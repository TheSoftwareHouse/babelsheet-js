FROM node:10 as with-modules

WORKDIR /app

COPY package.json .

# Add credentials on build
ARG SSH_PRIVATE_KEY
ARG SSH_PUBLIC_KEY
RUN mkdir /root/.ssh/
RUN echo "${SSH_PRIVATE_KEY}" > /root/.ssh/id_rsa && \
    echo "${SSH_PUBLIC_KEY}" > /root/.ssh/id_rsa.pub && \
    chmod 600 /root/.ssh/id_rsa && \
    chmod 600 /root/.ssh/id_rsa.pub

# Make sure your domain is accepted
RUN touch /root/.ssh/known_hosts
RUN ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts

RUN npm i --production

# Copy files from previous image
FROM node:10

COPY --from=with-modules /app /app

WORKDIR /app

COPY . /app

CMD npm run start-producer
