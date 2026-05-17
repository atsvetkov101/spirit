// Скрипт для отправки тестового сообщения в обработчик handleTicketImport
// Использование: node send_ticket-import.js

const amqp = require('amqplib');

// Конфигурация подключения к RabbitMQ
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const QUEUE_NAME = 'default_queue'; // Имя очереди должно соответствовать конфигурации в приложении
const PATTERN = 'ticket_import';
async function sendTicketImportMessage() {
  let connection;
  try {
    // Подключение к RabbitMQ
    connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    // Создание тестового сообщения в соответствии с TicketImportDto
    const data = {
      id: 'ticket-12345',
      consumer_id: 1,
      consumer_email: 'user@example.com',
      assignee_id: 2,
      status: 'new',
      service: 'technical_support',
      created_by: 3,
      created_time: new Date().toISOString(),
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      act_type: 'installation',
      wiki_link: 'https://wiki.example.com/acts/installation',
      is_service_change_available: true,
      service_object: {
        address: 'ул. Примерная, д. 1, кв. 1',
        name: 'Квартира 1',
        search_code: 'ADDR-001',
        coords: {
          lat: '55.7558',
          lng: '37.6173'
        },
        phone_number: '+79991234567'
      }
    };
    
    const message = {
      pattern: PATTERN,
      data
    };

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    // Преобразование объекта в JSON-строку
    const messageBuffer = Buffer.from(JSON.stringify(message));
    // Отправка сообщения в очередь
    channel.sendToQueue(QUEUE_NAME, messageBuffer, {
      contentType: 'application/json',
      persistent: true
    });
    
    console.log('✓ Сообщение успешно отправлено в очередь');
    console.log('  Шаблон: ticket_import');
    console.log('  Данные:', JSON.stringify(data, null, 2));
    
    // Закрытие канала и соединения
    await channel.close();
  } catch (error) {
    console.error('✗ Ошибка при отправке сообщения:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Запуск функции отправки сообщения
sendTicketImportMessage();