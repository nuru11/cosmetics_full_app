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
        allowNull: false,
        field: 'user_id',
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
      indexes: [{ fields: ['user_id'] }, { fields: ['status'] }],
    }
  );
};
