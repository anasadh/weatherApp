const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("index.html", "utf-8");
const cssFile = fs.readFileSync("style.css", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  const celsiusTemp = Math.round(orgVal.main.temp - 273.15);
  const celsiusTempMin = Math.round(orgVal.main.temp_min - 273.15);
  const celsiusTempMax = Math.round(orgVal.main.temp_max - 273.15);

  return tempVal
    .replace("{%location%}", orgVal.name)
    .replace("{%country%}", orgVal.sys.country)
    .replace("{%tempval%}", celsiusTemp)
    .replace("{%tempmin%}", celsiusTempMin)
    .replace("{%tempmax%}", celsiusTempMax)
    .replace("{%tempstatus%}", orgVal.weather[0].main);
};

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Sanchi&appid=9e82e4710bed6b7a5823ba2a7a95b43d"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const realTimeData = replaceVal(homeFile, objdata);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(realTimeData);
        res.end();
      })
      .on("error", (err) => {
        console.error("Error:", err.message);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      });
  } else if (req.url === "/style.css") {
    res.writeHead(200, { "Content-Type": "text/css" });
    res.write(cssFile);
    res.end();
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("File not found");
  }
});

server.listen(2000, "127.0.0.1", () => {
  console.log("Server is running on http://127.0.0.1:2000/");
});
