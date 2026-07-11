module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'ProductVariant',
    {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      productId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        field: 'product_id',
      },
      variantDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'variant_description',
      },
      price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      sku: {
        type: DataTypes.STRING(80),
        allowNull: true,
        unique: true,
      },
      color: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      size: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      productVersion: {
        type: DataTypes.ENUM('ORIGINAL', 'TWO_LEVEL', 'PREMIUM'),
        allowNull: false,
        defaultValue: 'ORIGINAL',
        field: 'product_version',
      },
      variantImages: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        field: 'variant_images',
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'sort_order',
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
      tableName: 'product_variants',
      timestamps: true,
      indexes: [
        { fields: ['product_id'] },
        { fields: ['sku'] },
      ],
    }
  );
};
