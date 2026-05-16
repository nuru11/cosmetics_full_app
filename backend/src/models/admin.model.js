module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Admin',
    {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash',
      },
      fullName: {
        type: DataTypes.STRING(120),
        allowNull: false,
        field: 'full_name',
      },
      referenceId: {
        type: DataTypes.STRING(40),
        allowNull: true,
        unique: true,
        field: 'reference_id',
      },
      phone: {
        type: DataTypes.STRING(30),
        allowNull: true,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM('SUPER_ADMIN', 'SALES', 'MARKETER', 'FINANCE'),
        allowNull: false,
        defaultValue: 'SALES',
      },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      createdAt: {
        type: DataTypes.DATE(3),
        allowNull: false,
        field: 'created_at',
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE(3),
        allowNull: false,
        field: 'updated_at',
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'admins',
      timestamps: true,
      indexes: [{ fields: ['role'] }, { fields: ['status'] }],
    }
  );
};
