module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'AppSetting',
    {
      settingKey: {
        type: DataTypes.STRING(64),
        primaryKey: true,
        field: 'setting_key',
      },
      value: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      tableName: 'app_settings',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
};
