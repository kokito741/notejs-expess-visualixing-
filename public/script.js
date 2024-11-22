async function fetchDevices() {
  const response = await fetch('/devices'); // Fetch devices from the new server endpoint
  if (!response.ok) {
    console.error('Failed to fetch devices:', response.status);
    return;
  }

  const devices = await response.json();
  const table = document.getElementById('device-table');
  const currentTemp = document.getElementById('current-temperature');
  const currentHumidity = document.getElementById('current-humidity');
  const lastUpdated = document.getElementById('last-updated');
  const tempChartCtx = document.getElementById('temperature-chart').getContext('2d');
  const humidityChartCtx = document.getElementById('humidity-chart').getContext('2d');

  const temperatureData = [];
  const humidityData = [];
  const labels = [];

  devices.forEach(device => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${device.deviceName}</td>
      <td>${device.deviceId}</td>
      <td>${device.deviceStatus}</td>
      <td>${new Date(device.deviceLastSeen).toLocaleString()}</td>
      <td>${device.deviceCharging ? 'Yes' : 'No'}</td>
      <td>${device.deviceLocation}</td>
      <td>${device.deviceBattery} %</td> <!-- Display deviceBattery -->
    `;
    table.appendChild(row);

    // Assuming the device with the latest deviceLastSeen is the one we show as current
    if (!lastUpdated.textContent || new Date(device.deviceLastSeen) > new Date(lastUpdated.textContent)) {
      currentTemp.textContent = device.temperature;
      currentHumidity.textContent = device.humidity;
      lastUpdated.textContent = new Date(device.deviceLastSeen).toLocaleString();
    }

    labels.push(new Date(device.deviceLastSeen).toLocaleTimeString());
    temperatureData.push(device.temperature);
    humidityData.push(device.humidity);
  });

  const tempChart = new Chart(tempChartCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Temperature',
        data: temperatureData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      }]
    }
  });

  const humidityChart = new Chart(humidityChartCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Humidity',
        data: humidityData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
      }]
    }
  });
}

// Call the function when the page loads
window.onload = fetchDevices;
