const amqp = require('amqplib');

async function send() {
  const connection = await amqp.connect('amqp://localhost:5672');
  const channel = await connection.createChannel();
  const queue = 'default_queue';
  
  const message = {
    pattern: 'order_placed',
    data: {
      orderId: 123,
      amount: 99.99
    },
    id: 'optional-uuid-2'
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