/**
 * Тесты для OrderModel с использованием SQLite in-memory.
 * Это позволяет тестировать Sequelize-модели без подключения к PostgreSQL.
 */
import { Sequelize, DataTypes } from 'sequelize';
import { OrderModel } from './order.model';

describe('OrderModel (SQLite in-memory)', () => {
  const testId = '11111111-1111-4111-1111-111111111111';
  const testId2 = '22222222-2222-4222-2222-222222222222';

  beforeAll(async () => {
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: true,
      logQueryParameters: true,
    });

    // Инициализируем модель с in-memory экземпляром SQLite
    OrderModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'CREATED',
        },
        lockVersion: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'version',
        },
      },
      {
        sequelize,
        tableName: 'orders',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        version: 'lockVersion',
      },
    );

    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    // Очищаем таблицу перед каждым тестом
    await OrderModel.destroy({ where: {}, truncate: true });
  });

  describe('создание заказа', () => {
    it('должен создать заказ с дефолтными значениями', async () => {
      const order = await OrderModel.create({ id: testId });

      expect(order).toBeDefined();
      expect(order.id).toBe(testId);
      expect(order.status).toBe('CREATED');
      expect(order.created_at).toBeInstanceOf(Date);
      expect(order.updated_at).toBeInstanceOf(Date);
    });

    it('должен создать заказ с указанным статусом', async () => {
      const order = await OrderModel.create({
        id: testId,
        status: 'CONFIRMED',
      });

      expect(order).toBeDefined();
      expect(order.id).toBe(testId);
      expect(order.status).toBe('CONFIRMED');
    });

    it('должен создать заказ с уникальным id', async () => {
      const order1 = await OrderModel.create({ id: testId });
      const order2 = await OrderModel.create({ id: testId2 });

      expect(order1.id).toBe(testId);
      expect(order2.id).toBe(testId2);
      expect(order1.id).not.toBe(order2.id);
    });

    it('должен установить created_at и updated_at при создании', async () => {
      const order = await OrderModel.create({ id: testId });

      expect(order.created_at).toBeInstanceOf(Date);
      expect(order.updated_at).toBeInstanceOf(Date);
      expect(order.created_at.getTime()).toBeLessThanOrEqual(Date.now());
      expect(order.updated_at.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('обновление заказа', () => {
    it('должен обновить статус заказа', async () => {
      const order = await OrderModel.create({
        id: testId,
        status: 'CREATED',
      });

      order.status = 'CONFIRMED';
      await order.save();

      const updated = await OrderModel.findByPk(testId);
      expect(updated).not.toBeNull();
      expect(updated!.status).toBe('CONFIRMED');
    });

    it('должен обновить updated_at при изменении', async () => {
      const order = await OrderModel.create({ id: testId });
      const originalUpdatedAt = order.updated_at.getTime();

      // Небольшая задержка, чтобы время изменилось
      await new Promise((resolve) => setTimeout(resolve, 10));

      order.status = 'SHIPPED';
      await order.save();

      expect(order.updated_at.getTime()).toBeGreaterThan(originalUpdatedAt);
    });

    it('должен сохранить остальные поля неизменными при обновлении статуса', async () => {
      const order = await OrderModel.create({
        id: testId,
        status: 'CREATED',
      });
      const originalCreatedAt = order.created_at;

      order.status = 'CONFIRMED';
      await order.save();

      expect(order.id).toBe(testId);
      expect(order.created_at).toEqual(originalCreatedAt);
      expect(order.status).toBe('CONFIRMED');
    });

    it('должен обновить заказ через update()', async () => {
      await OrderModel.create({ id: testId, status: 'CREATED' });

      const [affectedCount] = await OrderModel.update(
        { status: 'CANCELLED' },
        { where: { id: testId } },
      );

      expect(affectedCount).toBe(1);

      const updated = await OrderModel.findByPk(testId);
      expect(updated!.status).toBe('CANCELLED');
    });
  });
});
