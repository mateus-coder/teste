function funcaoGame(){
	var tela = document.getElementById('jogo');
	var row1 = document.getElementById('pontuacao');
	var row2 = document.getElementById('gameover');
	var content = "";
	for(var i = 0; i < 50; i++){
		content += `	<div class="indice">

						</div>`;
	}

	row1.innerHTML = content;
	row2.innerHTML = content;
	tela.style.display = 'block';
}

(function(){
	//canvas
	var cnv = document.querySelector('canvas');
	//contexto de renderização 2d
	var ctx = cnv.getContext('2d');
	
	//RECURSOS DO JOGO ========================================================>
	//arrays
	var sprites = [];
	var assetsToLoad = [];
	var tiposDeObstaculosX = [100, 60, 80];
	var tiposDeObstaculosY = [100, 70, 60];
	var coresObstaculosX = [0, 200, 400];
	var obstaculosInit = [450, 420, 400];
	var tiposDeInimigosSourceY = [212,       312,      362 ];
	//----------------------------sanduíche--pizza-----bolo------
	var posicoesIniciaisInimigosY = [350,    200,      350];
	var posicoesIniciaisInimigosX = [280,    280,      60];
	var frutas = [];
	var muros = [];
	var paredes = [];
	var inimigos = [];
	var cenario = [];
	
	//variáveis úteis
	var alienFrequency = 100;
	var alienTimer = 0;
	var contadorDeNavesAbatidasValidas = 0;
	var contadorDeNavesAbatidasInvalidas = 0;
	var win = lose = false;
	var move = 0;
	var colisoes = 0;
	var colisoes1 = 0;
	//sprites
	//cenário
	var background = new Sprite(0, 162,500, 500, 0, 0);
	sprites.push(background);
	for(var x = 0; x < 20; x++){
		for(var y = 0; y < 20; y++){
			switch(mapa[x][y]){
				case 3:
					if((Math.floor(Math.random()*11)) > 7){
						var fruta = new Sprite(84, 131, 25,25,muro[x][y], x*25);
						sprites.push(fruta);
						frutas.push(fruta);
					}
					break;
				case 1:
					var paredeSprite = new SpriteDynamic(500,112,25,50,25*y,parede[x][y]);
					sprites.push(paredeSprite);
					paredes.push(paredeSprite);
					cenario.push(paredeSprite);
					break;
				case 2:
					var muroSprite = new SpriteDynamic(450,137,50,25,muro[x][y], 25*x);
					sprites.push(muroSprite);
					muros.push(muroSprite);
					cenario.push(muroSprite);
					break;
			}
		}
	}
    //personagem
    var char = new Sprite(500,162,50,50,180,400);
	sprites.push(char);
	//inimigos
	for(var ç = 0; ç < 3; ç++){
		var inimigo = new Sprite(750,tiposDeInimigosSourceY[ç],50,50,posicoesIniciaisInimigosX[ç],posicoesIniciaisInimigosY[ç]);
		sprites.push(inimigo);
		inimigos.push(inimigo);
	}
	//obstaculos
	//var obstaculos = new Sprite(0, 0, 100, 200, 380, 298);
	//sprites.push(obstaculos);
	
	//imagem
	var img = new Image();
	img.addEventListener('load',loadHandler,false);
	img.src = "img/img.png";
	assetsToLoad.push(img);
	//contador de recursos
	var loadedAssets = 0;
	
	//ações
	var mvLeft = mvRight = mvTop = mvDown = false;	
	//entradas
	var LEFT = 37, RIGHT = 39, ENTER = 13, SPACE = 32, CIMA = 38, BAIXO = 40;
	
	
	//estados do jogo
	var LOADING = 0, PLAYING = 1, PAUSED = 2, OVER = 3;
	var gameState = LOADING;

	//variáveis de contadores que marcam o tempo de delay certa quantidade de frames 
	const contadorDeTempo = 60;
	var delayMudancaDeCor = 0;
	
	//listeners
	window.addEventListener('keydown',function(e){
		var key = e.keyCode;
		
		switch(key){
			case LEFT:
				
				break;
			case RIGHT:
				
				break;
			case BAIXO:
				
				break;
			case CIMA:
				
				break;
		}
	},false);
	
	window.addEventListener('keyup',function(e){
		var key = e.keyCode;
			switch(key){
				case LEFT:
					mvLeft = true;
					mvDown = false;
					mvTop = false;
					mvRight = false;
					
					break;
				case RIGHT:
					mvLeft = false;
					mvDown = false;
					mvTop = false;
					mvRight = true;
					
					break;
				case BAIXO:
					mvLeft = false;
					mvDown = true;
					mvTop = false;
					mvRight = false;
					break;
				case CIMA:
					mvLeft = false;
					mvDown = false;
					mvTop = true;
					mvRight = false;
					break;
				case ENTER:
					if(gameState !== PLAYING){
						gameState = PLAYING;
					} else {
						gameState = PAUSED;
					}
					break;
			}
		
	},false);
	
	
	
	//FUNÇÕES =================================================================>
	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}
	function loadHandler(){
		loadedAssets++;
		if(loadedAssets === assetsToLoad.length){
			img.removeEventListener('load',loadHandler,false);
			//inicia o jogo
			gameState = PAUSED;
		}
	}
	setNewPosition = (sprite) => {
		sprite.sourceX >= 825 ? sprite.moreOrLess = -1 : sprite.sourceX <= 525 ? sprite.moreOrLess = 1 : sprite.moreOrLess = sprite.moreOrLess;

		sprite.sourceX += (75 * sprite.moreOrLess);
	}
	setMove = (char) => {
		char.x += char.vx;
		char.y += char.vy;
	}
	setPosition = (char) => {
		char.x += char.positionX;
		char.y += char.positionY;
	}
	setSource = (obj, value) => {
		obj.sourceX = value;
	}
	ChangeBackground = () => {
		delayMudancaDeCor = 0;
		for(var i in sprites){
			var sprite = sprites[i];
			sprite.type === "DYNAMICBACKGROUND" ? setNewPosition(sprite) : delayMudancaDeCor++;
		}
	}
	leaveBorder = (inimigoType1) => {
		//condição se o inimigo sair da borda ele retornar na outra extremidade
		if(inimigoType1.x > cnv.width - inimigoType1.width){
			inimigoType1.x = 0;
		}
		if(inimigoType1.x < 0){
			inimigoType1.x = cnv.width - inimigoType1.width;
		}
		if(inimigoType1.y > cnv.height - inimigoType1.height){
			inimigoType1.y = 0;
		}
		if(inimigoType1.y < 0 ){
			inimigoType1.y = cnv.height - inimigoType1.height;
		}
	}
	
	collideWall = (inimigoType1) => {
		for(var i = 0; i < cenario.length; i++){
			var cenarioEspecifico = cenario[i];
			if(collide(inimigoType1, cenarioEspecifico)){
				colisoes += 1;
				if(colisoes == 1){
					if(inimigoType1.vx != 0){
						//dando espaçamento para não bugar na parede
						if(inimigoType1.vx == 5){
							inimigoType1.x -= 5; 
						}
						if(inimigoType1.vx == -5){
							inimigoType1.x += 5;
						}
						
						if(Math.floor(Math.random() * 10) > 5){
							inimigoType1.vy = 5;
							inimigoType1.vx = 0;
							setSource(inimigoType1, 850);
						}//50%
						else{
							if(Math.floor(Math.random() * 10) > 5){
								inimigoType1.vy = -5;
								inimigoType1.vx = 0;
								setSource(inimigoType1, 800);
							}//50%
							else{
								inimigoType1.vy = 0;
								inimigoType1.vx == 5 ? setSource(inimigoType1, 900) : setSource(inimigoType1, 750); 
								inimigoType1.vx *= -1;
							}//default caso nenhuma das condições sejam verdadeiras
						}
					}
					else{
						if(inimigoType1.vy != 0){
							if(inimigoType1.vy == 5){
								inimigoType1.y -= 5;
							}
							if(inimigoType1.vy == -5){
								inimigoType1.y += 5;
							}
							if(Math.floor(Math.random() * 10 ) > 5){
								inimigoType1.vy = 0;
								inimigoType1.vx = 5;
								setSource(inimigoType1, 750);
							}//50%
							else{
								if(Math.floor(Math.random() * 10) > 5){
									inimigoType1.vy = 0;
									inimigoType1.vx = -5;
									setSource(inimigoType1, 900);
								}
								else{
									inimigoType1.vx = 0;
									inimigoType1.vy == 5 ? setSource(inimigoType1, 800) : setSource(inimigoType1, 850);
									inimigoType1.vy = -1 * inimigoType1.vy;	
								}
							}
						} //if vy != de 0
					} // fim do else do vx != 0
				}
			}
		}//final do for do cenario
	} 
	collideWallChar = (exe) => {
		//colisoes char x cenário 
		colisoes1 = 0;
		char.collideTrueOrFalse = false;
		
		for(var j = 0; j < cenario.length; j++){
			var thisCenario = cenario[j];
			if(collide(char, thisCenario)){
				colisoes1 += 1;
				if(colisoes1 == 1){
					char.collideTrueOrFalse = true;
					if(exe){
						mvLeft = mvDown = mvRight = mvTop = false;
						
						char.positionX = char.positionY = 0;

						if(char.vy == 5 ){	
							
							char.positionY = -5;
						}
						
						if(char.vy == -5 ){
							
							char.positionY = 5;
						}
						if(char.vx == 5 ){
							
							char.positionX = -5;
						}
						
						if(char.vx == -5 ){
							
							char.positionX = 5;
						}
						char.vx = 0;
						char.vy = 0;
					}
					
				}
			}//fim do if
			
		}//fim do for j
		
	}
	verifyBufferColliding = () => {
		switch(char.move){
			case "TOP":
				char.y -= 5;
				collideWallChar(false);
				if(!char.collideTrueOrFalse){
					char.vx = 0;
					char.vy = -5;
				}
				char.y += 5;
				break;
			case "DOWN":
				char.y += 5;
				collideWallChar(false);
				if(!char.collideTrueOrFalse){
					char.vx = 0;
					char.vy = 5;
				}
				char.y -= 5;
				break;
			case "LEFT":
				char.x -= 5;
				collideWallChar(false);
				if(char.collideTrueOrFalse === false){
					char.vx = -5;
					char.vy = 0;
				}
				char.x += 5;
				break;
			case "RIGHT":
				char.x += 5;
				collideWallChar(false);
				if(char.collideTrueOrFalse === false){
					char.vx = 5;
					char.vy = 0;
				}
				char.x -= 5;
				break;
		}
	}
	
	function loop(){
		requestAnimationFrame(loop, cnv);
		contadorDeTempo === delayMudancaDeCor ? ChangeBackground() : delayMudancaDeCor++;
		//define as ações com base no estado do jogo
		switch(gameState){
			case LOADING:
				console.log('LOADING...');
				break;
			case PLAYING:
				update();
				break;
			case OVER:
				if(win && !lose){
					win = false;
					contadorDeNavesAbatidasValidas = 0;
					console.log('Você venceu');
				}
				if(lose && !win){
					console.log('Você perdeu');
				}
				break;
			case PAUSED:
				break;
		}
		render();
	}
	
	function update(){
		//Regras do jogo camada de decisões
		//move para a esquerda
		
		if(mvLeft && !mvRight && !mvDown && !mvTop){
			char.x -= 5;
			collideWallChar(false);
			if(char.collideTrueOrFalse === false){
				char.vx = -5;
				char.vy = 0;
			}
			
			char.x += 5;
		}
		
		//move para a direita
		if(mvRight && !mvLeft && !mvDown && !mvTop){
			char.x += 5;
			collideWallChar(false);
			if(char.collideTrueOrFalse === false){
				char.vx = 5;
				char.vy = 0;
			}
			char.x -= 5;
		}

		//move para cima 
		if(mvTop && !mvLeft && !mvDown && !mvRight){
			char.y -= 5;
			collideWallChar(false);
			if(char.collideTrueOrFalse === false){
				char.vx = 0;
				char.vy = -5;
			}
			char.y += 5;
		}

		//move para baixo
		if(mvDown && !mvLeft && !mvTop && !mvRight){
			char.y += 5;
			collideWallChar(false);
			if(char.collideTrueOrFalse === false){
				char.vx = 0;
				char.vy = 5;
			}
			char.y -= 5;
		}
		if(!mvDown && !mvLeft && !mvTop && !mvRight ){
			char.vx = 0;
			char.vy = 0;
		}
		//atualiza a posição
		/*move = char.x;
		char.x = Math.max(0,Math.min(cnv.width - char.width, char.x + char.vx));
		if(collide(char, obstaculos)){
			char.x = move;
		}
		*/
		//atualiza a posição dos inimigos
		
		//for para perceber se houve choque entre o inimigo e os muros
		
		for(var z in inimigos){
			var inimigoType1 = inimigos[z];
			colisoes = 0;
			collideWall(inimigoType1);
			leaveBorder(inimigoType1);
		}
		
		collideWallChar(true);

		

		//verificar se o personagem ultrapassou o limite da arena 
		if(char.x > cnv.width - char.width){
			char.x = 0;
		}
		if(char.x < 0){
			char.x = cnv.width - char.width;
		}
		if(char.y > cnv.height - char.height){
			char.y = 0;
		}
		if(char.y < 0 ){
			char.y = cnv.height - char.height;
		}
		//atualiza a posição do personagem
		!char.collideTrueOrFalse ? setMove(char) : setPosition(char);

		//atualiza a posição do inimigo
		for(var n in inimigos){
			inimigos[n].x += inimigos[n].vx;
			inimigos[n].y += inimigos[n].vy;
		}

		//obstaculos.x = obstaculos.x - 7;

		/*if(obstaculos.x < 0){
			obstaculos.status = "INVISIBLE";
			removeObjects(obstaculos, sprites);
			var syhei = tiposDeObstaculosY[getRandomInt(0, 3)];
			var sxwid = tiposDeObstaculosX[getRandomInt(0, 3)];
			var x1 = coresObstaculosX[getRandomInt(0, 3)];

			obstaculos = new Sprite(x1, 0, sxwid, syhei, obstaculosInit[getRandomInt(0,3)], cnv.height - sywid);
			sprites.push(obstaculos);
		}*/

		//atualiza a posição dos mísseis
		/*for(var i in misseis){
			var missel = misseis[i];
			missel.y += missel.vy;
			if(missel.y < -missel.height){//missel passar da borda superior do canvas
				removeObjects(missel, misseis);
				removeObjects(missel, sprites);
				i--;
			}
		}
		//encremento do alienTimer
		alienTimer++;
		//criação do alien caso o Timer se iguale a frequencia
		if(alienTimer === alienFrequency){
			makeAlien();
			alienTimer = 0;
			//ajuste da frequencia de aliens
			if(alienFrequency > 2){
				alienFrequency--;
			}
		}
		//atualiza posição dos aliens
		for(var i in aliens){
			var alieni = aliens[i];
			if(alieni.state !== alieni.EXPLODED){
				alieni.y += alieni.vy;
				if(alieni.state === alieni.CRAZY){
					if(alieni.x > cnv.width - alieni.width || alieni.x < 0){//evitar que os objetos inimigos ultrapassem das bordas laterais do canvas
						alieni.vx *= -1;
					}
					alieni.x += alieni.vx;
				}
				if(alieni.y > cnv.height + alieni.height){//quando eu passar da borda inferior do canvas remover item
					removeObjects(alieni, aliens);
					removeObjects(alieni, sprites);
					i--;
				}
			}

			//Confere se algum alien foi destruído
			for(var j in misseis){
				var missile = misseis[j];
				if(collide(missile, alieni) && alieni.state !== alieni.EXPLODED){
					if(!win  && !lose){
						progressoAtual();
					}
					
					if(contadorDeNavesAbatidasValidas === 50){
						win = true;
						gameState = OVER;
					}
					else{
						win = false;
					}
					destroyAlien(alieni);
					removeObjects(missile, misseis);
					removeObjects(missile, sprites);
					j--;
					i--;
				}
			}
			
		}//fim do for que faz a varredura no array de aliens
		*/
	}//fim do update
	
	//remove os objetos do jogo 
	function removeObjects(objectOnRemove, array){
		var i = array.indexOf(objectOnRemove);
		if(i !== -1){
			array.splice(i, 1);
		}
	}
	function render(){
		ctx.clearRect(0,0,cnv.width,cnv.height);
		if(sprites.length !== 0){
			for(var i in sprites){
				var spr = sprites[i];
				if(spr.status === "VISIBLE"){
					ctx.drawImage(img,spr.sourceX,spr.sourceY,spr.width,spr.height,Math.floor(spr.x),Math.floor(spr.y),spr.width,spr.height);
				}
			}
		}
	}
	loop();
}());
