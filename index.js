import Barometer from "./plugins/Barometer.js";
import Temperature from "./plugins/Temperature.js";

class Data {
    static #DATA_URL = location.hostname === "wx.nfaschool.org" ? "//wx.nfaschool.org/api/data.json" : "./data2.json";

    /**
     * @type {{timestamp:number,data:object}[]}
     */
    static data = [];

    static async load() {
        try {
            const response = await fetch(Data.#DATA_URL);
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

Data.data.forEach(entry => {
    barometer.barometerValues.push(entry.data["Barometer"]);
    barometer.trends.push(entry.data["P|Barometric Trend"] / 20);

    insideTemperature.temperatures.push(entry.data["Inside Temperature"]);
    insideTemperature.humidities.push(entry.data["Inside Humidity"] * 100);

    outsideTemperature.temperatures.push(entry.data["Outside Temperature"]);
    outsideTemperature.humidities.push(entry.data["Outside Humidity"] * 100);
});

document.body.appendChild(barometer.place(64));
document.body.appendChild(insideTemperature.place(64));
document.body.appendChild(outsideTemperature.place(64));