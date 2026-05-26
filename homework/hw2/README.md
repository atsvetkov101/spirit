# Решение домашнего задания №2 “Качество кода и богатая модель”

## 1\. Борьба с примитивами (Value Objects)

Реализованы Value Objects Email и Money:  
\\src\\vo\\email.ts  
\\src\\vo\\money.ts

## 2\. Unit-тесты для VO

Реализованы юнит-тесты для Value Objects:  
\\src\\vo\\email.spec.ts  
\\src\\vo\\money.spec.ts

## 3\. Анализ и рефакторинг (SOLID)

Объяснение кода:  
В проекте реализован контроллер-консьюмер для очереди RabbitMQ \\src\\entrypoints\\consumer\\consumer.controller.ts  
Консьюмер имеет метод-обработчик handleTicketImport() для обработки сообщений о заявках из внешней системы. По коду: сообщение передается из контроллера в сервис и в методе сервиса ConsumerService.handleTicketImport(data: TicketImportDto) выполняется сохранение данных в две таблицы tickets(Заявки) и service\_objects(Объекты обслуживания). Для сохранения используются модели Sequelize: Ticket и ServiceObject.

Класс, который требует рефакторинг: ConsumerService

## 4\. Применение SOLID 
В классе ConsumerService нарушены принципы SOLID: разделите ответственности (SRP), выделите абстракции (DIP/ISP).

Что было сделано: выделены две Entity: TicketEntity и ServiceObjectEntity. В TicketEntity применено использование Value Objeсt Email. Созданы репозитории TicketRepository и ServiceObjectRepository. В репозиториях реализованы методы save для сохранения Entity в БД. Репозитории подключены к сервису ConsumerService с помощью механизма DI из NestJS. Репозитории реализуют интерфейсы ITicketRepository и IServiceObjectRepository.
