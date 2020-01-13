var Sprite = function(sourceX,sourceY,width,height,x,y){
	this.sourceX = sourceX;
	this.sourceY = sourceY;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.vx = 5;
	this.vy = 0;
	this.status = "VISIBLE";
	this.type = "STATIC";
	this.move = "STOP";
	this.quantCollide = 0;
}

Sprite.prototype.centerX = function(){
	return this.x + (this.width/2);
}

Sprite.prototype.centerY = function(){
	return this.y + (this.height/2);
}

Sprite.prototype.halfWidth = function(){
	return this.width/2;
}

Sprite.prototype.halfHeight = function(){
	return this.height/2;
}
//classe alien(inimigo);
var Alien = function(sourceX,sourceY,width,height,x,y){
	//comando que significa que eu estou passando para esta classe as variáveis de instância da classe Sprite
	Sprite.call(this, sourceX,sourceY,width,height,x,y);
	this.NORMAL = 1;
	this.EXPLODED = 2;
	this.CRAZY = 3;
	this.state = this.NORMAL;
	this.mvStyle = this.NORMAL;
}
//passando todos os métodos da classe Sprite para esta classe
Alien.prototype = Object.create(Sprite.prototype);

Alien.prototype.explode = function(){
	this.sourceX = 110;
	this.width = 70;
	this.height = 55;
}

//classe muro

var SpriteDynamic =  function(sourceX ,sourceY ,width ,height ,x ,y) {
	Sprite.call( this, sourceX ,sourceY ,width ,height ,x ,y );
	this.type = "DYNAMICBACKGROUND";
	this.moreOrLess = 1;
	this.animation = false;
}
SpriteDynamic.prototype = Object.create(Sprite.prototype);


