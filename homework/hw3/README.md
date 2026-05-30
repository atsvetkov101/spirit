# Решение домашнего задания №3 “Проектирование Агрегатов и их жизненный цикл”

## 1. Проектирование Агрегата
\src\domain\entities\order.ts
метод addItem, тест 'должен вернуть копию массива (иммутабельность)' проверяет, что внешний код не может напрямую изменить коллекцию строк заказа в обход корня.

## 2. Проектирование Репозитория
интерфейс IOrderRepository
\src\domain\repository\iorder-repository.ts

## 3. Проектирование Фабрики
OrderFactory
\src\domain\factories\order-factory.ts

## 4. Тестирование связки
OrderRepository:
src\infrastructure\repository\order-repository.ts
OrderRepository комплексный тест:
src\infrastructure\repository\order-repository-test.spec.ts


