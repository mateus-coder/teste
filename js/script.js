function funcaoGame(){
	let tela = document.getElementById('jogo');
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
	//construtora de texto 
	const constructorOfText = (props) => {
        let { game, y, text, color, x, font, end } = props;
        let textWhileUserPlaying = new ObjectMessage({
            y : y,
            text : text,
            color : color,
            x : x,
            font : font,
            end : end
        });
        game.messages.push(textWhileUserPlaying);
    }
	//canvas
	let cnv = document.querySelector('canvas');
	//contexto de renderização 2d
	let ctx = cnv.getContext('2d');
	const createScenePlaying  = () => {
		//fundo -----------------------------------
		let background = new Sprite(0, 162,500, 550, 0, 0);
		game.sprites.push(background);
		
		for(let x = 0; x < 20; x++){
			for(let y = 0; y < 20; y++){
				switch(Scene.mapa[x][y]){
					case 3:
						if((Math.floor(Math.random()*10)) > 7){
							let fruta = new Sprite(84, 131, 25,25,Scene.muro[x][y], x*25);
							game.sprites.push(fruta);
							game.frutas.push(fruta);
						}
						break;
					case 1:
						let paredeSprite = new SpriteDynamic(500,112,25,50,25*y,Scene.parede[x][y]);
						game.sprites.push(paredeSprite);
						game.cenario.push(paredeSprite);
						break;
					case 2:
						let muroSprite = new SpriteDynamic(450,137,50,25,Scene.muro[x][y], 25*x);
						game.sprites.push(muroSprite);
						game.cenario.push(muroSprite);
						break;
				}
			}
		}
		//personagem---------------------------------
		let char = new Sprite(500,162,50,50,180,425);
		game.sprites.push(char);
		game.players.push(char);
		//score
		constructorOfText({
			game : game,
			y : 540,
			x : 350,
			color : "#ff5556fc",
			text : `SCORE : ${game.players[0].points}`,
			font : "normal bold 30px sweet",
			end : false
		});
		//inimigos-----------------------------------
		for(let ç = 0; ç < 3; ç++){ 
			let inimigo = new InimigoObj(750,game.tiposDeInimigosSourceY[ç],50,50,game.posicoesIniciaisInimigosX[ç],game.posicoesIniciaisInimigosY[ç]);
			game.sprites.push(inimigo);
			game.inimigos.push(inimigo);
		}
		for(let indice = 0; indice < 7; indice++){
			let lifeIcon = new LifeIcons(112, 111, 50, 50, game.players[0].lifePositionX[indice], 500);
			game.players[0].lifeIcons.push(lifeIcon);
			game.players[0].sprites.push(lifeIcon);
		}
	}
	createScenePlaying();
	
	//imagem-------------------------------------
	var img = new Image();
	img.addEventListener('load',loadHandler,false);
	img.src = "img/img.png";
	game.assetsToLoad.push(img);
	
	//listeners
	window.addEventListener('keydown',function(e){
		
	},false);
	
	window.addEventListener('keyup', (e) => {
		var key = e.key;
			switch(key){
				case "ArrowLeft":
					game.players[0].keyPressed = "mvLeft";
					break;
				case "ArrowRight":
					game.players[0].keyPressed = "mvRight";
					break;
				case "ArrowDown":
					game.players[0].keyPressed = "mvDown";
					break;
				case "ArrowUp":
					game.players[0].keyPressed = "mvTop";
					break;
				case "Enter":
					game.players[0].keyPressed = "pause";
					break;
				default : 
					game.players[0].keyPressed = "mvNone";
					console.log("Invalid Key");
			}
	},false);
	//FUNÇÕES =================================================================>
	//remove os objetos do jogo 
	function removeObjects(objectOnRemove, array){
		let i = array.indexOf(objectOnRemove);
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
		for(let i in game.sprites){
			let sprite = game.sprites[i];
			sprite.type === "DYNAMICBACKGROUND" ? setNewPosition(sprite) : game.delayMudancaDeCor++;
		}
	}
	ChangeChar = () => {
		game.players[0].sourceX === 700 ? setSourceX(game.players[0], 500) : setSourceX(game.players[0], game.players[0].sourceX + 50);
	}
	ChangeLife = () => {
		for(let ic in game.players[0].lifeIcons){
			let icone = game.players[0].lifeIcons[ic];
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
		for(let i = 0; i < game.cenario.length; i++){
			let cenarioEspecifico = game.cenario[i];
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
			for(let j = 0; j < game.cenario.length; j++){
				let thisCenario = game.cenario[j];
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
		
		for(let j = 0; j < game.cenario.length; j++){
			let thisCenario = game.cenario[j];
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
	const functionsGameWin = {
		setPointsInScreen : () => {
			game.messages[0].text = `SCORE : ${game.players[0].points}`;
		},
		gameWin : () => {
			functionsGameWin["setPointsInScreen"]();
			game.players[0].gameState = "WIN";
		},
		verifyGameWin : () => {
			game.players[0].points === 5 ? functionsGameWin["gameWin"]() : functionsGameWin["setPointsInScreen"]();	
		}
	}
	
	collideCharFruit = () => {
		for(let k in game.frutas){
			if( collide(game.players[0], game.frutas[k]) && game.frutas[k].status !== "INVISIBLE" ){
				game.players[0].points += 1;
				functionsGameWin["verifyGameWin"]();
				game.frutas[k].status = "INVISIBLE";
				changeSkin("EMAGRECE");
			}
		}
	}
	const functionsGameLose = {
		gameLose : (indice) => {
			game.players[0].lifeIcons[indice].status = "INVISIBLE";
			game.players[0].gameState = "LOSE";
		},
		verifyGameLose : (indice) => {
			indice === 0 ? functionsGameLose["gameLose"](indice)  :
			game.players[0].lifeIcons[indice].status = "INVISIBLE";
		}
	}
	
	collideCharInimigos = () => {
		for(let ini in game.inimigos){
			if( collide(game.players[0], game.inimigos[ini]) && game.inimigos[ini].status !== "INVISIBLE" ){
				game.players[0].loser -= 1;
				functionsGameLose["verifyGameLose"](game.players[0].loser);
				game.inimigos[ini].status = "INVISIBLE";
				changeSkin("ENGORDA");
				for(let ç = 0; ç < 1; ç++){
					let i = getRandomInt(0, 4);
					let inimigo = new InimigoObj(750,game.tiposDeInimigosSourceY[ç],50,50,game.posicoesIniciaisAleatoriasInimigosX[i],game.posicoesIniciaisAleatoriasInimigosY[i]);
					game.sprites.push(inimigo);
					game.inimigos.push(inimigo);
				}
			}
		}
	}
	removeInvisibleObjects = (objetos, sprites) => {
		for(let espec in objetos){
			let objetoEspecifico = objetos[espec];
			if(objetoEspecifico.status === "INVISIBLE"){
				removeObjects(objetoEspecifico, objetos);
				removeObjects(objetoEspecifico, sprites);
				espec--;
			}
		}
	}
	clearObjectsModePause = () => {
		for(let sce in game.players[0].scenePause){
			removeObjects(game.players[0].scenePause[sce], game.players[0].sprites);
			removeObjects(game.players[0].scenePause[sce], game.players[0].scenePause);
			sce--;
		}
		for(let ali in game.players[0].alimentosPaused){
			removeObjects(game.players[0].alimentosPaused[ali], game.players[0].sprites);
			removeObjects(game.players[0].alimentosPaused[ali], game.players[0].alimentosPaused);
			ali--;
		}
	}
	setReverseAnimation = (alimento, veloX, positX) => {
		alimento.vx = veloX * -1;
		alimento.x = positX;
	}
	setAnimationWin = () => {

	}
	setAnimationPaused = () => {
		for(let obj in game.players[0].alimentosPaused){
			let alimento = game.players[0].alimentosPaused[obj];
			alimento.vy = 2;
			const velocidadeX = alimento.vx;
			const positionX = alimento.x;
			game.players[0].contadorDePausa % 5 === 0 ?
			leaveBorder(alimento, 50) ? setReverseAnimation(alimento, velocidadeX, positionX)  : alimento.vy *= 1 : leaveBorder(alimento, 50);
			setMove(alimento);
		}
	}
	setAnimationLose = () => {
		game.players[0].contadorDeLose % 30 === 0 && game.players[0].sceneLose[0].sourceX < 4200 ? setSourceX(game.players[0].sceneLose[0], game.players[0].sceneLose[0].sourceX + 500 ) : game.players[0].contadorDeLose *= 1;
	}
	createSceneWin = () => {
		for(let i in game.cenario){
			game.cenario[i].status = "INVISIBLE";
		}
		for(let i in game.frutas){
			game.frutas[i].status = "INVISIBLE";
		}
		for(let i in game.inimigos){
			game.inimigos[i].status = "INVISIBLE";
		}
		constructorOfText({
			game : game,
			y : 310,
			x : 50,
			color : "#ac0",
			text : `Você Venceu!!!`,
			font : "normal bold 30px pressStart",
			end : false
		});
		
	}
	createSceneLose = () => {
		let backgroundLose = new Sprite(2306,163,500,550,0,0);
		game.players[0].sprites.push(backgroundLose);
		game.players[0].sceneLose.push(backgroundLose);
	}
	createScenePause = (pause) => {
		let backgroundPause;
		pause ? backgroundPause = new Sprite(1803,161,500, 550, 0, 0) : backgroundPause = new Sprite(1000,161,500, 550, 0, 0);
		game.players[0].sprites.push(backgroundPause);
		game.players[0].scenePause.push(backgroundPause);
		for(let alimento = 0; alimento < 6; alimento++){
			let alimentoEspec = new Sprite(game.players[0].alimentosPausedX[alimento],0,50,55,game.players[0].alimentosPausedPositionX[alimento], game.players[0].alimentosPausedPositionY[alimento]);
			game.players[0].sprites.push(alimentoEspec);
			game.players[0].alimentosPaused.push(alimentoEspec);
		}
		let playButton = new Sprite(1500,161,300,116,Math.trunc((cnv.width) / 2) - Math.trunc( (300 / 2) ), Math.trunc((cnv.height) / 2) - Math.trunc( (116 / 2) )  );
		game.players[0].sprites.push(playButton);
		game.players[0].scenePause.push(playButton);
	}
	function loop(){
		requestAnimationFrame(loop, cnv);
		game.contadorDeTempo === game.delayMudancaDeCor ? Animations() : game.delayMudancaDeCor++;
		//define as ações com base no estado do jogo
		switch(game.gameState){
			case game.LOADING:
				
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
				game.messages[0].status = "INVISIBLE";
				game.players[0].contadorDePausa === 1 ? createScenePause(true) : updatePause();
			},
			PLAYING : () => {
				//update();
				game.messages[0].status = "VISIBLE";
				game.players[0].contadorDePausa = 0;
				
			},
			WIN : () => {
				game.players[0].status = "INVISIBLE";
				game.messages[0].status = "INVISIBLE";
				//removeInvisibleObjects(game.sprites, game.players);
				game.gameState = game.OVER;
				game.players[0].contadorDeWin += 1;
				game.players[0].contadorDeWin === 1 ? createSceneWin() : updateWin();
			},
			LOSE : () => {
				game.players[0].status = "INVISIBLE";
				game.messages[0].status = "INVISIBLE";
				//removeInvisibleObjects(game.sprites, game.players);
				game.gameState = game.OVER;
				game.players[0].contadorDeLose += 1;
				game.players[0].contadorDeLose === 1 ? createSceneLose() : updateLose();
			},
			INIT : () => {
				game.players[0].points = 0;
				game.messages[0].status = "INVISIBLE";
				game.players[0].contadorDePausa += 1;
				game.players[0].contadorDePausa === 1 ? createScenePause(false) : updatePause();
			}
		}
		playerGameState[`${game.players[0].gameState}`]();
		render();
	}
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
		pause : () => {
			if(game.gameState !== game.OVER){
				game.players[0].keyPressed = "mvNone";
				game.gameState !== game.PLAYING ? game.gameState = game.PLAYING : 
				game.gameState = game.PAUSED;
				game.players[0].gameState !== "PLAYING" ? game.players[0].gameState = "PLAYING" : 
				game.players[0].gameState = "PAUSED";
			}
		},
		mvNone : () => {
			console.log("waiting pressed key...");
		},
	}
	function update(){
		//Regras do jogo camada de decisões
		//move para a esquerda
		moviments[`${game.players[0].keyPressed}`]();
		//atualiza a posição
		/*move = char.x;
		char.x = Math.max(0,Math.min(cnv.width - char.width, char.x + char.vx));
		if(collide(char, obstaculos)){
			char.x = move;
		}
		*/
		//atualiza a posição dos inimigos
		
		//for para perceber se houve choque entre o inimigo e os muros
		
		for(let z in game.inimigos){
			let inimigoType1 = game.inimigos[z];
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
		moviments[`${game.players[0].keyPressed}`]();
		setAnimationPaused();
	}
	function updateLose(){
		setAnimationLose();
	}
	function updateWin(){
		setAnimationWin();
	}
	
	function render(){
		ctx.clearRect(0,0,cnv.width,cnv.height);
		//itens gerais para todos os players
		if(game.sprites.length !== 0){
			for(let i in game.sprites){
				let spr = game.sprites[i];
				if(spr.status === "VISIBLE"){
					ctx.drawImage(img,spr.sourceX,spr.sourceY,spr.width,spr.height,Math.floor(spr.x),Math.floor(spr.y),spr.width,spr.height);
				}
			}
		}
		//itens específicos de cada player
		if(game.players[0].sprites.length !== 0){
			for(let gameSprite in game.players[0].sprites){
				let sprEspecifico = game.players[0].sprites[gameSprite];
				if(sprEspecifico.status === "VISIBLE"){
					ctx.drawImage(img,sprEspecifico.sourceX,sprEspecifico.sourceY,sprEspecifico.width,sprEspecifico.height,Math.floor(sprEspecifico.x),Math.floor(sprEspecifico.y),sprEspecifico.width,sprEspecifico.height);
				}
			}
		}

		//show the text objects that are on game state now
		if(game.messages.length !== 0){
			for(let k in game.messages){
				let text = game.messages[k];
				if(text.status === "VISIBLE"){
					ctx.font = text.font;
					ctx.fillStyle = text.color;
					ctx.textBaseLine = text.baseline;
					ctx.fillText(text.text, text.x, text.y);
					if(text.end){
						text.x = (canvas.width - ctx.measureText(text.text).width)/2;
					}
				}
			}
		}
	
	}
	loop();
}());
