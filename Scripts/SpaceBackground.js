class SpaceBackground {
    constructor(CanvasX, CanvasY, Amount) {
        this.CanvasX = CanvasX;
        this.CanvasY = CanvasY;

        // The array for stars
        this.SpaceArray = [];

        // Randomly generate star locations and sizes in object creation.
        for (let star = 0; star <= Amount; star++)
            this.SpaceArray.push({
                X: random(CanvasX),
                Y: random(CanvasY),
                size: random(10)
            });
    }

    // Main draw function
    draw() {

        noStroke();
        fill(255);

        for (let star of this.SpaceArray) {

            // Draw
            circle(star.X, star.Y, star.size);

            // If this particular star is outside of the screen, wrap it around to the top.
            if (star.Y > this.CanvasY) star.Y = 0;

            // Move the star down the screen.
            star.Y += 0.5;
        }

    }
}