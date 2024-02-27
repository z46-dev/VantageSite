export default class Temperature {
    constructor(name) {
        this.name = name;
        this.temperatures = []; // Array of temperature values
        this.humidities = []; // Array of humidity values

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = 512;
        this.canvas.height = 256 + 128;

        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.ctx.lineCap = this.ctx.lineJoin = "round";

        this.draw();

        this.mouse = {
            x: 0,
            y: 0
        };

        this.canvas.addEventListener("mousemove", event => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = (event.clientX - rect.x) / rect.width * this.canvas.width// - rect.x;
            this.mouse.y = (event.clientY - rect.y) / rect.height * this.canvas.height// - rect.y;
        });
    }

    draw() {
        requestAnimationFrame(this.draw.bind(this));
        const canvas = this.canvas;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Current value
        const currentTemperature = this.temperatures[this.temperatures.length - 1];
        const currentHumidity = this.humidities[this.humidities.length - 1];

        if (currentHumidity === undefined) {
            return;
        }

        ctx.fillStyle = "#CC5555";
        ctx.fillRect(0, 0, 512, 256);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 32px sans-serif";
        ctx.textAlign = "middle";
        ctx.fillText(this.name, 256, 32);

        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("Temperature: " + currentTemperature + "° F", 8, 64);
        ctx.fillText("Humidity: " + currentHumidity + "%", 8, 96);

        // History graph
        const entries = this.temperatures.length;
        const spacing = 512 / entries;
        const temperatureValues = [];
        const humidityValues = [];


        let minTemp = 9999,
            maxTemp = -9999,
            minHumidity = 0,
            maxHumidity = 100;

        for (let i = 0; i < entries; i++) {
            {
                const value = this.temperatures[i];
                temperatureValues.push(value);

                if (value < minTemp) {
                    minTemp = value;
                }

                if (value > maxTemp) {
                    maxTemp = value;
                }
            } {
                const value = this.humidities[i];
                humidityValues.push(value);
            }
        }

        ctx.fillStyle = "#AA5555";
        ctx.fillRect(0, 256, 512, 128);

        {
            ctx.beginPath();
            ctx.moveTo(0, 256 + 128 - ((temperatureValues[0] - minTemp) / (maxTemp - minTemp)) * 128);

            for (let i = 1; i < entries; i++) {
                ctx.lineTo(i * spacing, 256 + 128 - ((temperatureValues[i] - minTemp) / (maxTemp - minTemp)) * 128);
            }

            ctx.strokeStyle = "#FF0000";
            ctx.lineWidth = 2;
            ctx.stroke();
        } {
            {
                ctx.beginPath();
                ctx.moveTo(0, 256 + 128 - ((humidityValues[0] - minHumidity) / (maxHumidity - minHumidity)) * 128);
    
                for (let i = 1; i < entries; i++) {
                    ctx.lineTo(i * spacing, 256 + 128 - ((humidityValues[i] - minHumidity) / (maxHumidity - minHumidity)) * 128);
                }
    
                ctx.strokeStyle = "#0000FF";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        if (this.mouse.y > 256) {
            const selected = Math.round(this.mouse.x / spacing);

            if (selected >= 0 && selected < entries) {
                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 16px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(this.temperatures[selected] + "° F " + this.humidities[selected] + "%", 256, 256 - 8);

                ctx.strokeStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.moveTo(selected * spacing, 256);
                ctx.lineTo(selected * spacing, 256 + 128);
                ctx.stroke();
            }
        }
    }

    place(widthSize) {
        this.canvas.style.width = widthSize + "vmin";
        this.canvas.style.height = widthSize * (this.canvas.height / this.canvas.width) + "vmin";

        return this.canvas;
    }
}