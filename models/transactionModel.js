// models/transactionModel.js
module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define("Transaction", {
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
      transaction_type: {
        type: DataTypes.ENUM("buy", "sell"),
        allowNull: false,
      },
      units: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      price_per_unit: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  
    return Transaction;
  };
  