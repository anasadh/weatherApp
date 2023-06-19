const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html" , "utf-8");

// const replaceVal = (tempVal, orgVal) => {
//     let temperature =  tempVal.replace("{%tempVal%}", orgVal.main.temp);
//      temperature =  temperature.replace("{%tempmin%}", orgVal.main.temp_min);
//      temperature =  temperature.replace("{%tempmax%}", orgVal.main.temp_max);
//      temperature =  temperature.replace("{%location%}", orgVal.name);
//      temperature =  temperature.replace("{%country%}", orgVal.sys.country);
//      temperature =  temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

//      return temperature;
// }

const replaceVal = (tempVal, orgVal) => {
    return tempVal.replace("{%tempval%}", orgVal.main.temp)
    .replace("{%tempmin%}", orgVal.main.temp_min)
    .replace("{%tempmax%}", orgVal.main.temp_max)
    .replace("{%location%}", orgVal.name)
    .replace("{%country%}", orgVal.sys.country)
    .replace("{%tempstatus%}", orgVal.weather[0].main)
};

const server = http.createServer((req,res) => {
    if(req.url == "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Sanchi&appid=9e82e4710bed6b7a5823ba2a7a95b43d")
.on('data', (chunk) => {
    const objdata = JSON.parse(chunk);
    const arrData = [objdata];
  console.log(arrData[0].main.temp);

  const kelvin = arrData[0].main.temp;
  const celsius = kelvin - 273.15;
  console.log(celsius);

//   const realTimeData = arrData.map((val) => {
//     // console.log(val.main);
//     return replaceVal(homeFile, val);
//   })
  

const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
res.write(realTimeData);

console.log(realTimeData);
})
.on("end", (err) => {
  if (err) return console.log('connection closed due to errors', err);
  res.end();
    });
    }
    else {
        res.end("File not found");
      }
});

server.listen(2000, "127.0.0.1");
