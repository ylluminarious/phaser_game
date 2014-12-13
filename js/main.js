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

var INTERVAL = 1.5;

var STOPPED = 0;
var RIGHT_VELOCITY = 300;
var LEFT_VELOCITY = -300;

var MONSTER_X_START_POS = 510;

var MONSTER_ACCELERATION_AMOUNT = 100;

var NEXT_FIRE_TIME = 0;
var FIRE_RATE = 400;

// Global variables
var background;

var wabbit;
var carrots;
var carrot;

var monsterGenerator;
var monsters;
var monster;
var firstMonsterHit;

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
    monsters.setAll("body.outOfBoundsKill", true);
	
	monsterGenerator = game.time.events.loop(Phaser.Timer.SECOND * INTERVAL, generateMonsters, this);
	monsterGenerator.timer.start();

	wabbit = game.add.sprite(WABBIT_STARTING_X_POS, WABBIT_STARTING_Y_POS, "wabbit");
	game.physics.arcade.enable(wabbit);
	wabbit.body.gravity.y = WABBIT_GRAVITY;
	wabbit.body.collideWorldBounds = true;
	wabbit.body.bounce.y = WABBIT_BOUNCE;

	carrots = game.add.group();
	carrots.enableBody = true;
	carrots.physicsBodyType = Phaser.Physics.ARCADE;
    carrots.setAll("body.immovable", true);
	carrots.setAll("body.outOfBoundsKill", true);
}

function update () {
    game.physics.arcade.collide(carrots, monsters, killMonster);
    
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

function generateMonsters () {
	monster = monsters.create(MONSTER_X_START_POS, game.world.randomY, "invader");
    monsters.forEachAlive(gravitateToPlayer, this);
}

function gravitateToPlayer (monster) {
    game.physics.arcade.accelerateToObject(monster, wabbit, MONSTER_ACCELERATION_AMOUNT);
}

function killMonster () {
    firstMonsterHit = monsters.getFirstExists(true);
    firstMonsterHit.kill();
}