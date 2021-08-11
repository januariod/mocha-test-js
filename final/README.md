
# Guia de Uso

## Docker

`
docker run --name mongo -d -p 27017:27017 mongo
`

## RabbitMQ

`
docker run -d --hostname rabbitmq --name rabbitmq -p 15672:15672 -p 5672:5672 -p 25676:25676 rabbitmq:3-management
`

# Exemplo da Integração

![Alt text](docs/Treko.jpg?raw=true "Exemplo")