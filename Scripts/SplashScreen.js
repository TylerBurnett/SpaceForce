class SplashScreen {
    constructor(CanvasX, CanvasY) {

        this.CanvasX = CanvasX;
        this.CanvasY = CanvasY;

        // the advertisement
        this.Ad;
        this.loadVideo();

        // Timer for the video
        this.FrameCount = 0;

        this.Playing = false;

        // Text animation object, used to make the text pulse.
        this.textAnim = {
            direction: 3,
            opacity: 0
        };
    }

    draw() {
        if (this.Playing == false) {
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

        } else {
            if (this.FrameCount == 500) {
                this.FrameCount = 0;
                this.Playing = false;
                this.Ad.remove();
                ChangeState(this, "Start Game");
            }
            fill(255);
            textAlign(CENTER);
            textSize(60);
            text("Sponsored message", this.CanvasX / 2, 140);
            this.FrameCount++;
        }
    }


    // If the client presses any key, move to the game state.
    keyPressed() {
        if (this.Playing == false) {
            this.Playing = true;
            this.Ad.show();
            this.Ad.play();
        }
    }

    loadVideo() {
        this.Ad = createVideo("SpaceForce/Resources/Video/5-Gum.mp4");
        this.Ad.position(100, 150);
        this.Ad.size(this.CanvasX - 200, this.CanvasY - 200);
        this.Ad.hide();
    }
}