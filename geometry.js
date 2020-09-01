class Rectangle {

    static empty = new Rectangle(undefined, undefined, undefined, undefined);

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    intersect(rect) {
        const x = Math.max(this.x, rect.x);
        const n1 = Math.min(this.x + this.w, rect.x + rect.w);
        const y = Math.max(this.y, rect.y);
        const n2 = Math.min(this.y + this.h, rect.y + rect.h);
        if(n1 >= x && n2 >= y) {
            return new Rectangle(x, y, n1 - x, n2 - y);
        }
        else {
            return Rectangle.empty;
        }
    }
}

class Line {

    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}

class Circle {
    
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
}