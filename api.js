require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const https = require('https');

app.use(express.urlencoded({extended:true}));


var weatherT = [];

app.get("/",(req, res)=>{
res.send("Ready");
})


app.post("/getWeather",(req, res)=>{
if(req.headers["content-type"] !=='application/json'){
res.setHeader('Content-Type', 'application/json')
res.statusCode = 400
res.write(JSON.stringify({
code:400,
error: {
message: "Bad Request"
}
}))
res.end()
return
}


let data = "";
req.on('data',(chunk)=>{
  data += chunk;
var nData = JSON.parse(data);
var cityArray = JSON.parse(nData.cities);

//fetching weather
var secretKey = process.env.KEY;

for(i=0;i<cityArray.length;i++){

	var city = cityArray[i];
	var key = secretKey;
    	var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${key}&units=metric`;
    https.get(url,(resp)=>{ 
        resp.on('data',(d)=>{
            var weatherData = JSON.parse(d);
	
var temp = [weatherData.name];
var tempW = Math.round(weatherData.main.temp) + "C";
	weatherT.push({[temp]:tempW});
if(weatherT.length == cityArray.length){
console.log(weatherT);
res.setHeader('Content-Type','application/json')
res.statusCode = 201
res.write(JSON.stringify({'weather':weatherT}));
res.end();
weatherT = [];

}
})
})
}
})


req.on('end',()=>{

})


})

app.listen(port,(req,res)=>{
console.log(`Server is running on port ${port}`);
})