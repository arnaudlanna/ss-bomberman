# Instruções

O projeto possui uma Dockerfile para facilitar sua execução.

Portanto, basta fazer o build utilizando o docker:

```
docker build -t ss-bomberman .
```

E executar o container:

```
docker run -it ss-bomberman
```

Feito isso, para rodar o projeto, basta utilizar o node:

```
node index.js
```