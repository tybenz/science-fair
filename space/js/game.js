// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
canvas.style.background = 'url(img/bg)';
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
var ptrn;
bgImage.onload = function () {
    bgReady = true;
    ptrn = ctx.createPattern(bgImage, 'repeat'); // Create a pattern with this image, and set it to "repeat".
};
bgImage.src = "img/bg.png";

// Tree image
var treeReady = false;
var treeImage = new Image();
treeImage.onload = function () {
  treeReady = true;
};
treeImage.src = "img/tree.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "img/hero_sheet.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "img/monster2.png";

// Game objects
var hero = {
    x: 0,
    y: 0,
    width: 32,
    height: 32,
    speed: 200,
    direction: {
        x: 0,
        y: 0
    },
    // Animation settings
    animSet: 4,
    animFrame: 0,
    animNumFrames: 2,
    animDelay: 200,
    animTimer: 0
};
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    // Throw the monster somewhere on the screen randomly
    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
};

var handleInput = function () {

    // Stop moving the hero
    hero.direction.x = 0;
    hero.direction.y = 0;

    if (37 in keysDown) { // Left
        hero.direction.x = -1;
    }

    if (38 in keysDown) { // Up
        hero.direction.y = -1;
    }

    if (39 in keysDown) { // Right
        hero.direction.x = 1;
    }

    if (40 in keysDown) { // Down
        hero.direction.y = 1;
    }

};

// Update game objects
var update = function (elapsed) {
    var modifier = elapsed / 1000;

    // Update hero animation
    hero.animTimer += elapsed;
    if (hero.animTimer >= hero.animDelay) {
        // Enough time has passed to update the animation frame
        hero.animTimer = 0; // Reset the animation timer
        ++hero.animFrame;
        if (hero.animFrame >= hero.animNumFrames) {
            // We've reached the end of the animation frames; rewind
            hero.animFrame = 0;
        }
    }

    // Update hero animation direction
    var d = hero.direction;
    if (d.x == 0 && d.y == -1) {
        hero.animSet = 0;
    } else if (d.x == 1 && d.y == -1) {
        hero.animSet = 1;
    } else if (d.x == 1 && d.y == 0) {
        hero.animSet = 2;
    } else if (d.x == 1 && d.y == 1) {
        hero.animSet = 3;
    } else if (d.x == 0 && d.y == 1) {
        hero.animSet = 4;
    } else if (d.x == -1 && d.y == 1) {
        hero.animSet = 5;
    } else if (d.x == -1 && d.y == 0) {
        hero.animSet = 6;
    } else if (d.x == -1 && d.y == -1) {
        hero.animSet = 7;
    }

    // Move the hero
    var move = (hero.speed * (elapsed / 1000));
    hero.x += Math.round(move * hero.direction.x);
    hero.y += Math.round(move * hero.direction.y);

    // Are they touching?
    if (
        hero.x <= (monster.x + 32)
            && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        ++monstersCaught;
        reset();
    }
};

// Draw everything
var render = function () {
    if (bgReady && treeReady) {
        // ctx.drawImage(bgImage, 0, 0);
        ctx.fillStyle = ptrn;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        var width = window.innerWidth;
        var height = window.innerHeight;
        var treeWidth = Math.floor(width/32);
        var treeHeight = Math.floor(height/32);
        var xOffset = (width-treeWidth*32)/2;
        var yOffset = (height-treeHeight*32)/2;

        for ( var i = 0; i < treeWidth; i++ ) {
          ctx.drawImage(treeImage, xOffset + i * 32, yOffset);
        }

        for ( var i = 0; i < treeWidth; i++ ) {
          ctx.drawImage(treeImage, xOffset + i * 32, yOffset + (treeHeight - 1) * 32);
        }

        for ( var i = 1; i < treeHeight - 1; i++ ) {
          ctx.drawImage(treeImage, xOffset, yOffset + i * 32);
        }

        for ( var i = 1; i < treeHeight - 1; i++ ) {
          ctx.drawImage(treeImage, xOffset + (treeWidth - 1) * 32, yOffset + i * 32);
        }
    }

    if (heroReady) {
        // Determine which part of the sprite sheet to draw from
        var spriteX = (
                (hero.animSet * (hero.width * hero.animNumFrames)) +
                (hero.animFrame * hero.width)
                );

        // Render image to canvas
        ctx.drawImage(
                heroImage,
                spriteX, 0, hero.width, hero.height,
                hero.x, hero.y, hero.width, hero.height
                );
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    // Score
    ctx.fillStyle = 'black';
    ctx.fillRect(50, 50, 230, 50);
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "22px 'Ubuntu Mono'";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("GOBLINS CAUGHT: " + monstersCaught, 64, 64);
};

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    handleInput();
    update(delta);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();

    then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 33.33); // Execute as fast as possible
