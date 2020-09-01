class CanvasWindow {

    constructor() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext('2d');
        this.drawStyle = 'fill';
        this.context.translate(window.innerWidth / 2, window.innerHeight / 2);
        this.clear();
    }

    clear() {
        this.context.fillStyle = 'black';
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.context.fillRect(-w,-h, 2*w, 2*h);
    }

    onResize() {

    }

    draw() {
        if (this.drawStyle == 'fill') {
            this.context.fill();
        }
        else {
            this.context.stroke();
        }
    }

    rectangle(x, y, w, h) {
        if (this.drawStyle == 'fill') {
            this.context.fillRect(x, y, w, h);
        }
        else {
            this.context.strokeRect(x, y, w, h);
        }
    }

    line(x1, y1, x2, y2) {
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
    }

    color(c) {
        this.context.fillStyle = c;
        this.context.strokeStyle = c;
    }

    width(w) {
        this.context.lineWidth = w;
    }

    circle(x, y, r) {
        this.context.beginPath();
        this.context.arc(x, y, r, 0, 2 * Math.PI);
        this.draw();
    }

    fill() {
        this.drawStyle = 'fill';
    }

    stroke() {
        this.drawStyle = 'stroke';
    }

    grid(size) {
        const max = Math.max(window.innerWidth / 2, window.innerHeight / 2);
        for(let x = 0; x < max; x += size) {
            if(x / size % 5 == 0) {
                this.width(3);
                this.color('rgb(25, 25, 25)');
            }
            else {
                this.width(1);
                this.color('rgb(20, 20, 20)');
            }
            this.line(x, -max, x, max);
            this.line(-x, -max, -x, max);
            this.line(-max, x, max, x);
            this.line(-max, -x, max, -x);
        }
    }

}