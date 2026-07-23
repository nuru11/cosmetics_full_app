module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'ProductRequest',
    {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING(512),
        allowNull: true,
        field: 'image_url',
      },
      customerName: {
        type: DataTypes.STRING(120),
        allowNull: false,
        field: 'customer_name',
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      clientDeviceId: {
        type: DataTypes.STRING(64),
        allowNull: true,
        field: 'client_device_id',
      },
      userId: {
        type: DataTypes.STRING(36),
        allowNull: true,
        field: 'user_id',
      },
      status: {
        type: DataTypes.ENUM('NEW', 'REVIEWED', 'FULFILLED', 'CLOSED'),
        allowNull: false,
        defaultValue: 'NEW',
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
      tableName: 'product_requests',
      timestamps: true,
      indexes: [
        { fields: ['status'] },
        { fields: ['client_device_id'] },
        { fields: ['created_at'] },
      ],
    }
  );
};
