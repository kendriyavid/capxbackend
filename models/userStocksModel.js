// models/userStockModel.js
module.exports = (sequelize, DataTypes) => {
    const UserStock = sequelize.define("UserStock", {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      stock_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      units_held: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      average_price: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  
    return UserStock;
  };
  