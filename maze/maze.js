
var ctx, cols, rows, w=20, mazeSize=400;
var grid= [];
var current;
var stack= [];
var player;
var keepTraceMark= false, won= false;
var showAllGrid= true, showFruits=false, lightWidth=5, lightOpaciry=255, totalMaps=0;
var showCreatMaze= false;
var timeStart=0, timeNow=0, winTime=0;
var drone;

function setup() {
	ctx= createCanvas(mazeSize,mazeSize + 100);
	cols=Math.floor(mazeSize/w);
	rows=Math.floor(mazeSize/w);
	for(j=0; j<rows; j++) {
		for(i=0; i<cols; i++) {
			var cell= new Cell(i,j);
			grid.push(cell);
		}
	}
	current= grid[0];
	player= new bot(cols-1, rows-1);

	//frameRate(.5);
}

function draw() {
	background(30);

		for(var i=0; i<grid.length; i++) {
			grid[i].show();
		}

		if(!showAllGrid) {
			hideOtherGrids(lightWidth);
		}

	player.show();

	if(player.hasFruit()) {
		player.eatFruit();
	}

	if(player.hasMap()) {
		totalMaps++;
	}

	if(lightWidth>5) {
		lightWidth-=.008;
	}
	else if(lightWidth<5) {
		lightWidth+=.005;
	}
	if(lightOpaciry<255) {
		lightOpaciry+=.5;
	}

	if(!showCreatMaze) {
		makeMaze();
		showCreatMaze= true;
	}

	if(timeStart>0)
		timeNow= Math.floor((millis()-timeStart)/1000);
	drawExtra();





	if(current) {

		current.visited= true;
		current.highLight();
		var next= current.cheakNeighbors();
		if(next) {
			next.visited= true;

			stack.push(current);

			removeWall(current, next);

			current= next;
		}
		else if(stack.length>0){
			var cell= stack.pop();
			current= cell;
		}
		else {
			current= null;
			next= null;
			showAllGrid= false;
			showFruits= true;
			lightWidth=6;
		}
	}
}

function makeMaze() {
	while(current) {

		current.visited= true;
		var next= current.cheakNeighbors();
		if(next) {
			next.visited= true;

			stack.push(current);

			removeWall(current, next);

			current= next;
		}
		else if(stack.length>0){
			var cell= stack.pop();
			current= cell;
		}
		else {
			current= null;
			next= null;
			showAllGrid= false;
			showFruits= true;
			lightWidth=6;
		}
	}
}

function keyPressed() {

	if(won) {
		return ;
	}
	else {
		if(timeStart==0) {
			timeStart= millis();
		}
	}

	if(keyCode==38) { //code for 'arrow_up'
		player.moveUp();
	}
	else if(keyCode==39) { //code for 'arrow_right'
		player.moveRight();
	}
	else if(keyCode==40) { //code for 'arrow_down'
		player.moveDown();
	}
	else if(keyCode==37) { //code for 'arrow_left'
		player.moveLeft();
	}	
}


function drawExtra() {
	strokeWeight(2);
	stroke(255);
	fill('#1a1a1a');
	rect(0, mazeSize,mazeSize,100);
	strokeWeight(2);
	stroke(200,400,200);
	//line(400, 0, 400, 400);

	stroke(255);
	if(!won) {
		line(4, 4, w-4, w-4);
		line(w-4, 4, 4, w-4);
	}

	textStyle(BOLD);
	textAlign(CENTER);
	strokeWeight(0);
	stroke(255);
	fill(255);
	textSize(18);
	text("GEMATRIA", mazeSize/2, 420);
	text("maze", mazeSize/2, 435);
	textAlign(LEFT);
	textSize(12);
	text("Steps- "+player.totalSteps, 0, mazeSize + 60);
	text("Time- "+timeNow+"s" , 70, mazeSize + 60);
	text("Maps- "+totalMaps, 150, mazeSize + 60);
	
	if(won) {
		textSize(20);
		textAlign(CENTER);
		var score=Math.floor((cols+1) * (rows+1)-player.totalSteps-winTime +(40*totalMaps));
		text("YOU OWN\nscore- "+score, mazeSize/2, mazeSize/2);
		score++;

	}
	if(player.hero) {
		textAlign(CENTER);
		textSize(14);
		fill(250,150,150);
		text("SuperHero", mazeSize+50, 60);
	}
}

