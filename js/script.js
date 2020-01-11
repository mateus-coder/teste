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
	
	//array de misseis
	var misseis = [];
	//aliens
	var aliens = [];
	//
	var frutas = [];
	var muros = [];
	var paredes = [];
	var inimigostp1 = [];
	var inimigostp2 = [];
	var inimigostp3 = [];
	var inimigostp4 = [];
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
					var paredeSprite = new SpriteDynamic(50,112,25,50,25*y,parede[x][y]);
					sprites.push(paredeSprite);
					paredes.push(paredeSprite);
					cenario.push(paredeSprite);
					break;
				case 2:
					var muroSprite = new SpriteDynamic(0,137,50,25,muro[x][y], 25*x);
					sprites.push(muroSprite);
					muros.push(muroSprite);
					cenario.push(muroSprite);
					break;
			}
		}
	}
    //personagem
    var char = new Sprite(222,50,62,108,180,400);
	sprites.push(char);
	//inimigos
	var inimigoType1 = new Sprite(109,112,50,50,280,350);
	sprites.push(inimigoType1);
	inimigostp1.push(inimigoType1);
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
	
	
	//entradas
	var LEFT = 37, RIGHT = 39, ENTER = 13, SPACE = 32, CIMA = 38, BAIXO = 40;
	
	//ações
	var mvLeft = mvRight = mvTop = mvDown = false;
	
	
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
				mvTop = false;
				mvLeft = true;
				mvDown = false;
				mvRight = false;
				break;
			case RIGHT:
				mvTop = false;
				mvLeft = false;
				mvDown = false;
				mvRight = true;
				break;
			case BAIXO:
				mvTop = false;
				mvLeft = false;
				mvDown = true;
				mvRight = false;
				break;
			case CIMA:
				mvTop = true;
				mvLeft = false;
				mvDown = false;
				mvRight = false;
				break;
		}
	},false);
	
	window.addEventListener('keyup',function(e){
		var key = e.keyCode;
		switch(key){
			case LEFT:
				mvLeft = true;
				break;
			case RIGHT:
				mvRight = true;
				break;
			case ENTER:
				if(gameState !== PLAYING){
					gameState = PLAYING;
				} else {
					gameState = PAUSED;
				}
				break;
			case BAIXO:
				mvDown = true;
				break;
			case CIMA:
				mvTop = true;
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
	const setNewPosition = (sprite) => {
		sprite.sourceX += 50;
	}

	const ChangeBackground = () => {
		delayMudancaDeCor = 0;
		for(var i in sprites){
			var sprite = sprites[i];
			sprite.type === "DYNAMICBACKGROUND" ? setNewPosition(sprite) : delayMudancaDeCor++;
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
			char.vx = -5;
			char.vy = 0;
		}
		
		//move para a direita
		if(mvRight && !mvLeft && !mvDown && !mvTop){
			char.vx = 5;
			char.vy = 0;
		}

		//move para cima 
		if(mvTop && !mvLeft && !mvDown && !mvRight){
			char.vx = 0;
			char.vy = -5;
		}

		//move para baixo
		if(mvDown && !mvLeft && !mvTop && !mvRight){
			char.vx = 0;
			char.vy = 5;
		}

		//para a nave
		if(!mvLeft && !mvRight && !mvTop && !mvDown){
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
		colisoes = 0;
		for(var i = 0; i < cenario.length; i++){
			var cenarioEspecifico = cenario[i];
			if(collide(inimigoType1, cenarioEspecifico)){
				colisoes += 1;
				if(colisoes == 1){
					if(inimigoType1.vx != 0){
						//dando espaçamento para não bugar na parede
						if(inimigoType1.vx == 5){
							inimigoType1.x = inimigoType1.x -5;
						}
						if(inimigoType1.vx == -5){
							inimigoType1.x = inimigoType1.x +5;
						}
						if(Math.floor(Math.random() * 11) > 5){
							inimigoType1.vy = 0;
		
							inimigoType1.vx = inimigoType1.vx * -1;
						}//30%;
						else{
							if(Math.floor(Math.random() * 11) > 5){
								inimigoType1.vy = 5;
								inimigoType1.vx = 0;
								
							}//30%
							else{
								if(Math.floor(Math.random() * 11) > 5){
									inimigoType1.vy = -5;
									inimigoType1.vx = 0;
								}
								else{
									inimigoType1.vx = inimigoType1.vx * -1;
									inimigoType1.vy = 0;
								}
							}
						} //final do else
					}
					else{
						if(inimigoType1.vy != 0){
							if(inimigoType1.vy == 5){
								inimigoType1.y = inimigoType1.y -5;
							}
							if(inimigoType1.vy == -5){
								inimigoType1.y = inimigoType1.y +5;
							}
							if(Math.floor(Math.random() * 11 ) > 5){
								inimigoType1.vy = inimigoType1.vy * - 1; 
								inimigoType1.vx = 0;
							}
							else{
								if(Math.floor(Math.random() * 11) > 5){
									inimigoType1.vy = 0;
									inimigoType1.vx = 5;
								}
								else{
									if(Math.floor(Math.random() * 11) > 5){
										inimigoType1.vy = 0;
										inimigoType1.vx = -5;
									}
									else{
										inimigoType1.vy = -1 * inimigoType1.vy;
										inimigoType1.vx = 0;
									}
								}
							} //final do else
						} //vy != de 0
					}
					
				}
			}
		}//final do for do cenario
		//for para perceber se houve choque entre o inimigo e as paredes
		console.log(colisoes);
		//colisoes char x cenário 
		colisoes1 = 0;
		for(var j = 0; j < cenario.length; j++){
			var thisCenario = cenario[j];
			if(collide(char, thisCenario)){
				colisoes1 += 1;
				if(colisoes1 == 1){
					if(char.vy == 5){
						char.y = char.y -5;
					}
					if(char.vy == -5){
						char.y = char.y +5;
					}

					if(char.vx == 5){
						char.x = char.x -5;
					}
					if(char.vx == -5){
						char.x = char.x +5;
					}
					mvLeft = mvDown = mvRight = mvTop = false;
				}
			}//fimd o if
			
		}//fim do for

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
		char.x += char.vx;
		char.y += char.vy;
		//atualiza a posição do inimigo
		inimigoType1.x += inimigoType1.vx;
		inimigoType1.y += inimigoType1.vy;

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
