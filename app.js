// Background toggle logic
const bg1 = document.getElementById('bg1');
const bg2 = document.getElementById('bg2');

bg1.style.backgroundImage = "url('https://images.unsplash.com/photo-1760659391924-86d657118008?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070')";
bg2.style.backgroundImage = "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=3132')";

bg1.classList.add('active');

let showingFirst = true;

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
const weatherIconImg = document.getElementById("right-top-upper-half-left-WeatherIcon");

// Get city, state, country using OpenStreetMap Nominatim
async function getLocationDetails(cityName) {
  const url = `https://nominatim.openstreetmap.org/search?addressdetails=1&q=${encodeURIComponent(
    cityName
  )}&format=jsonv2&limit=1`;

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

// 🌦️ Map weather condition to emoji
function getWeatherIcon(mainWeather) {
  switch (mainWeather.toLowerCase()) {
    case "clear":
      return "☀️";
    case "clouds":
      return "☁️";
    case "rain":
      return "🌧️";
    case "drizzle":
      return "💧";
    case "thunderstorm":
      return "⛈️";
    case "snow":
      return "❄️";
    case "mist":
    case "fog":
    case "haze":
    case "smoke":
      return "💨"; // foggy / hazy
    case "dust":
    case "sand":
    case "ash":
    case "tornado":
      return "🌪️";
    default:
      return "🌡️";
  }
}

// 🌤️ Fetch weather & update UI
async function getWthr(cityName) {
  try {
    const location = await getLocationDetails(cityName);

    const res = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(location.city)}&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) throw new Error(`Weather not found: ${res.status}`);

    const data = await res.json();
    const mainWeather = data.weather[0].main;

    // ✅ Use emoji instead of <img> tag
    weatherIconImg.textContent = getWeatherIcon(mainWeather);

    temp.innerText = `${Math.round(data.main.temp)}°C`;
    city.innerText = `📍${location.city}, ${location.state}`;
  } catch (error) {
    console.error(error);
    temp.innerText = "N/A";
    city.innerText = "City not found";
    weatherIconImg.textContent = "❓";
  }
}

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

// 🚀 Load default city on page load
document.addEventListener("DOMContentLoaded", () => {
  getWthr("Mumbai");
});
