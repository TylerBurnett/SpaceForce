class SplashScreen {
    constructor(CanvasX, CanvasY) {

        this.CanvasX = CanvasX;
        this.CanvasY = CanvasY;

        // Text animation object, used to make the text pulse.
        this.textAnim = {
            direction: 3,
            opacity: 0
        };
    }

    draw() {
        // Panel
        noStroke();
        fill(100, 100);
        rect(100, 100, this.CanvasX - 200, this.CanvasY - 200);

        // Game title
        fill(255);
        textAlign(CENTER);
        textSize(60);
        text("Space Force", this.CanvasX / 2, 190);

        // Key press queue
        fill(255, this.textAnim.opacity);
        textSize(40);
        text("Press any key to start", this.CanvasX / 2, this.CanvasY - 200);

        // Text opacity flashing animation
        // If the opacity is at the lowest or highest
        if (this.textAnim.opacity > 255 || this.textAnim.opacity < 0)
            // Reverse the direction
            this.textAnim.direction = -this.textAnim.direction;

        // Then manipulate the opacity based on the direction
        this.textAnim.opacity += this.textAnim.direction;
    }

    // If the client presses any key, move to the game state.
    keyPressed() {
        ChangeState(this, "Start Game");
    }
}