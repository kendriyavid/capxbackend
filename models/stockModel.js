// models/stockModel.js
module.exports = (sequelize, DataTypes) => {
    const Stock = sequelize.define("Stock", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      stock_symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      stock_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      current_price: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      last_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  
    return Stock;
  };
  