function Cell(i, j ) {
	this.i=i;
	this.j=j;
	var x=this.i*w;
	var y=this.j*w;
	this.walls=[true, true, true, true];
	this.visited=false;

	this.walked= false;
	this.hasFruit= 0;
	this.hasMap= false;

	var r= Math.floor(random(60))
	if(r<5 && (i!=0 || j!=0)) {
		if(r==4) {
			this.hasFruit= 2;
		}
		else if(r==2 || r==3) {
			this.hasFruit= 1;
		}
		else {
			this.hasFruit= -1;
		}
	}
	else {
		if(random(100)<1)
			if(this.i!=0 || this.j!=0)
				if(this.i!=cols-1 || this.j!=rows-1)
					this.hasMap= true;
	}


	this.show= function() {
		stroke(255);
		if(this.walls[0])
			line(x, y, x+w, y);
		if(this.walls[1])
			line(x+w, y, x+w, y+w);
		if(this.walls[2])
			line(x+w, y+w, x, y+w);
		if(this.walls[3])
			line(x, y+w, x, y);

		if(this.visited) {
			noStroke();
			//fill(250, 50, 150, 100);
			fill(94, 115, 190, 10);
			rect(x, y, w, w );
			if(this.walked) {
				fill(150, 150, 150, 70);
				rect(x+7, y+7, w-14, w-14);
				fill(54, 75, 150, 10);
			}
		}
		if(showFruits && this.hasFruit==2) {
			fill(124, 228, 255, 255);
			ellipse(x+w/2, y+w/2, 5, 5);
		}
		else if(showFruits && this.hasFruit==1) {
			fill(255, 240, 86, 255);
			ellipse(x+w/2, y+w/2, 5, 5);
		}
		else if(showFruits && this.hasFruit==-1) {
			fill(255, 86, 86, 255);
			ellipse(x+w/2, y+w/2, 5, 5);
		}
		else if(showFruits && this.hasMap) {
			fill(255, 255, 255, 255);
			push();
			rectMode(CENTER);
			translate(x+w/2, y+w/2);
			rotate(PI/4);
			rect(0, 0, w-14, w-14);
			pop();
		}
	}


	this.cheakNeighbors= function() {
		var neighbors= [];

		var top= grid[index(i, j-1)];
		var right= grid[index(i+1, j)];
		var bottom= grid[index(i, j+1)];
		var left= grid[index(i-1, j)];

		if(top && !top.visited) {
			neighbors.push(top);
		}
		if(right && !right.visited) {
			neighbors.push(right);
		}
		if(bottom && !bottom.visited) {
			neighbors.push(bottom);
		}
		if(left && !left.visited) {
			neighbors.push(left);
		}

		if(neighbors.length>0){
			var r= Math.floor(random(0, neighbors.length));
			return neighbors[r];
		}
		else {
			return undefined;
		}

	}
}

function index(i, j) {
	if(i<0 || j<0 || i>cols-1 || j>rows-1)
		return -1;
	return i+(j*cols);
}

function removeWall(c, n) {
	var t1= c.i-n.i;
	//console.log(c);
	if(t1=== 1) {
		c.walls[3]= false;
		n.walls[1]= false;
	}
	else if(t1=== -1) {
		c.walls[1]= false;
		n.walls[3]= false;
	}
	var t2= c.j-n.j;
	if(t2=== 1) {
		c.walls[0]= false;
		n.walls[2]= false;
	}
	else if(t2=== -1) {
		c.walls[2]= false;
		n.walls[0]= false;
	}
}




function bot(x, y) {
	this.x=x;
	this.y=y;
	this.totalSteps=0;

	this.hero= false;
	this.heroGlow=0;

	this.moveRight= function() {
		if(!grid[index(this.x, this.y)].walls[1]){
			this.x++;
			this.totalSteps++;
			this.cheakWin();
			return true;
		}
		else if(this.hero && this.x<(rows-1)) {
			grid[index(this.x, this.y)].walls[1]= false;
			grid[index(this.x+1, this.y)].walls[3]= false;
			this.x++;
			this.totalSteps++;
			this.cheakWin();
			return true;
		}
		return false;
	}
	this.moveLeft= function() {
		if(!grid[index(this.x, this.y)].walls[3]) {
			this.x--;
			this.totalSteps++;
			this.cheakWin();
			return true;
		}
		else if(this.hero && this.x>0) {
			grid[index(this.x, this.y)].walls[3]= false;
			grid[index(this.x-1, this.y)].walls[1]= false;
			this.x--;
			this.totalSteps++;
			this.cheakWin();
			return true;
		}
		return false;
	}
	this.moveUp= function() {
		if(!grid[index(this.x, this.y)].walls[0]) {
			this.y--;
			this.totalSteps++;
			this.cheakWin();
			return true;
		}
		else if(this.hero && this.y>0) {
			grid[index(this.x, this.y)].walls[0]= false;
			grid[index(this.x, this.y-1)].walls[2]= false;
			this.y--;
			this.totalSteps++;
			this.cheakWin();
			return true;
		}
		return false;
	}
	this.moveDown= function() {
		if(!grid[index(this.x, this.y)].walls[2]) {
			this.y++;
			this.totalSteps++;
			this.cheakWin();
			return true;
		}
		else if(this.hero && this.y<(cols-1)) {
			grid[index(this.x, this.y)].walls[2]= false;
			grid[index(this.x, this.y+1)].walls[0]= false;
			this.y++;
			this.totalSteps++;
			this.cheakWin();
			return true;
		}
		return false;
	}

	this.hasFruit= function() {
		if(grid[index(this.x, this.y)].hasFruit==0)
			return false;
		else
			return true;
	}

	this.eatFruit= function() {
		lightWidth+=grid[index(this.x, this.y)].hasFruit;
		grid[index(this.x, this.y)].hasFruit=0;
	}

	this.hasMap= function() {
		if(grid[index(this.x, this.y)].hasMap) {

			grid[index(this.x, this.y)].hasMap= false;
			return true;
		}
		return false;
	}

	this.show= function() {
		if(this.hero) {
			strokeWeight(this.heroGlow%25-10);
			this.heroGlow++;
			stroke(104, 252, 255, 100);
			fill(255, 255, 255, 0);
			ellipse((w*this.x)+w/2, (w*this.y)+w/2, w/2, w/2);
		}

		noStroke();
		fill(255, 255, 255, 200);
		rect((w*this.x)+5, (w*this.y)+5, w-10, w-10);

		if(keepTraceMark) {
			grid[index(this.x, this.y)].walked= true;
		}
	}

	this.cheakWin= function() {
		if(this.x==0 && this.y==0) {
			console.log("won");
			won= true;
			winTime= timeNow;
			timeStart= 0;
			return true;
		}
		won= false;
		return false;
	}

}

function hideOtherGrids(n) {
	var cx= (w*player.x)+(w/2);
	var cy= (w*player.y)+(w/2);
	var toHide=10000;
	strokeWeight(toHide);
	stroke(99, 51, 51, Math.ceil(lightOpaciry));
	fill(0, 0, 0, 0);
	ellipse(cx, cy, toHide+n*w, toHide+n*w);
}
