import Barometer from "./plugins/Barometer.js";
import Temperature from "./plugins/Temperature.js";
import Wind from "./plugins/Wind.js";

class Data {
    static #DATA_URL = location.hostname === "wx.nfaschool.org" ? "//wx.nfaschool.org/api/data.json" : "./data.json";

    /**
     * @type {{timestamp:number,data:object}[]}
     */
    static data = [];

    static async load(maxTime = 1000 * 60 * 60 * 3) {
        try {
            const response = await fetch(Data.#DATA_URL + "?t=" + maxTime);
            Data.data = await response.json();
        } catch (error) {
            console.error("Error fetching data", error);
        }
    }

    static async loop() {
        await Data.load();
        setTimeout(Data.loop, 1000 * 60 * 3);
    }
}

await Data.loop();
window.Data = Data;

const barometer = new Barometer();
const insideTemperature = new Temperature("Inside");
const outsideTemperature = new Temperature("Outside");
const wind = new Wind();

Data.data.forEach(entry => {
    barometer.barometerValues.push(entry.data["Barometer"]);
    barometer.trends.push(entry.data["P|Barometric Trend"] / 20);
    barometer.timestamps.push(entry.timestamp);

    insideTemperature.temperatures.push(entry.data["Inside Temperature"]);
    insideTemperature.humidities.push(entry.data["Inside Humidity"] * 100 | 0);
    insideTemperature.timestamps.push(entry.timestamp);

    outsideTemperature.temperatures.push(entry.data["Outside Temperature"]);
    outsideTemperature.humidities.push(entry.data["Outside Humidity"] * 100 | 0);
    outsideTemperature.timestamps.push(entry.timestamp);

    wind.windSpeeds.push(entry.data["Wind Speed"]);
    wind.avg10Min.push(entry.data["10min Wind Speed"]);
    wind.windDirections.push(entry.data["Wind Direction"]);
    wind.timestamps.push(entry.timestamp);
});

const canvasGrid = document.getElementById("canvasGrid");
canvasGrid.appendChild(barometer.place(64));
canvasGrid.appendChild(insideTemperature.place(64));
canvasGrid.appendChild(outsideTemperature.place(64));
canvasGrid.appendChild(wind.place(64));