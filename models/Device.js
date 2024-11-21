const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Device = sequelize.define('Device', {
  deviceName: { type: DataTypes.STRING, allowNull: false },
  deviceId: { type: DataTypes.STRING, allowNull: false, unique: true },
  deviceStatus: { type: DataTypes.STRING, allowNull: false },
  devicePassword: { type: DataTypes.STRING, allowNull: false },
  deviceLastSeen: { type: DataTypes.DATE, allowNull: false },
  deviceCharging: { type: DataTypes.BOOLEAN, allowNull: false },
  deviceLocation: { type: DataTypes.STRING, allowNull: false },
  temperature: { type: DataTypes.FLOAT, allowNull: false },
  humidity: { type: DataTypes.FLOAT, allowNull: false }
});

module.exports = Device;
