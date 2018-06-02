# desafio-b2w
Feita para o [Desafio B2W](https://github.com/admatic-tool/vaga-b2wads-senior), consiste em três APIs Rest e um worker para gerenciamento de transações. Foram feitas utilizando NodeJs com framework Express, ES6, MongoDb, Rabbitmq e Docker Compose.

## Detalhes
A **api-transacao** recebe informaçes de COMPRA DE INGRESSOS, após realizar algumas validaçes, a API cria uma nova transação e a envia para fila, devolve para o chamador as informações da transação criada com estado 'pending'. 
O **worker-transacao** recupera a transação da fila e executa todos os passos para finalização da transação com sucesso.

Os passos para finalização da transação são:
- Enviar informaçes de INGRESSO POR SHOW para serem gravadads na **api-foo**.
- Enviar informaçes de VALOR POR SHOW na **api-fighters**.

Caso ocorra alguma indisponibilidade enquanto a transação está sendo processada, a transação é colocada na fila para reprocessamento posterior, armazenando o passo em que a mesma parou, para que sejam executados apenas os passos que faltam.
São realizadas até 5 tentativas de reprocessamento de cada passo antes que a transação seja considerada falha, executando rollback da transação. 

## Dependência
Necessário apenas ter o [Docker](https://docs.docker.com/install/) e [Docker Compose](https://docs.docker.com/compose/install/) instalados.

## Instalação
Após clone
```sh
$ cd desafio-b2w
```
O Docker vai baixar todas as dependências, realizar build dos pacotes, e subir todos os containers.
```sh
$ sudo docker-compose up -d
```
Aṕos o terminar de subir os containers das três aplicações, do mongoDb e do Rabbitmq, basta acessar as portas das APIs para utilização.

## Portas das APIs
> API Transação: 8080
> API FOO: 3000
> API FIGHTERS: 4000

## Testes integrados e unitários
Os testes são realizados através do ambiente Docker, para realizar os testes basta executar os seguintes comandos:

###API Transação
```sh
$ sudo docker-compose -f ./tests/docker-compose-test.yml up api-transacao-test
```

###API FOO
```sh
$ sudo docker-compose -f ./tests/docker-compose-test.yml up api-foo-test
```

###API FIGTHERS
```sh
$ sudo docker-compose -f ./tests/docker-compose-test.yml up api-fighters-test
```

###**Obs.**: Entre os testes, utilizar o comando
```sh
$ sudo docker-compose -f ./tests/docker-compose-test.yml down
```
para encerrar os containers do teste anterior.

