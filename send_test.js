const amqp = require('amqplib');

async function send() {
  const connection = await amqp.connect('amqp://localhost:5672');
  const channel = await connection.createChannel();
  const queue = 'default_queue';
  
  const message = {
    pattern: 'user_created',
    data: {
      action: 'user_created',
      id: 1,
      email: 'hello@example.com'
    },
    id: 'optional-uuid-for-request-response'
  };

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true
  });
  console.log('Sent:', message);
  
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

send().catch(console.error);