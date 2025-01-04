const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Manager', 'Staff'),
    allowNull: false,
    defaultValue: 'Staff',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Users', // Matches the table name in the SQL query
  timestamps: false,  // Disables Sequelize's default timestamps (createdAt and updatedAt)
  // hooks: {
  //   beforeCreate: async (user) => {
  //     if (user.password_hash) {
  //       user.password_hash = await bcrypt.hash(user.password_hash, 10);
  //     }
  //   },
  // },
});

module.exports = User;

// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
// const bcrypt = require('bcrypt');

// const User = sequelize.define('User', {
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   role: {
//     type: DataTypes.ENUM('admin', 'manager', 'staff'),
//     defaultValue: 'staff'
//   }
// }, {
//   hooks: {
//     beforeCreate: async (user) => {
//       user.password = await bcrypt.hash(user.password, 10);
//     }
//   }
// });

// module.exports = User;