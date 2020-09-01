class Random {
    static insideUnitCircle() {
        const theta = Math.random() * 2 * Math.PI;
        const r = Math.sqrt(Math.random());
        return new Vec2(r * Math.cos(theta), r * Math.sin(theta));
    }
    static exponential() {
        var r = Math.random();
        return 1 - Math.exp(r) * (1 - r);
    }
    static uniform() {
        return Math.random();
    }
}