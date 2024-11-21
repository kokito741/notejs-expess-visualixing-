const Device = require('../models/Device');

exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.findAll();
    res.json(devices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateDeviceData = async (req, res) => {
  const { deviceId, temperature, humidity, battery, deviceBattery } = req.body; // Add deviceBattery here
  try {
    let device = await Device.findOne({ where: { deviceId } });
    if (device) {
      device.deviceLastSeen = new Date();
      device.temperature = temperature;
      device.humidity = humidity;
      device.deviceCharging = battery;
      device.deviceBattery = deviceBattery; // Update deviceBattery
      await device.save();
      res.status(200).send('Device data updated');
    } else {
      res.status(404).send('Device not found');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
