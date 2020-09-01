class DungeonGenerator {

    constructor(settings) {
        for(let key in settings) {
            this[key] = settings[key];
        }
        this.points = [];
        this.rooms = [];
        this.intersections = [];
        this.stepsToConverge = 0;
        this.converged = false;
        this.graph = new Graph(this.numberOfRooms);
    }

    generate() {
        this.generateRooms();
        this.calculateIntersections();
    }

    generateRooms() {
        const r = this.circleRadius;
        const range = this.maxRoomSize - this.minRoomSize;
        for(let i = 0; i < this.numberOfRooms; i++) {
            const p = Random.insideUnitCircle().scale(r);
            const w = Random.exponential() * range + this.minRoomSize;
            const h = Random.exponential() * range + this.minRoomSize;
            const room = new Room(p.x - w/2, p.y - h/2, w, h, this.numberOfRooms);
            this.points.push(p);
            this.rooms.push(room);
        }
    }

    calculateIntersections() {
        this.intersections = [];
        for(let i = 0; i < this.rooms.length; i++) {
            for(let j = i; j < this.rooms.length; j++) {
                if(i == j) {
                    continue;
                }

                var intersectedRect = this.rooms[i].rect.intersect(this.rooms[j].rect);
                if(intersectedRect != Rectangle.empty) {
                    this.intersections.push(intersectedRect);
                }
            }
        }
    }

    updateVelocity() {
        let intersected = false;
        for(let i = 0; i < this.rooms.length; i++) {
            for(let j = i; j < this.rooms.length; j++) {
                if(i == j) {
                    continue;
                }

                const intersectedRect = this.rooms[i].rect.intersect(this.rooms[j].rect);
                if(intersectedRect != Rectangle.empty) {
                    // Using an adjusted form of the formula for gravity to calculate
                    // the force, but is instead used to push the objects apart.
                    const room1 = this.rooms[i];
                    const room2 = this.rooms[j];
                    const m1 = room1.rect.w * room1.rect.h;
                    const m2 = room2.rect.w * room2.rect.h;
                    const r = room1.center().subtract(room2.center()).lengthSquared();
                    const G = this.gravitationalForce;
                    const fg1 = G * m1 * m2 / r;
                    const fg2 = G * m1 * m2 / r;
                    const v1 = room1.center().subtract(room2.center()).normalize();
                    const v2 = room2.center().subtract(room1.center()).normalize();
                    const maxV = this.maxVelocity;
                    room1.velocity = Vec2.clamp(v1.scale(fg1), -maxV, maxV);
                    room2.velocity = Vec2.clamp(v2.scale(fg2), -maxV, maxV);
                    const stepSize = this.velocityStepSize;
                    room1.rect.x += stepSize * room1.velocity.x;
                    room1.rect.y += stepSize * room1.velocity.y;
                    room2.rect.x += stepSize * room2.velocity.x;
                    room2.rect.y += stepSize * room2.velocity.y;
                    intersected = true;
                }
                else {
                    this.rooms[i].velocity = this.rooms[j].velocity = Vec2.zero;
                }
            }
        }

        if(intersected) {
            this.stepsToConverge++;
        }
        else {
            this.converged = true;
            console.log('Converged in ', this.stepsToConverge, ' steps.');
        }
    }

    calculateNearestNeighbours() {
        for(let i = 0; i < this.rooms.length; i++) {

            let distances = [];

            for(let j = 0; j < this.rooms.length; j++) {
                if(i == j) {
                    continue;
                }

                const d = this.rooms[i].center().subtract(this.rooms[j].center()).lengthSquared();
                distances.push([i, j, d]);
            }

            distances.sort((first, second) => {
                return first[2] - second[2];
            });

            for(let k = 0; k < this.nearestNeighbours; k++) {
                const neighbour = this.rooms[distances[k][1]];
                this.rooms[distances[k][0]].neighbours.push(neighbour);
                this.graph.addEdge(...distances[k]);
            }
        }

        console.log('Graph:', this.graph);
    }

    step() {
        this.updateVelocity();
        this.calculateIntersections();
        return this.converged;
    }

}

class Room {

    constructor(x, y, w, h) {
        this.rect = new Rectangle(x, y, w, h);
        this.velocity = new Vec2(0);
        this.neighbours = [];
    }

    center() {
        // Move to rect?
        return new Vec2(this.rect.w / 2 + this.rect.x, this.rect.h / 2 + this.rect.y);
    }

    lengthSquared() {
        // Move to rect?
        return new Vec2(this.rect.w, this.rect.h).lengthSquared();
    }

}


class DungeonDrawer {

    constructor(canvasWindow) {
        this.cw = canvasWindow;
    }

    draw(dungeon) {

        // Rooms
        for(let r of dungeon.rooms) {
            
            this.cw.stroke();
            this.cw.width(2);
            this.cw.color('rgb(200, 200, 200)');
            this.cw.rectangle(r.rect.x, r.rect.y, r.rect.w, r.rect.h);
        }

        // Line to neighbours
        for(let r of dungeon.rooms) {
            for(let neighbour of r.neighbours) {
                let a = r.center();
                let b = neighbour.center();
                this.cw.width(2);
                this.cw.color('red');
                this.cw.line(a.x, a.y, b.x, b.y);
            }
        }

        // Center room dots
        for(let r of dungeon.rooms) {
            this.cw.color('rgb(100, 100, 100)');
            this.cw.fill();
            const c = r.center();
            this.cw.circle(c.x, c.y, 3);
        }

        // Intersections
        this.cw.color('rgb(255, 40, 40)');
        this.cw.stroke();
        for(let rect of dungeon.intersections) {
            this.cw.rectangle(rect.x, rect.y, rect.w, rect.h);
        }

    }

    drawGradient(dungeon) {

        this.cw.clear();
        this.cw.fill();
        const a = 1 / 300;
        for(const room of dungeon.rooms) {
            const r = 0.5 + 0.5 * Math.cos(a * room.rect.x);
            const g = 0.5 + 0.5 * Math.cos(2 + a * room.rect.y);
            const b = 0.5 + 0.5 * Math.cos(4 + a * room.rect.x);
            this.cw.color('rgb(' + 255 * r + ', ' + 255 * g + ', ' + 255 * b + ')');
            this.cw.rectangle(room.rect.x, room.rect.y, room.rect.w, room.rect.h);
        }

    }

}