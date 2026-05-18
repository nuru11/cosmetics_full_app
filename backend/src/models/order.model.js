module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.STRING(36),
        allowNull: true,
        field: 'user_id',
      },
      clientDeviceId: {
        type: DataTypes.STRING(64),
        allowNull: true,
        field: 'client_device_id',
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        field: 'total_amount',
      },
      shippingAddress: {
        type: DataTypes.JSON,
        allowNull: true,
        field: 'shipping_address',
      },
      customerName: {
        type: DataTypes.STRING(120),
        allowNull: true,
        field: 'customer_name',
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(120),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'orders',
      timestamps: true,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['client_device_id'] },
        { fields: ['status'] },
      ],
    }
  );
};
