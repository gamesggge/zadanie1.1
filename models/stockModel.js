const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'Stock',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: require('./productModel')(sequelize), key: 'id' },
      },
      shop_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: require('./shopModel')(sequelize), key: 'id' },
      },
      on_shelf: { type: DataTypes.INTEGER, defaultValue: 0 },
      in_order: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { tableName: 'Stocks' }
  )
}