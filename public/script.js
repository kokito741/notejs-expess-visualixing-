function fetchDevices() {
  fetch('/data')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Call a function to display the data
      displayData(data);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function displayData(data) {
  const dataContainer = document.getElementById('data-container');
  const currentTemp = document.getElementById('current-temperature');
  const currentHumidity = document.getElementById('current-humidity');
  const lastUpdated = document.getElementById('last-updated');
  dataContainer.innerHTML = ''; // Clear previous data

  const labels = [];
  const temperatureData = [];
  const humidityData = [];

  data.forEach(device => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>Device: ${device.device_name}</h3>
      <p>Location: ${device.device_location}</p>
      <p>Battery: ${device.device_battery} %</p>
      <p>Temperature: ${device.temp} °C</p>
      <p>Humidity: ${device.humanity} %</p>
      <p>Data Taken: ${device.data_taken}</p>
    `;
    dataContainer.appendChild(div);

    // Assuming the device with the latest data_taken is the one we show as current
    if (!lastUpdated.textContent || new Date(device.data_taken) > new Date(lastUpdated.textContent)) {
      currentTemp.textContent = device.temp;
      currentHumidity.textContent = device.humanity;
      lastUpdated.textContent = new Date(device.data_taken).toLocaleString();
    }

    labels.push(new Date(device.data_taken).toLocaleTimeString());
    temperatureData.push(device.temp);
    humidityData.push(device.humanity);
  });

  // Create or update charts
  createOrUpdateChart('temperature-chart', 'Temperature', labels, temperatureData, 'rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.2)');
  createOrUpdateChart('humidity-chart', 'Humidity', labels, humidityData, 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.2)');
}

function createOrUpdateChart(canvasId, label, labels, data, borderColor, backgroundColor) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  if (window[canvasId]) {
    window[canvasId].data.labels = labels;
    window[canvasId].data.datasets[0].data = data;
    window[canvasId].update();
  } else {
    window[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute'
            }
          }
        }
      }
    });
  }
}

// Call the function when the page loads
window.onload = fetchDevices;