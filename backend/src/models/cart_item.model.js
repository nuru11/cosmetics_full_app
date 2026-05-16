module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'CartItem',
    {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      cartId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        field: 'cart_id',
      },
      productId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        field: 'product_id',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
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
      tableName: 'cart_items',
      timestamps: true,
      indexes: [
        { fields: ['cart_id'] },
        { fields: ['product_id'] },
        { unique: true, fields: ['cart_id', 'product_id'] },
      ],
    }
  );
};
