module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'OrderItem',
    {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      orderId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        field: 'order_id',
      },
      productId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        field: 'product_id',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unitPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        field: 'unit_price',
      },
      lineTotal: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        field: 'line_total',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'order_items',
      timestamps: false,
      indexes: [{ fields: ['order_id'] }, { fields: ['product_id'] }],
    }
  );
};
