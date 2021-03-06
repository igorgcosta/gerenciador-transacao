import amqp from 'amqplib/callback_api'
import config from 'config'

// URI de conexao com o Rabbitmq
const uri = config.URI_RABBITMQ
// Nome da queue
const queue = config.QUEUE_NAME

// Objeto com funcao de conexao com rabbitmq para espera de mensagens
const transacaoReceiver = {
  startListening: onReceive => {
    amqp.connect(uri, (err, conn) => {
      if(err) hanldeError(err, conn, 'Erro ao tentar se conectar com Rabbitmq.')
      else {
        // Criacao de canal de comunicacao 
        conn.createChannel((err, ch) => {
          if(err) hanldeError(err, conn, 'Erro ao criar canal.')
          else {
            // Verifica se a queue existe
            ch.assertQueue(queue, {durable: false})
            // Em caso de teste não imprime queue no console
            if(process.env.NODE_ENV !== 'test') {
              console.log(`Waiting for messages in ${queue}...`)
            }
            // Tratamento de quando chega mensagem
            ch.consume(queue, msg => {
              if(msg) {
                //console.log(`Received ${msg.content}`)
                const id_transacao = JSON.parse(msg.content)
                onReceive(id_transacao)
                // Confirma recebimento da mensagem
                ch.ack(msg)
              }
            }, {noAck: false});
          }
        })
      }
    })
  }
}

const hanldeError = (err, conn, mensagem) => {
  console.log(mensagem, err)
  // Fecha conexao se existir
  if(conn) {
    conn.close()
    console.log('Conexao com Rabbitmq fechada.')
  }
} 

export default transacaoReceiver 
