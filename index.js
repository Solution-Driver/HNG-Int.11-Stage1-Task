require('dotenv').config();

const express = require('express');
const axios = require('axios');
const requestIp = require('request-ip');

const app = express();
const PORT = process.env.PORT || 3000;
const weatherApiKey = process.env.WEATHER_API_KEY;

// Use request-ip middleware to get the client's IP address
app.use(requestIp.mw());
app.get('/', (req, res) =>{
  res.send("Hello World");
})


app.get('/api/hello', async (req, res) => {

    const visitor_Name = req.query.visitor_name;

    //Fetch client IP address.
    const client_Ip = 
      req.headers['cf-connecting-ip'] ||
      req.headers['x-real-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress || '';

    try {
        
        // Fetch Client's geolocation data/information
        const geoLocation = await axios.get(`http://ip-api.com/json/${client_Ip}`);
        const city = geoLocation.data.city;
        console.log(city);

        // Fetch Client's weather data/information
        const weatherData = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`);
        const temperature = weatherData.data.main.temp;
        const greeting = `Hello, ${visitor_Name}!, the temperature is ${temperature} degree Celcius in ${city}`;

        res.status(200).json({
          client_ip : client_Ip,
          location: city,
          greeting: greeting,

        });

    } catch(error) {
        res.status(500).json({ error: 'Could not fetch client data'});
    };
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});