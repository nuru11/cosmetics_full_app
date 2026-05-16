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
      productImages: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        field: 'product_images',
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
      price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
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
      productVersion: {
        type: DataTypes.ENUM('ORIGINAL', 'TWO_LEVEL', 'PREMIUM'),
        allowNull: false,
        defaultValue: 'ORIGINAL',
        field: 'product_version',
      },
      color: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      size: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      slug: {
        type: DataTypes.STRING(220),
        allowNull: false,
        unique: true,
      },
      sku: {
        type: DataTypes.STRING(80),
        allowNull: true,
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
        { fields: ['sku'] },
        { fields: ['status'] },
        { fields: ['gender'] },
        { fields: ['brand'] },
      ],
    }
  );
};
