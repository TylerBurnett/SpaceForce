class ScoreState {
    constructor(canvasX, canvasY, fileLocation, score) {

        // Rendering vars
        this.canvasX = canvasX;
        this.canvasY = canvasY;

        this.fileLocation = fileLocation;
        this.scoreFile = loadJSON(fileLocation);

        // Score variables
        this.score = score;

        // DOM inputs should only be drawn once, hence they are called in the constructor

        // Playername input
        this.Input_Name = createInput();
        this.Input_Name.position(150, 150);

        // addScore button
        this.Btn_addScore = createButton('Add highscore!');
        this.Btn_addScore.position(150, 180);
        this.Btn_addScore.mousePressed(this.add.bind(this));

        // saveScore button
        this.Btn_saveScore = createButton('Save Scores');
        this.Btn_saveScore.position(260, canvasY - 130);
        this.Btn_saveScore.mousePressed(this.save.bind(this));

        // Reset button
        this.Btn_Reset = createButton('Play Again');
        this.Btn_Reset.position(150, canvasY - 130);
        this.Btn_Reset.mousePressed(this.playAgain.bind(this));

        // backToMenu button
        this.Btn_backToMenu = createButton('Back to menu');
        this.Btn_backToMenu.position(380, canvasY - 130);
        this.Btn_backToMenu.mousePressed(this.backToMenu.bind(this));
    }

    // Main draw function
    draw() {
        // Transparent window
        fill(100, 100);
        rect(100, 100, this.canvasX - 200, this.canvasY - 200);

        // Text headings
        fill(255);
        textSize(20);
        text('Enter  Name', 145, 130)
        text("Player", 150, 230);
        text("Date", 250, 230);
        text("Score", 450, 230);

        // Data table
        for (let item in this.scoreFile['Scores']) {

            // if the the listings go off the page, dont render them.
            if ((20 * item) + 250 < this.canvasY - 130) {

                textSize(15);
                text(this.scoreFile['Scores'][item].name, 150, 250 + (20 * item));
                text(this.scoreFile['Scores'][item].date, 250, 250 + (20 * item));
                text(this.scoreFile['Scores'][item].score, 450, 250 + (20 * item));
            }

        }
    }

    // Adds the players score to the table, with the other required data
    add() {
        let date = day() + "  " + month() + "  " + year();

        this.scoreFile['Scores'].push({
            name: this.Input_Name.value(),
            date: date,
            score: this.score
        });
    }

    // Saves the JSON file to the clients directory
    save() {
        saveJSON(this.scoreFile, this.fileLocation);
    }

    // Resets the object, removes DOM inputs
    reset() {
        removeElements();
    }

    backToMenu() {
        ChangeState(this, "Back to menu");
    }

    playAgain() {
        this.reset();
        ChangeState(this, "Start Game");
    }
}