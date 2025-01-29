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
  if (!dataContainer || !currentTemp || !currentHumidity || !lastUpdated) {
    console.error('Required elements not found in the DOM');
    return;
  }
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

  // Fetch and display histogram data
  fetchHistogramData('temp', 'temp-histogram', 'temp-start-date', 'temp-end-date');
  fetchHistogramData('humidity', 'humidity-histogram', 'humidity-start-date', 'humidity-end-date');
}

function fetchHistogramData(type, canvasId, startDateId, endDateId) {
  const startDate = document.getElementById(startDateId)?.value;
  const endDate = document.getElementById(endDateId)?.value;
  if (!startDate || !endDate) {
    console.error('Start date or end date not selected');
    return;
  }
  fetch(`/histogram?type=${type}&start=${startDate}&end=${endDate}`)
    .then(response => response.json())
    .then(data => {
      createOrUpdateHistogram(canvasId, data.labels, data.values);
    })
    .catch(error => console.error('Error fetching histogram data:', error));
}

function createOrUpdateHistogram(canvasId, labels, data) {
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx) {
    console.error(`Canvas element with id ${canvasId} not found`);
    return;
  }
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
          label: 'Value',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'hour'
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

// Functions to apply the selected date ranges
function applyTempRange() {
  fetchHistogramData('temp', 'temp-histogram', 'temp-start-date', 'temp-end-date');
}

function applyHumidityRange() {
  fetchHistogramData('humidity', 'humidity-histogram', 'humidity-start-date', 'humidity-end-date');
}

// Call the function when the page loads
window.onload = fetchDevices;