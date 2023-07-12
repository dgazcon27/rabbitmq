require('dotenv').config(); 
const amqp = require('amqplib'); 

let processedCount = 0; // Contador de mensajes procesados

async function consumeFromRabbitMQ() {
  try {
    const rabbitUser = process.env.RABBIT_USER;
    const rabbitPassword = process.env.RABBIT_PASSWORD;
    const rabbitHost = process.env.RABBIT_HOST;

    // Conexión a RabbitMQ
    const connection = await amqp.connect(`amqp://${rabbitUser}:${rabbitPassword}@${rabbitHost}`);
    const channel = await connection.createChannel();
    // Declarar una cola en RabbitMQ
    await channel.assertQueue('mi_cola');

    // Consumir mensajes de la cola
    channel.consume('mi_cola', (message) => {
      const messageContent = message.content.toString();
      const parsedMessage = JSON.parse(messageContent);

      console.log('Mensaje recibido:', parsedMessage);
      try{
        // Realizar las inserciones en el 400

        processedCount++;

        console.log('Mensajes procesados:', processedCount);



        // Confirmar el mensaje como procesado
        channel.ack(message);
      }catch(error2){
        // capturar el error
      }

      
    });
  } catch (error) {
    console.error('Error al consumir mensajes de RabbitMQ:', error);
  }
}

// Llamar a la función para consumir mensajes
consumeFromRabbitMQ();
