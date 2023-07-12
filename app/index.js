require('dotenv').config(); 
const express = require('express');
const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

async function publishToRabbitMQ(message) {
  try {

    const rabbitUser = process.env.RABBIT_USER;
    const rabbitPassword = process.env.RABBIT_PASSWORD;
    const rabbitHost = process.env.RABBIT_HOST;

    // Conexión a RabbitMQ
    const connection = await amqp.connect(`amqp://${rabbitUser}:${rabbitPassword}@${rabbitHost}`);
    const channel = await connection.createChannel();

    // Declarar una cola en RabbitMQ
    await channel.assertQueue('mi_cola');

    const messageId = uuidv4();
    message.uuid = messageId;

    // Publicar el mensaje en RabbitMQ
    channel.sendToQueue('mi_cola', Buffer.from(JSON.stringify(message)));

    // Cerrar la conexión a RabbitMQ
    await channel.close();
    await connection.close();

    console.log('Mensaje publicado en RabbitMQ:', message);

    return messageId;
  } catch (error) {
    console.error('Error al publicar el mensaje en RabbitMQ:', error);
  }
}

app.use('*', async (req, res, next) => {
  // Obtener la ruta original de la solicitud
  const originalRoute = req.originalUrl;
  
  // Obtener el contenido JSON de la solicitud
  const message = {
    route: originalRoute,
    data: req.body
  };

  // Si es una solicitud POST, agregar el campo "event" al mensaje
  if (req.method === 'POST') {
    message.event = 'post_event';
  }

  // Publicar el mensaje en RabbitMQ
  const messageId = await publishToRabbitMQ(message);

  res.json({ uuid: messageId });
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
