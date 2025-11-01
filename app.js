// Background toggle logic
// Background elements
const bg1 = document.getElementById('bg1');
const bg2 = document.getElementById('bg2');

// Set background images
bg1.style.backgroundImage = "url('https://images.unsplash.com/photo-1760659391924-86d657118008?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070')";
bg2.style.backgroundImage = "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=3132')";

// Get current hour
const hour = new Date().getHours();

// Show bg1 (night) from 6 PM to 6 AM
if (hour >= 18 || hour < 6) {
  bg1.classList.add('active');
  bg2.classList.remove('active');
} else {
  // Show bg2 (day) from 6 AM to 6 PM
  bg2.classList.add('active');
  bg1.classList.remove('active');
}

// Optional: Keep toggle functionality if you still want manual switching
let showingFirst = bg1.classList.contains('active');

document.querySelector('.theme-icon').addEventListener('click', function () {
  if (showingFirst) {
    bg1.classList.remove('active');
    bg2.classList.add('active');
  } else {
    bg2.classList.remove('active');
    bg1.classList.add('active');
  }
  showingFirst = !showingFirst;
});




// Weather API integration
// const temp = document.getElementById('right-top-upper-half-right-temprature');
// const city = document.getElementById('right-top-half-lower-CityName');
// const input = document.getElementById('city-input');

// const API_KEY = '828cc99e0335c9476a8f751b7c386d9a';
// const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// function handleKey(event) {
//   if (event.key === 'Enter') {
//     handleSearch();
//   }
// }

// function handleSearch() {
//   const cityName = input.value.trim();
//   if (cityName) {
//     getWthr(cityName);
//   }
// }

// async function getWthr(cityName) {
//   try {
//     const res = await fetch(`${BASE_URL}?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`);
    
//     if (!res.ok) {
//       throw new Error(`Weather not found: ${res.status}`);
//     }

//     const data = await res.json();
//     temp.innerText = `${Math.round(data.main.temp)}°C`;
//     city.innerText = `📍${data.name}, ${data.sys.country}`;
//   } catch (error) {
//     console.error('Error fetching weather data:', error);
//     temp.innerText = 'N/A';
//     city.innerText = 'City not found';
//   }
// }


// Weather API constants
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "828cc99e0335c9476a8f751b7c386d9a";

const temp = document.getElementById("right-top-upper-half-right-temprature");
const city = document.getElementById("right-top-half-lower-CityName");
const input = document.getElementById("city-input");
const weatherIconImg = document.getElementById("icon-cup");
const mood = document.getElementById("mood");
const feel = document.getElementById("feel");
const humi = document.getElementById("humi");
const wind = document.getElementById("wind");



// 🌍 Get city, state, country using OpenStreetMap Nominatim
async function getLocationDetails(cityName) {
  const url = `https://nominatim.openstreetmap.org/search?addressdetails=1&q=${encodeURIComponent(cityName)}&format=jsonv2&limit=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "WindAndWonderApp/1.0 (your-email@example.com)",
      Referer: window.location.origin,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch location data");

  const data = await res.json();
  if (data.length === 0) throw new Error("Location not found");

  const address = data[0].address;
  return {
    city: address.city || address.town || address.village || "",
    state: address.state || address.region || "",
    country: address.country || "",
  };
}


// 🌤️ Fetch weather & update UI
async function getWthr(cityName) {
  try {
    const location = await getLocationDetails(cityName);
    console.log("Location:", location);

    const res = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(location.city)}&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) throw new Error(`Weather not found: ${res.status}`);

    const data = await res.json();
    console.log("Weather Data:", data);
    
    const mainWeather = data.weather[0].icon; // e.g., "01d"
    weatherIconImg.src = `https://openweathermap.org/img/wn/${mainWeather}@2x.png`;

     const moodtext = data.weather[0].description;
    mood.textContent = moodtext;

     const feell = data.main.feels_like;
    feel.textContent = `${feell}°C`;

     const humid = data.main.humidity;
    humi.textContent = `${humid} %`;

      const windsp = data.wind.speed;
      let windspk = windsp * 3.6;
      windspk = windspk.toFixed(2);
      wind.textContent = `${windspk} km/hr`;


    const temperature = data.main.temp;
    if (temperature !== undefined && temperature !== null) {
      temp.innerText = `${Math.round(temperature)}°C`;
    } else {
      temp.innerText = "N/A";
    }

    localStorage.setItem("lastCity", cityName);


    city.innerText = `📍${location.city || 'Unknown city'}, ${location.state || ''}`;
  } catch (error) {
    console.error("Error fetching weather:", error);
    temp.innerText = "N/A";
    city.innerText = "City not found";
    weatherIconImg.textContent = "❓";
  }
}

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Add leading zeros
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // Display time
    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('right-half-bottom-clock').textContent = timeString;
}

// Update clock immediately and then every second
updateClock();
setInterval(updateClock, 1000);


// ⌨️ Handle Enter key
function handleKey(event) {
  if (event.key === "Enter") {
    const cityName = input.value.trim();
    if (cityName) {
      getWthr(cityName);
    }
  }
}

input.addEventListener("keydown", handleKey);

document.addEventListener("DOMContentLoaded", () => {
  temp.innerText = "--°C";  // Placeholder
  city.innerText = "📍Loading...";  // Placeholder

  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    getWthr(lastCity);
  } else {
    getWthr("Mumbai"); // Default city
  }
});

