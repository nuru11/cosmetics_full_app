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
      variantId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        field: 'variant_id',
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
        { fields: ['variant_id'] },
        { unique: true, fields: ['cart_id', 'variant_id'] },
      ],
    }
  );
};
