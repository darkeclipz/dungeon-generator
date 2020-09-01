class Vec2 {

    constructor(x = 0, y = x) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    subtract(v) {
        return new Vec2(this.x - v.x, this.y - v.y);
    }

    scale(s) {
        return new Vec2(s * this.x, s * this.y);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    length() {
        return Math.sqrt(this.dot(this));
    }

    lengthSquared() {
        return this.dot(this);
    }

    normalize() {
        const len = this.length();
        return new Vec2(this.x / len, this.y / len);
    }

    static zero = new Vec2(0);
    static clamp(v, a, b) {
        return new Vec2(
            Math.clamp(v.x, a, b),
            Math.clamp(v.y, a, b)
        );
    }

}

Math.clamp = (x, a, b) => {
    if(x < a) return a;
    if(x > b) return b;
    return x;
}

Math.argmin = (list) => {

    let minIndex = 0;
    let minWeight = Infinity;
    for(let i = 0; i < list.length; i++) {
        if(list[i] < minWeight) {
            minWeight = list[i];
            minIndex = i;
        }
    }
    return minIndex;

}

class Graph {

    constructor(n) {
        this.n = n;
        this.vertices = {};
        this.edges = [];
        for(let i = 0; i < n; i++) {
            this.vertices[i] = [];
        }
    }

    addEdge(a, b, w) {
        const e1 = new Edge(a, b, w);
        const e2 = new Edge(b, a, w);
        this.vertices[a].push(e1);
        this.vertices[b].push(e2);
        this.edges.push(e1);
    }

}

class Edge {

    constructor(a, b, w) {
        this.a = a;
        this.b = b;
        this.w = w; 
    }

}