module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      categoryId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        field: 'category_id',
      },
      productName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'product_name',
      },
      productDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'product_description',
      },
      gender: {
        type: DataTypes.ENUM('MALE', 'FEMALE', 'UNISEX'),
        allowNull: false,
        defaultValue: 'UNISEX',
      },
      brand: {
        type: DataTypes.STRING(120),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'UNAVAILABLE'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      slug: {
        type: DataTypes.STRING(220),
        allowNull: false,
        unique: true,
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
      tableName: 'products',
      timestamps: true,
      indexes: [
        { fields: ['category_id'] },
        { fields: ['slug'] },
        { fields: ['status'] },
        { fields: ['gender'] },
        { fields: ['brand'] },
      ],
    }
  );
};
