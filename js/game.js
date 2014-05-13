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
heroImage.src = "img/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "img/monster.png";

// Game objects
var hero = {
    speed: 256 // movement in pixels per second
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

// Update game objects
var update = function (modifier) {
    if (38 in keysDown) { // Player holding up
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown) { // Player holding down
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown) { // Player holding left
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown) { // Player holding right
        hero.x += hero.speed * modifier;
    }

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
        ctx.drawImage(heroImage, hero.x, hero.y);
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

    update(delta / 1000);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();

    then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 33.33); // Execute as fast as possible
