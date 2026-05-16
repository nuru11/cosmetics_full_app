module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Cart',
    {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        unique: true,
        field: 'user_id',
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
      tableName: 'carts',
      timestamps: true,
      indexes: [{ fields: ['user_id'], unique: true }],
    }
  );
};
