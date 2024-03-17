//speed
let numTests = 5;
let testCompleted = 0;
let totalBitSpeed = 0;
let totalKbSpeed = 0;
let totalMbSpeed = 0;
let mbResults = [];
let averageSpeedInKbps = 0
let internetScore = []

let user = JSON.parse(localStorage.getItem('user'))
if (!user) {
  user = {
    name: 'Guest',
    scoreHistory: {
      date: [],
      score: []
    }
  }
  user.scoreHistory.score.unshift(0)
  localStorage.setItem('user', JSON.stringify(user))
}

function showLastResults(user) {
  let userAllScore = user.scoreHistory.score
  let limit = 0
  for (let i = userAllScore.length - 1; i >= 0; i--) {
    if (limit == 7) {
      break
    }
    internetScore.unshift(userAllScore[i])
    limit++
  }
}

showLastResults(user)

function startTest() {
  let startTime = new Date().getTime();
  let image = new Image();
  let imageApi = "https://source.unsplash.com/random?topic=nature";

  image.onload = async function () {
    let endTime = new Date().getTime();
    let imageSize;

    await fetch(imageApi).then((response) => {
      imageSize = response.headers.get("content-length");
    });

    let timeDuration = (endTime - startTime) / 1000;
    let loadedBits = imageSize * 8;
    let speedInBts = loadedBits / timeDuration;
    let speedInKbs = speedInBts / 1024;
    let speedInMbs = speedInKbs / 1024;

    totalBitSpeed += speedInBts;
    totalKbSpeed += speedInKbs;
    totalMbSpeed += speedInMbs;
    testCompleted++;

    let progressBar = document.getElementById('progressBar');
    progressBar.style.width = (testCompleted / numTests * 100) + '%';

    if (testCompleted === numTests) {
      let averageSpeedInBps = (totalBitSpeed / numTests).toFixed(2);
      averageSpeedInKbps = (totalKbSpeed / numTests).toFixed(2);
      let averageSpeedInMbps = (totalMbSpeed / numTests).toFixed(2);
      mbResults.push(parseFloat(averageSpeedInMbps));
      document.getElementById('bits').innerText = `Average Speed (Bits/sec): ${averageSpeedInBps}`;
      document.getElementById('kbs').innerText = `Average Speed (KB/sec): ${averageSpeedInKbps}`;
      document.getElementById('mbs').innerText = `Average Speed (MB/sec): ${averageSpeedInMbps}`;
      document.getElementById('info').innerText = "Test Completed!";
      document.getElementById('result').style.display = 'block';
      user.scoreHistory.date.push(new Date())
      console.log(user.scoreHistory.score);
      user.scoreHistory.score.push(averageSpeedInKbps)
      localStorage.setItem('user', JSON.stringify(user))
      showLastResults(user)
    } else {
      startTest();
    }
  };

  image.src = imageApi;
}

const init = () => {
  document.getElementById('info').textContent = "Testing...";
  startTest();
};

testCompleted = 0;
totalBitSpeed = 0;
totalKbSpeed = 0;
totalMbSpeed = 0;
document.getElementById('progressBar').style.width = '0';
document.getElementById('result').style.display = 'none';
mbResults = [];
init();






//chart


let areaChartOptions = {
  series: [
    {
      name: 'History of Speed score',
      data: internetScore,
    },
  ],
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  colors: ['#246dec'],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
  },
  markers: {
    size: 0,
  },
  yaxis: [
    {
      title: {
        text: 'Internet Score KB /sec',
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
  },
};
var areaChart = new ApexCharts(
  document.querySelector('#area-chart'),
  areaChartOptions
);
areaChart.render();



// class User{
//   #iScroreHistory
//   constructor(internetScoreHistory) {
//     this.#iScroreHistory = internetScoreHistory
//   }
//   addScore = function (date, score) {
//     this.#iScroreHistory.set(date, score)
//   }
// }























//weather
window.onload = function () {
  getPosition().then(([lat, lon]) => {
    const apiKey = '278349a5233b9b02da38439723b00a05';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('responseda xatolik');
        }
        return response.json();
      })
      .then(data => {
        displayWeather(data);
      })
      .catch(error => {
        console.error('requestda xatolik', error);
      });
  });
}

function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        resolve([lat, lon]);
      },
      (error) => {
        console.error("Foydalanuvchi joylashuvi olinmadi:", error);
        reject(error);
      }
    );
  });
}

function displayWeather(data) {
  const locationElement = document.querySelector('.location');
  const temperatureElement = document.querySelector('.temperature');
  const descriptionElement = document.querySelector('.description');

  locationElement.textContent = data.name;
  temperatureElement.textContent = data.main.temp + ' °C';
  descriptionElement.textContent = data.weather[0].description;
}

