function funcaoGame(){
	var tela = document.getElementById('jogo');
	tela.style.display = 'block';
}

(function(){
	const initGame = {
		createGame : () => {
			return new Game();
		}
	}
	const createGame = initGame["createGame"];
	const game = createGame();
	//canvas
	var cnv = document.querySelector('canvas');
	//contexto de renderização 2d
	var ctx = cnv.getContext('2d');
	//fundo -----------------------------------
	var background = new Sprite(0, 162,500, 550, 0, 0);
	game.sprites.push(background);
	//variáveis úteis
	var win = lose = false;
	for(var x = 0; x < 20; x++){
		for(var y = 0; y < 20; y++){
			switch(Scene.mapa[x][y]){
				case 3:
					if((Math.floor(Math.random()*10)) > 7){
						var fruta = new Sprite(84, 131, 25,25,Scene.muro[x][y], x*25);
						game.sprites.push(fruta);
						game.frutas.push(fruta);
					}
					break;
				case 1:
					var paredeSprite = new SpriteDynamic(500,112,25,50,25*y,Scene.parede[x][y]);
					game.sprites.push(paredeSprite);
					game.cenario.push(paredeSprite);
					break;
				case 2:
					var muroSprite = new SpriteDynamic(450,137,50,25,Scene.muro[x][y], 25*x);
					game.sprites.push(muroSprite);
					game.cenario.push(muroSprite);
					break;
			}
		}
	}
	

	//personagem---------------------------------
    var char = new Sprite(500,162,50,50,180,425);
	game.sprites.push(char);
	game.players.push(char);
	//inimigos-----------------------------------
	for(var ç = 0; ç < 3; ç++){ 
		var inimigo = new InimigoObj(750,game.tiposDeInimigosSourceY[ç],50,50,game.posicoesIniciaisInimigosX[ç],game.posicoesIniciaisInimigosY[ç]);
		game.sprites.push(inimigo);
		game.inimigos.push(inimigo);
	}
	for(var indice = 0; indice < 7; indice++){
		const lifeIcon = new LifeIcons(112, 111, 50, 50, game.players[0].lifePositionX[indice], 500);
		game.players[0].lifeIcons.push(lifeIcon);
		game.players[0].sprites.push(lifeIcon);
	}
	
	
	
    
	
	//imagem-------------------------------------
	var img = new Image();
	img.addEventListener('load',loadHandler,false);
	img.src = "img/img.png";
	game.assetsToLoad.push(img);
	
	//listeners
	window.addEventListener('keydown',function(e){
		
	},false);
	
	window.addEventListener('keyup', (e) => {
		var key = e.keyCode;
			switch(key){

				case game.acceptKeys["LEFT"]:
					game.players[0].keyPressed = "mvLeft";
					break;
				case game.acceptKeys["RIGHT"]:
					game.players[0].keyPressed = "mvRight";
					break;
				case game.acceptKeys["DOWN"]:
					game.players[0].keyPressed = "mvDown";
					break;
				case game.acceptKeys["TOP"]:
					game.players[0].keyPressed = "mvTop";
					break;
				case game.acceptKeys["ENTER"]:
					game.players[0].keyPressed = "mvNone";
					if(game.gameState !== game.OVER){
						game.gameState !== game.PLAYING ? game.gameState = game.PLAYING : 
						game.gameState = game.PAUSED;
						game.players[0].gameState !== "PLAYING" ? game.players[0].gameState = "PLAYING" : 
						game.players[0].gameState = "PAUSED";
					}
					break;
				default : 
					console.log("Invalid Key");
			}
	},false);
	//FUNÇÕES =================================================================>
	//remove os objetos do jogo 
	function removeObjects(objectOnRemove, array){
		var i = array.indexOf(objectOnRemove);
		if(i !== -1){
			array.splice(i, 1);
		}
	}
	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}
	function loadHandler(){
		game.loadedAssets++;
		if(game.loadedAssets === game.assetsToLoad.length){
			img.removeEventListener('load',loadHandler,false);
			//inicia o jogo
			game.gameState = game.PAUSED;
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
	setSourceX = (obj, value) => {
		obj.sourceX = value;
	}
	setSourceY = (obj, value) => {
		obj.sourceY = value;
	}
	
	ChangeBackground = () => {
		game.delayMudancaDeCor = 0;
		for(var i in game.sprites){
			var sprite = game.sprites[i];
			sprite.type === "DYNAMICBACKGROUND" ? setNewPosition(sprite) : game.delayMudancaDeCor++;
		}
	}
	ChangeChar = () => {
		game.players[0].sourceX === 700 ? setSourceX(game.players[0], 500) : setSourceX(game.players[0], game.players[0].sourceX + 50);
	}
	ChangeLife = () => {
		for(const ic in game.players[0].lifeIcons){
			const icone = game.players[0].lifeIcons[ic];
			icone.sourceY === 111 ? setSourceY(icone, 61) : setSourceY(icone, 111);
		}
	}
	Animations = () => {
		ChangeBackground();
		ChangeChar();
		ChangeLife();
	}
	leaveBorder = (inimigoType1, paused) => {
		//condição se o inimigo sair da borda ele retornar na outra extremidade
		if(inimigoType1.x > cnv.width - inimigoType1.width){
			inimigoType1.x = 0;
			return true;
		}
		if(inimigoType1.x < 0){
			inimigoType1.x = cnv.width - inimigoType1.width;
			return true;
		}
		if(inimigoType1.y > (cnv.height - inimigoType1.height) + (- 50 + paused ) ){
			inimigoType1.y = 0;
			return false;
		}
		if(inimigoType1.y < 0 ){
			inimigoType1.y = (cnv.height - inimigoType1.height) + (- 50 + paused );
			return false;
		}
	}

	const collidingInimigo = {
		RIGHT : (objeto) => {
			objeto["x"] += 5;
			colliding["collideAllScene"](objeto);
			objeto["vy"] = 0;
			objeto["vx"] = 5;
			objeto["x"] -= 5;
			setSourceX(objeto, 750);
		},
		LEFT : (objeto) => {
			objeto["x"] -= 5;
			colliding["collideAllScene"](objeto);
			objeto["vy"] = 0;
			objeto["vx"] = -5;
			objeto["x"] += 5;
			setSourceX(objeto, 900);
		},
		DOWN : (objeto) => {
			objeto["y"] += 5;
			colliding["collideAllScene"](objeto);
			objeto["vy"] = 5;
			objeto["vx"] = 0;
			objeto["y"] -= 5;
			setSourceX(objeto, 850);
		},
		TOP : (objeto) => {
			objeto["y"] -= 5;
			colliding["collideAllScene"](objeto);
			objeto["vy"] = -5;
			objeto["vx"] = 0;
			objeto["y"] += 5;
			setSourceX(objeto, 800);
		}
	}
	moveInimigo = (inimigoType1) => {
		collidingInimigo[inimigoType1.optionsRoutes[getRandomInt(0, 4)]](inimigoType1);
		while(inimigoType1.collideTrueOrFalseAllScene){
			collidingInimigo[inimigoType1.optionsRoutes[getRandomInt(0, 4)]](inimigoType1);
		}
	}
	collideWall = (inimigoType1) => {
		inimigoType1.collideTrueOrFalse = false;
		for(var i = 0; i < game.cenario.length; i++){
			var cenarioEspecifico = game.cenario[i];
			if(collide(inimigoType1, cenarioEspecifico)){
				inimigoType1.colisoes += 1;
				if(inimigoType1.colisoes == 1){
					inimigoType1.collideTrueOrFalse = true;
					//dando espaçamento para não bugar na parede
					inimigoType1.positionX = inimigoType1.positionY = 0;
					const collideFunctions = colliding["collideTop"];
					collideFunctions(inimigoType1, 5);
					setPosition(inimigoType1);
					moveInimigo(inimigoType1);
				}
			}
		}//final do for do cenario
	} 
	const colliding = {
		collideTop : (objeto, desconto) => {
			objeto.y -= desconto;
			colliding["collideAllScene"](objeto);
			objeto.collideTrueOrFalseAllScene ? colliding["collideDown"](objeto,desconto) : objeto.positionY = -desconto;
			objeto.y += desconto;
		},
		collideDown : (objeto, desconto) => {
			objeto.y += desconto;
			colliding["collideAllScene"](objeto);
			objeto.collideTrueOrFalseAllScene ? colliding["collideLeft"](objeto,desconto) : objeto.positionY = desconto;
			objeto.y -= desconto;
		},
		collideLeft : (objeto, desconto) => {
			objeto.x -= desconto;
			colliding["collideAllScene"](objeto);
			objeto.collideTrueOrFalseAllScene ? colliding["collideRight"](objeto,desconto) : objeto.positionX = -desconto;
			objeto.x += desconto;
		},
		collideRight : (objeto, desconto) => {
			objeto.x += desconto;
			colliding["collideAllScene"](objeto);
			objeto.collideTrueOrFalseAllScene ? colliding["collideTop"](objeto,desconto - 1) : objeto.positionX = desconto; 
			objeto.x -= desconto;
		},
		collideAllScene : (objeto) => {
			//colisoes char x cenário 
			objeto.colisoes = 0;
			objeto.collideTrueOrFalseAllScene = false;
			for(var j = 0; j < game.cenario.length; j++){
				var thisCenario = game.cenario[j];
				if(collide(objeto, thisCenario)){
					objeto.colisoes += 1;
					if(objeto.colisoes == 1){
						objeto.collideTrueOrFalseAllScene = true;
					}
				}
			}
		}
	}
	collideWallChar = () => {
		//colisoes char x cenário 
		game.players[0].colisoes = 0;
		game.players[0].collideTrueOrFalse = false;
		
		for(var j = 0; j < game.cenario.length; j++){
			var thisCenario = game.cenario[j];
			if(collide(game.players[0], thisCenario)){
				game.players[0].colisoes += 1;
				if(game.players[0].colisoes == 1){
					game.players[0].collideTrueOrFalse = true;
					game.players[0].positionX = game.players[0].positionY = 0;
					const collideFunctions = colliding["collideTop"];
					collideFunctions(game.players[0], 5);
					game.players[0].vx = 0;
					game.players[0].vy = 0;
					
				}
			}//fim do if
			
		}//fim do for j
		
	}
	changeSkin = (typeChange) => {
		const funcoesInternas = {
			"EMAGRECE" : () => {
				game.players[0].sourceY === 162 ? game.players[0].sourceY *= 1 : setSourceY(game.players[0], game.players[0].sourceY - 50);
			},
			"ENGORDA" : () => {
				game.players[0].sourceY === 462 ? game.players[0].sourceY *= 1 : setSourceY(game.players[0], game.players[0].sourceY + 50);
			}
		}
		const exec =  funcoesInternas[`${typeChange}`];
		exec();
	}
	collideCharFruit = () => {
		for(var k in game.frutas){
			if( collide(game.players[0], game.frutas[k]) && game.frutas[k].status !== "INVISIBLE" ){
				game.players[0].points += 1;
				game.frutas[k].status = "INVISIBLE";
				changeSkin("EMAGRECE");
			}
		}
	}
	gameLose = (indice) => {
		game.players[0].lifeIcons[indice].status = "INVISIBLE";
		game.players[0].gameState = "LOSE";
	}
	verifyGameLose = (indice) => {
		indice === 0 ? gameLose(indice)  :
		game.players[0].lifeIcons[indice].status = "INVISIBLE";
	}
	collideCharInimigos = () => {
		for(var ini in game.inimigos){
			if( collide(game.players[0], game.inimigos[ini]) && game.inimigos[ini].status !== "INVISIBLE" ){
				game.players[0].loser -= 1;
				verifyGameLose(game.players[0].loser);
				game.inimigos[ini].status = "INVISIBLE";
				changeSkin("ENGORDA");
				for(var ç = 0; ç < 1; ç++){
					var inimigo = new InimigoObj(750,game.tiposDeInimigosSourceY[ç],50,50,game.posicoesIniciaisInimigosX[ç],game.posicoesIniciaisInimigosY[ç]);
					game.sprites.push(inimigo);
					game.inimigos.push(inimigo);
				}
			}
		}
	}
	removeInvisibleObjects = (objetos, sprites) => {
		for(var espec in objetos){
			var objetoEspecifico = objetos[espec];
			if(objetoEspecifico.status === "INVISIBLE"){
				removeObjects(objetoEspecifico, objetos);
				removeObjects(objetoEspecifico, sprites);
				espec--;
			}
		}
	}
	clearObjectsModePause = () => {
		for(var sce in game.players[0].scenePause){
			removeObjects(game.players[0].scenePause[sce], game.players[0].sprites);
			removeObjects(game.players[0].scenePause[sce], game.players[0].scenePause);
			sce--;
		}
		for(var ali in game.players[0].alimentosPaused){
			removeObjects(game.players[0].alimentosPaused[ali], game.players[0].sprites);
			removeObjects(game.players[0].alimentosPaused[ali], game.players[0].alimentosPaused);
			ali--;
		}
	}
	setReverseAnimation = (alimento, veloX, positX) => {
		alimento.vx = veloX * -1;
		alimento.x = positX;
	}
	setAnimationPaused = () => {
		for(var obj in game.players[0].alimentosPaused){
			var alimento = game.players[0].alimentosPaused[obj];
			alimento.vy = 2;
			const velocidadeX = alimento.vx;
			const positionX = alimento.x;
			game.players[0].contadorDePausa % 5 === 0 ?
			leaveBorder(alimento, 50) ? setReverseAnimation(alimento, velocidadeX, positionX)  : alimento.vy *= 1 : leaveBorder(alimento, 50);
			setMove(alimento);
		}
	}
	setAnimationLose = () => {
		game.players[0].contadorDeLose % 30 === 0 && game.players[0].sceneLose[0].sourceX < 4800 ? setSourceX(game.players[0].sceneLose[0], game.players[0].sceneLose[0].sourceX + 500 ) : game.players[0].contadorDeLose *= 1;
	}
	createSceneLose = () => {
		var backgroundLose = new Sprite(2306,163,500,550,0,0);
		game.players[0].sprites.push(backgroundLose);
		game.players[0].sceneLose.push(backgroundLose);
	}
	createScenePause = (pause) => {
		var backgroundPause;
		pause ? backgroundPause = new Sprite(1803,161,500, 550, 0, 0) : backgroundPause = new Sprite(1000,161,500, 550, 0, 0);
		game.players[0].sprites.push(backgroundPause);
		game.players[0].scenePause.push(backgroundPause);
		for(var alimento = 0; alimento < 6; alimento++){
			var alimentoEspec = new Sprite(game.players[0].alimentosPausedX[alimento],0,50,55,game.players[0].alimentosPausedPositionX[alimento], game.players[0].alimentosPausedPositionY[alimento]);
			game.players[0].sprites.push(alimentoEspec);
			game.players[0].alimentosPaused.push(alimentoEspec);
		}
		var playButton = new Sprite(1500,161,300,116,Math.trunc((cnv.width) / 2) - Math.trunc( (300 / 2) ), Math.trunc((cnv.height) / 2) - Math.trunc( (116 / 2) )  );
		game.players[0].sprites.push(playButton);
		game.players[0].scenePause.push(playButton);
	}
	function loop(){
		requestAnimationFrame(loop, cnv);
		game.contadorDeTempo === game.delayMudancaDeCor ? Animations() : game.delayMudancaDeCor++;
		//define as ações com base no estado do jogo
		switch(game.gameState){
			case game.LOADING:
				console.log('LOADING...');
				break;
			case game.PLAYING:
				update();
				break;
			case game.OVER:
				break;
			case game.PAUSED:
				break;
		}
		const playerGameState = {
			PAUSED : () => {
				game.players[0].contadorDePausa += 1;
				game.players[0].contadorDePausa === 1 ? createScenePause(true) : updatePause();
			},
			PLAYING : () => {
				//update();
				game.players[0].contadorDePausa = 0;
				
			},
			WIN : () => {
				game.gameState = game.OVER;
			},
			LOSE : () => {
				game.players[0].status = "INVISIBLE";
				//removeInvisibleObjects(game.sprites, game.players);
				game.gameState = game.OVER;
				game.players[0].contadorDeLose += 1;
				game.players[0].contadorDeLose === 1 ? createSceneLose() : updateLose();
			},
			INIT : () => {
				game.players[0].contadorDePausa += 1;
				game.players[0].contadorDePausa === 1 ? createScenePause(false) : updatePause();
				
			}
		}
		playerGameState[`${game.players[0].gameState}`]();
		render();
	}
	
	function update(){
		//Regras do jogo camada de decisões
		//move para a esquerda
		const moviments = {
			mvRight : () => {
				game.players[0].x += 5;
				colliding["collideAllScene"](game.players[0]);
				if(game.players[0].collideTrueOrFalseAllScene === false){
					game.players[0].vx = 5;
					game.players[0].vy = 0;
				}
				game.players[0].x -= 5;
			},
			mvLeft : () => {
				game.players[0].x -= 5;
				colliding["collideAllScene"](game.players[0]);
				
				if(game.players[0].collideTrueOrFalseAllScene === false){
					game.players[0].vx = -5;
					game.players[0].vy = 0;
				}
				
				game.players[0].x += 5;
			},
			mvDown : () => {
				game.players[0].y += 5;
				colliding["collideAllScene"](game.players[0]);
				if(game.players[0].collideTrueOrFalseAllScene === false){
					game.players[0].vx = 0;
					game.players[0].vy = 5;
				}
				game.players[0].y -= 5;
			},
			mvTop : () => {
				game.players[0].y -= 5;
				colliding["collideAllScene"](game.players[0]);
				if(game.players[0].collideTrueOrFalseAllScene === false){
					game.players[0].vx = 0;
					game.players[0].vy = -5;
				}
				game.players[0].y += 5;
			},
			mvNone : () => {
				console.log("waiting pressed key...");
			}
		}
		const move = moviments[`${game.players[0].keyPressed}`];
		move();
		//atualiza a posição
		/*move = char.x;
		char.x = Math.max(0,Math.min(cnv.width - char.width, char.x + char.vx));
		if(collide(char, obstaculos)){
			char.x = move;
		}
		*/
		//atualiza a posição dos inimigos
		
		//for para perceber se houve choque entre o inimigo e os muros
		
		for(var z in game.inimigos){
			var inimigoType1 = game.inimigos[z];
			inimigoType1.colisoes = 0;
			collideWall(inimigoType1);
			!inimigoType1.collideTrueOrFalse ? setMove(inimigoType1) : inimigoType1.colisoes *= 1;
			leaveBorder(inimigoType1, 0);
		}
		//verificar se o personagem ultrapassou o limite da arena 
		leaveBorder(game.players[0], 0);
		
		collideWallChar();
		collideCharFruit();
		collideCharInimigos();
		removeInvisibleObjects(game.frutas, game.sprites);
		removeInvisibleObjects(game.inimigos, game.sprites);
		removeInvisibleObjects(game.players[0].lifeIcons, game.players[0].sprites);
		
		//atualiza a posição do personagem
		!game.players[0].collideTrueOrFalse ? setMove(game.players[0]) : setPosition(game.players[0]);
		//------------------------seta o movimento/ seta o recoy caso o inimigo venha a colida com o cenário;
		
		//Animação do modo pause 
		game.players[0].gameState !== "PAUSED" ? clearObjectsModePause() : game.players[0].gameState = "PAUSED";
		
		
	}//fim do update
	function updatePause() {
		setAnimationPaused();
	}
	function updateLose(){
		setAnimationLose();
	}
	function updateWin(){

	}
	
	function render(){
		ctx.clearRect(0,0,cnv.width,cnv.height);
		//itens gerais para todos os players
		if(game.sprites.length !== 0){
			for(const i in game.sprites){
				const spr = game.sprites[i];
				if(spr.status === "VISIBLE"){
					ctx.drawImage(img,spr.sourceX,spr.sourceY,spr.width,spr.height,Math.floor(spr.x),Math.floor(spr.y),spr.width,spr.height);
				}
			}
		}
		//itens específicos de cada player
		if(game.players[0].sprites.length !== 0){
			for(const gameSprite in game.players[0].sprites){
				const sprEspecifico = game.players[0].sprites[gameSprite];
				if(sprEspecifico.status === "VISIBLE"){
					ctx.drawImage(img,sprEspecifico.sourceX,sprEspecifico.sourceY,sprEspecifico.width,sprEspecifico.height,Math.floor(sprEspecifico.x),Math.floor(sprEspecifico.y),sprEspecifico.width,sprEspecifico.height);
				}
			}
		}
	}
	loop();
}());
