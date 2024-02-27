export default class Wind {
    constructor() {
        this.windSpeeds = []; // Array of wind speed values
        this.avg10Min = []; // Array of the avg 10-minute wind speeds
        this.windDirections = []; // Array of wind directions
        this.timestamps = []; // Array of timestamps

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = 512;
        this.canvas.height = 256 + 128;

        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.ctx.lineCap = this.ctx.lineJoin = "round";

        this.mouse = {
            x: 0,
            y: 0
        };

        this.canvas.addEventListener("mousemove", event => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = (event.clientX - rect.x) / rect.width * this.canvas.width;
            this.mouse.y = (event.clientY - rect.y) / rect.height * this.canvas.height;
        });
    }

    draw() {
        requestAnimationFrame(this.draw.bind(this));
        const canvas = this.canvas;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Current value
        const currentSpeed = this.windSpeeds[this.windSpeeds.length - 1];
        const currentAvg10Min = this.avg10Min[this.avg10Min.length - 1];
        const currentDirection = this.windDirections[this.windDirections.length - 1];

        if (currentAvg10Min === undefined) {
            return;
        }

        ctx.fillStyle = "#CC5555";
        ctx.fillRect(0, 0, 512, 256);

        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("Wind Speed: " + currentSpeed + "mph", 24, 64);
        ctx.fillText("10 Minute Avg: " + currentAvg10Min + " MPH", 24, 96);

        ctx.fillStyle = "#CCCC55";
        ctx.fillRect(8, 64 - 12, 12, 24);
        ctx.fillStyle = "#55CCCC";
        ctx.fillRect(8, 96 - 12, 12, 24);

        ctx.save();
        ctx.translate(256 + 128, 128);

        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 75, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        for (let i = 0; i < 8; i ++) {
            const angle = Math.PI / 4 * i - Math.PI / 2;

            ctx.moveTo(Math.cos(angle) * 70, Math.sin(angle) * 70);
            ctx.lineTo(Math.cos(angle) * 80, Math.sin(angle) * 80);

            ctx.fillText(i * 45 + "°", Math.cos(angle) * 95, Math.sin(angle) * 95);
        }
        ctx.stroke();

        ctx.font = "bold 32px sans-serif";
        ctx.fillText(currentDirection + "°", 0, 0);

        ctx.rotate(currentDirection * Math.PI / 180 - Math.PI / 2);
        ctx.translate(55, 0);
        ctx.scale(4, 4);
        ctx.moveTo(3, 0);
        ctx.lineTo(0, -1.5);
        ctx.lineTo(0, 1.5);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    place(widthSize) {
        this.canvas.style.width = widthSize + "vmin";
        this.canvas.style.height = widthSize * (this.canvas.height / this.canvas.width) + "vmin";

        this.draw();

        return this.canvas;
    }
}