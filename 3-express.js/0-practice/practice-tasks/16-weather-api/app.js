// 3️⃣ Weather API (Mock Data)
//     - Store weather info for different cities.  ✅
//     - `GET /weather/:city` → Returns weather details for a city. ✅ 
//     - `POST /weather` → Adds a new city's weather info.  ✅
//     - `PUT /weather/:city` → Updates weather info for a city.  
// boiler plate code
const express = require('express');
const app = express();
const port = 4000;

// middleware for json
app.use(express.json());

// data
const weatherData = [
  {
    city: "New York",
    temperature: 22,
    humidity: 65,
    condition: "Clear",
    windSpeed: 12,
    description: "A clear day with moderate winds."
  },
  {
    city: "London",
    temperature: 18,
    humidity: 75,
    condition: "Cloudy",
    windSpeed: 8,
    description: "Cloudy with a chance of rain."
  },
  {
    city: "Tokyo",
    temperature: 25,
    humidity: 80,
    condition: "Rainy",
    windSpeed: 15,
    description: "Heavy rain with thunderstorms."
  },
  {
    city: "Mumbai",
    temperature: 30,
    humidity: 85,
    condition: "Humid",
    windSpeed: 5,
    description: "Very humid with a chance of light showers."
  },
  {
    city: "Sydney",
    temperature: 20,
    humidity: 70,
    condition: "Partly cloudy",
    windSpeed: 10,
    description: "Partly cloudy with mild temperatures."
  }
];

// home page
app.get('/', (req,res) => {
  res.status(200).send('Hello. Welcome to home page.');
  // just practicing for real case home page
  // res.status(200).sendFile(path.join(__dirname, 'public', 'index'));
});
// get (read) all cities
app.get('/weather', (req,res) => {
  res.status(200).send(weatherData);
});

// get (read) for a particular city
app.get('/weather/:city', (req,res) => {
  // query parameter
  const  city  = req.params.city;     // use params instead of req.query since /:city not ?city
  // console.log(req.params.city);
  // console.log(`Requested city: "${city}"`); debugging -1
  // global variables      debugging -2
  let result = weatherData;
  
  if(city){
     result = weatherData.filter( f => f.city.toLowerCase() === city.toLowerCase());
  }

  // console.log(result);  debugging -3
  if(result.length === 0){
    return res.status(404).json({
      error: 'No data available !'
    });
  }

  res.status(200).send(result);
});

// post (create)
// 1. define routes
app.post('/weather', (req,res) => {
  // 2. query params
  const { city, temperature, humidity, condition, windSpeed, description } = req.body;
  // 3. edge case if even one of them is not input by user 
  if(!city || !temperature || !humidity || !condition || !windSpeed || !description){
    return res.status(400).json({
      error: 'Please provide all the required details: city, temperature, humidity, condition, windSpeed and description'
    });
  }
  // 4. use push method 
  weatherData.push({ city, temperature, humidity, condition, windSpeed, description });
  // 5. response 
  res.status(200).json({
    message: 'Info posted successfully !'
  });
});

// put (update)
// 1. define the route
  app.put('/weather/:city', (req,res) => {
  const city = req.params.city;  // defining city
  // 2. find the required data using 'find' method
  const weather = weatherData.find((f) => f.city.toLowerCase() === city.toLowerCase());

  // 3. edge case if user doesn't inputs all the required fields 
  if(! req.body.city || !req.body.temperature || !req.body.humidity || !req.body.condition || !req.body.windSpeed || !req.body.description){
    return res.status(400).json({
      message: 'Please provide all the required details: city, temperature, humidity, condition, windSpeed & description'
    });
  }

 // console.log(weather.city, req.body.city);

  // 4. update
  if(weather){
    // updating all 
    weather.city = req.body.city;
    weather.temperature = req.body.temperature;
    weather.humidity = req.body.humidity;
    weather.condition = req.body.condition;
    weather.windSpeed = req.body.windSpeed;
    weather.description = req.body.description;

    // 5. response 
    res.status(200).json({
      message: 'Info successfully updated !',
      weather
    });
  } else{
    res.status(404).json({
      error: 'NO data found'
    });
  }
});

// Delete (delete)
// 1. define the routes 
app.delete('/weather/:city', (req,res) => {
  //2. declare city 
  const  city  = req.params.city.toLowerCase();
  // console.log(city); debugging-1

  // 3. find the index required city that needs to be deleted using 'find Index'
  const index = weatherData.findIndex((f) => f.city.toLowerCase() === city);

  // 4. if conditon (index !== -1)
  if(index !== -1){
    // 5. deleted it using splice 
    weatherData.splice(index, 1);
    // 6. response 
    res.status(200).json({
      message: 'Required data deleted successfully !'
    });
  } else{
    res.status(400).json({
      error: 'No such city found !'
    });
  }
});

// server starts
app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});

