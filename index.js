var keypress = require('keypress');
const colors = require("colors");
const setTitle = require('node-bash-title');
var align = require('align-text');

setTitle('Node.js Game');


var width = process.stdout.columns;
var height = process.stdout.rows;
var FrameRate = 999
var pause = false
var inputtext = "";

var icons = ["#","@"]
var goalPos = [Math.floor(Math.random()*width),Math.floor(Math.random()*height-3)]
var goalY = false;
var goalX = false;

keypress(process.stdin);

setup();


class Player{
	constructor(x,y,c){
		this.x = x;
		this.y = y;
		this.c = c;
	}

	draw(){
		let text = "";
		let spaces = "";
		for( let i = 0;i<this.y;i++ ){

			if(i == goalPos[1]){
				goalY  = true;
			}

			text += "\n";
			for( let i = 0;i<this.x-1;i++ ){
				if(i == goalPos[0] && goalY){
					text+="@"
				}
				text += " ";
			}
		}
		
		
		if(icons[0][this.c]){ text += icons[0][this.c] }else{ text += icons[0]["white"] }
		
		
		for( let b = 0; b <= height-4-this.y;b++ ){
			if(b==height-4-this.y){
				text+="X: ".green+String(Math.floor(this.x)).green+" Y: ".green+String(this.y).green;
				text+=" "+` Apple at: ${String(goalPos)} `.bgYellow.black;
				text+=" Command: "+inputtext;
			}else{
				text+="\n"
			}
		}
		console.log(text);
	}
}

var plr = new Player(width/2,1);
var width=process.stdout.columns;
var height=process.stdout.rows;
var points = 0;
var cols = ["blue","red","yellow","green"]

function setup(){
	setInterval(()=>{
		plr.c = cols[Math.floor(Math.random() * cols.length)];
	}, 500)
}


function draw(){
	console.clear();
	console.log(align("\nPoints: ".yellow + String(points).green,(width/2)-(("Points: "+String(points)).length/2)))
	plr.draw();
	if(goalPos[0] == Math.floor(plr.x) && goalPos[1] == Math.floor(plr.y)){
		points++;
		goalPos = [Math.floor(Math.random()*width),Math.floor(Math.random()*height-3)];
		goalY = false;
		goalX = false;
	}
}

	var cheats = {
		"window_title": false,
		"plr_set_position": false,
		"plr_auto_collect": false,
		"apple_set_position": false
	}

function runInput(){
	if( inputtext == "game_reset" || inputtext == "game_restart" ){
		points = 0;
		plr.x = 2;
		plr.y = 2;
	}
	else if ( inputtext == "game_exit" ){
		console.clear();
		console.log("Exit.".red)
		process.exit();
	}
	else if ( inputtext == "game_pause" ){
		pause=!pause;if(pause){setTitle("Node.js Game | PAUSED")}else{setTitle("Node.js Game")}
	}
	else if ( inputtext.startsWith("game_cheatcode_") ){
		let cc = inputtext.split("game_cheatcode_")[1];
		if(cc==String.fromCharCode(119 ,105 ,110 ,100 ,111 ,119 ,110 ,97 ,109 ,101 ,120 ,100 ,32)){
			if(!cheats["window_title"]){
				cheats["window_title"] = true;
				setTitle("!CHEATCODE ACTIVATED!");
				setTimeout(()=>{setTitle("Node.js Game")}, 3000)
			}
		}else if(cc=String.fromCharCode(109, 105 ,110 ,101 ,114)){
			if(!cheats["plr_auto_collect"]){
				cheats["plr_auto_collect"] = true;
				setTitle("!CHEATCODE ACTIVATED!")
				setTimeout(()=>{setTitle("Node.js Game")}, 3000)
			}
		}
	}
	// CHEAT COMMANDS
	else if( inputtext.startsWith("window_title_") ){
			if(cheats["window_title"]){
				let title = inputtext.split("window_title_")[1];
				setTitle(title)
			}
	}



	inputtext = "";
}

process.stdin.on('keypress', function (ch, key) {
  	if(key){
		if(key.name=="p"&&key.ctrl){pause=!pause;if(pause){setTitle("Node.js Game | PAUSED")}else{setTitle("Node.js Game")}}
		else if(key.name=="q"&&key.ctrl){console.clear();console.log("Ctrl+q:\tExit".red);process.stdin.pause();process.exit()}
		
		else if(!pause){
			if(key.code == "[A"){
				if(plr.y>1){plr.y-=1;}
				if(goalPos[0] == plr.x){
					points+=1;
					goalPos = [Math.floor(Math.random()*width),Math.floor(Math.random()*height)];
				}
			}
			else if(key.code == "[B"){
				if(plr.y<height-5){plr.y-=-1}
				if(goalPos[0] == plr.x && goalPos[1] == plr.y){
					points++;
					goalPos = [Math.floor(Math.random()*width),Math.floor(Math.random()*height)];
				}
			}
			else if(key.code == "[C"){
				if(plr.x<width-4){plr.x+=1}
				if(goalPos[0] == plr.x && goalPos[1] == plr.y){
					points++;
					goalPos = [Math.floor(Math.random()*width),Math.floor(Math.random()*height)];
				}
			}
			else if(key.code == "[D"){
				if(plr.x>2){plr.x-=1}
				if(goalPos[0] == plr.x && goalPos[1] == plr.y){
					points++;
					goalPos = [Math.floor(Math.random()*width),Math.floor(Math.random()*height)];
				}
			}
			else if(key.name == "r" && key.ctrl){inputtext = ""}
			else if(key.name=="space"){inputtext+="_"}
			else if(key.name=="backspace"){inputtext=inputtext.slice(0,-1)}
			else if(key.name=="return"){runInput()}
			else{
				inputtext += key.name;
			}
			
		}
	}
});
 
setInterval(()=>{if(!pause){draw()}}, 1000/FrameRate)

// Apple Check


process.stdin.setRawMode(true);
process.stdin.resume();
