// Global constants
var GAME_WIDTH = 600;
var GAME_HEIGHT = 500;
var ORIGIN = 0;

var BACKGROUND_SCALE_FACTOR_X = 1.2;
var BACKGROUND_SCALE_FACTOR_Y = 1;

var WABBIT_STARTING_X_POS = 100;
var WABBIT_STARTING_Y_POS = 100;
var WABBIT_GRAVITY = 300;
var WABBIT_BOUNCE = 1;

var STOPPED = 0;
var RIGHT_VELOCITY = 300;
var LEFT_VELOCITY = -300

var NEXT_FIRE_TIME = 0;
var FIRE_RATE = 400;

// Global variables
var background;
var wabbit;
var carrots;
var carrot;
var timer;
var monsters;

var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, "game", {preload: preload, create: create, update: update});

function preload () {
	game.load.image("space", "sprites/deep-space.jpg");
	game.load.image("wabbit", "sprites/wabbit.png");
	game.load.image("carrot", "sprites/carrot.png");

	game.load.image("invader", "sprites/invader.png");
	game.load.image("purple invader", "sprites/purple_invader.png");
	game.load.image("maggot", "sprites/maggot.png");
	game.load.image("boss 1", "sprites/boss1.png");
}

function create () {
	background = game.add.image(ORIGIN, ORIGIN, "space");
	background.scale.setTo(BACKGROUND_SCALE_FACTOR_X, BACKGROUND_SCALE_FACTOR_Y);

	monsters = game.add.group();
	monsters.enableBody = true;
	monsters.physicsBodyType = Phaser.Physics.ARCADE;
	

	timer = new Phaser.Timer(game);
	game.time.events.loop(Phaser.Timer.SECOND * 2.5, createMonster, this);
	timer.start();

	wabbit = game.add.sprite(WABBIT_STARTING_X_POS, WABBIT_STARTING_Y_POS, "wabbit");
	game.physics.arcade.enable(wabbit);
	wabbit.body.gravity.y = WABBIT_GRAVITY;
	wabbit.body.collideWorldBounds = true;
	wabbit.body.bounce.y = WABBIT_BOUNCE;

	carrots = game.add.group();
	carrots.enableBody = true;
	carrots.physicsBodyType = Phaser.Physics.ARCADE;
	carrots.setAll("checkWorldBounds", true);
	carrots.setAll("outOfBoundsKill", true);
}

function update () {
	wabbit.body.velocity.x = STOPPED;

	if (wabbit.body.onFloor()) {
		wabbit.body.bounce.y = WABBIT_BOUNCE;
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
		shoot();
		
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.D)) {
		wabbit.body.velocity.x = RIGHT_VELOCITY;
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || game.input.keyboard.isDown(Phaser.Keyboard.A)) {
		wabbit.body.velocity.x = LEFT_VELOCITY;
	}
}

function shoot () {
	if (game.time.now > NEXT_FIRE_TIME) {
		NEXT_FIRE_TIME = game.time.now + FIRE_RATE;
		carrot = carrots.create(wabbit.x, wabbit.y, "carrot");
	}
	carrot.body.velocity.x = RIGHT_VELOCITY;
}

function createMonster () {
	monsters.create(510, game.world.randomY, "invader");
	monsters.setAll("body.velocity.x", -100);
}