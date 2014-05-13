// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var $window = $( window );
var canvasWidth = $window.width();
var canvasHeight = $window.height();
canvas.width = canvasWidth;
canvas.height = canvasHeight;
document.body.appendChild(canvas);

//Hit count
hitCount = 0;

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "img/spaceship.png";

// Game objects
var hero = {
    speed: 500 // movement in pixels per second
};

var asteroidSpeed = 256;
var asteroids = [];
var asteroidImages = [
    new Image(),
    new Image(),
    new Image()
];

var asteroidDimensions = [ [ 32, 32 ], [ 56, 60 ], [ 32, 32 ] ];

asteroid1Ready = false;
asteroid2Ready = false;
asteroid3Ready = false;

asteroidImages[0].onload = function () { asteroid1Ready = true; }
asteroidImages[1].onload = function () { asteroid2Ready = true; }
asteroidImages[2].onload = function () { asteroid3Ready = true; }

asteroidImages[0].src = "img/asteroid1.png";
asteroidImages[1].src = "img/asteroid2.png";
asteroidImages[2].src = "img/asteroid3.png";

// Handle keyboard controls
var keysDown = {};
var mouse = { x: 0, y: 0};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

addEventListener("mousemove", function(e) {
    mouse.x = e.pageX - $(canvas).offset().left;
    mouse.y = e.pageY - $(canvas).offset().top;
}, false);

var reset = function () {
    hero.x = canvas.width / 2 - 16;
    hero.y = canvas.height - 64;

    asteroids = [];

    for ( var i = 0; i < 600; i++ ) {
        var index = Math.floor( ( Math.random() * 10 ) % 3 );
        asteroids.push({
            x: Math.random() * canvas.width,
            y: 0 - ( Math.random() * canvas.height * 20 ),
            image: asteroidImages[index],
            width: asteroidDimensions[index][0],
            height: asteroidDimensions[index][1]
        });
    }
};

var angle = function ( v1, v2 ) {
    var dy = v2.y - v1.y,
    dx = v2.x - v1.x,
    theta = Math.atan2( dy, dx );

    return theta * ( 180 / Math.PI );
};

var angleMag2Vector = function ( angle, mag ) {
    angle *= Math.PI / 180;
    return { x: mag * Math.cos( angle ), y: mag * Math.sin( angle ) };
};

// Update game objects
var update = function (modifier) {
    var vel = angleMag2Vector( angle( hero, mouse ), hero.speed );

    if ( Math.abs( hero.y - mouse.y ) > 10 ) {
        hero.y += vel.y * modifier;
    }
    if ( Math.abs( hero.x - mouse.x ) > 10 ) {
        hero.x += vel.x * modifier;
    }

    if ( hero.x < 0 ) {
      hero.x = 0;
    }
    if ( hero.x > canvasWidth - 32 ) {
      hero.x = canvasWidth - 32;
    }
    if ( hero.y < 0 ) {
      hero.y = 0;
    }
    if ( hero.y > canvasHeight - 32 ) {
      hero.y = canvasHeight - 32;
    }

    for ( var i = 0, len = asteroids.length; i < len; i++ ) {
        var ast = asteroids[i];

        ast.y += asteroidSpeed * modifier

        if (
            hero.x <= (ast.x + 32)
                && ast.x <= (hero.x + ast.width)
            && hero.y <= (ast.y + 32)
            && ast.y <= (hero.y + ast.height)
        ) {
            hitCount++;
            reset();
        }
    }

    // Are they touching?
    if ( false ) {
        reset();
    }
};

// Draw everything
var render = function () {
    ctx.fillStyle = '#011';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (asteroid1Ready && asteroid2Ready && asteroid3Ready) {
        for ( var i = 0, len = asteroids.length; i < len; i++ ) {
            var ast = asteroids[i];
            ctx.drawImage( ast.image, ast.x, ast.y );
        }
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "22px 'Ubuntu Mono'";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("YOU'VE BEEN HIT " + hitCount + " TIMES", 32, 32);
};

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;
};

var start = document.getElementById('start');
var then;
start.addEventListener( 'click', function ( e ) {
    e.preventDefault();
    // Let's play this game!
    reset();
    then = Date.now();
    setInterval(main, 33.33); // Execute as fast as possible
    this.style.display = 'none';
}, false);
