// // models/index.js
// const { Sequelize, DataTypes } = require("sequelize");
// const sequelize = new Sequelize(process.env.DATABASE_URL);

// const User = require("./userModel")(sequelize, DataTypes);
// const Stock = require("./stockModel")(sequelize, DataTypes);
// const UserStock = require("./userStockModel")(sequelize, DataTypes);
// const Transaction = require("./transactionModel")(sequelize, DataTypes);

// // Relationships
// User.hasMany(UserStock, { foreignKey: "user_id" });
// User.hasMany(Transaction, { foreignKey: "user_id" });

// Stock.hasMany(UserStock, { foreignKey: "stock_id" });
// Stock.hasMany(Transaction, { foreignKey: "stock_id" });

// UserStock.belongsTo(User, { foreignKey: "user_id" });
// UserStock.belongsTo(Stock, { foreignKey: "stock_id" });

// Transaction.belongsTo(User, { foreignKey: "user_id" });
// Transaction.belongsTo(Stock, { foreignKey: "stock_id" });

// module.exports = { sequelize, User, Stock, UserStock, Transaction };
