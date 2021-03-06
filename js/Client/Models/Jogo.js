// Require MesaFactory
// Require Tela
// Require Mesa
// Require SpriteComprar
// Require SpritePassar
// Require MaoPrincipal

//Classe
var Jogo = function(gameId){
    this.jogador = null;
    this.jogadores = [];
    this.gameId = gameId;
    this.vez = false;
    this.iniciado = false;
    this.notificacao = new Notificacao().Configurar();
    this.tela = new Tela(new Mesa(), new SpriteComprar(), new SpriteQtdePedrasJogadores());
    this.socketClient = new SocketClient(this);
};

//Enviar Eventos
Jogo.prototype.AoCriarEstadoInicial = function(){
    this.socketClient.RegistrarEntrada(this.gameId);
};

Jogo.prototype.JogarPedra = function(pedra, moveType) {
    this.socketClient.RealizarJogada(this.gameId, pedra.valorSuperior, pedra.valorInferior, moveType);
};

//Métodos do Jogo
Jogo.prototype.PodeJogar = function(){
    return this.iniciado && this.vez;
};

Jogo.prototype.RegistrarEntrada = function(player) {
    var pedras = PedraFactory.CriarPedrasAPartirDoServer(player.dominoes);
    this.jogador = new Jogador(player.id, player.name, pedras);
    
    console.log("[JOGO] Jogador criado e registrado no Server.");

    this.TrocarEstadoParaPartida();
    this.IniciarPartida();
};


Jogo.prototype.AlterarEstado = function(state){
    this.iniciado = state === "STARTED";
};

Jogo.prototype.AlterarTurno = function(turns) {
    for(var i = 0; i < turns.length; i++) {
        if (this.jogador.id == turns[i].playerId) {
            this.vez = turns[i].turn;
        }
    }    
};

Jogo.prototype.MoverPedraParaMesa = function(domino, moveType) {
	var pedra = this.jogador.BuscarPedraPorValores(domino.value1, domino.value2);
    
    if (pedra != null) {
        this.tela.maoPrincipal.RemoverPedra(pedra, this.jogador);
    } else {
        pedra = PedraFactory.CriarPedra(domino.value1, domino.value2);
        pedra.sprite.CarregarSpritePhaser({x: this.tela.mesa.sprite.posicao.x, y: this.tela.mesa.sprite.posicao.y});
    }

    new TornarSpriteClicavel().Remover(pedra.sprite.phaserSprite);

    this.tela.mesa.JogarPedra(pedra, moveType);
    console.log("[JOGO] A pedra " + domino.value1 + "|" + domino.value2 + " foi jogada. MoveType: " + moveType);
};

Jogo.prototype.AdicionarPedra = function(domino) {	
    var pedra = PedraFactory.CriarPedra(domino.value1, domino.value2);
	this.jogador.AdicionarPedra(pedra);
	this.tela.maoPrincipal.AdicionarPedra(pedra, this.tela.tamanho);
};

Jogo.prototype.IniciarPartida = function(){
    console.log("[JOGO] Partida iniciada.");
    console.log("[JOGO] Jogador: ");
    console.log(this.jogador);
};

Jogo.prototype.AtualizarAreaDeCompra = function(size){
    this.tela.spriteComprar.AtualizarTexto(size);
};

// Troca de Estados
Jogo.prototype.TrocarEstadoParaPartida = function(){
    console.log("[JOGO] Carregando as pedras na tela...");
    game.state.start(new EstadoPrincipal(this).nome);
};

console.log("[JOGO] Objeto jogo criado.");

///---------------------------------------------------------------------------------Animação - Maiko ----------------------------------------------------------------------------
var backdom;
var bullets;
var bullet;
var qtdbullets;
var qtdbulletsatual;
var entrada;
var megalocal;

Jogo.prototype.AniEntrada = function(jogador){
    
    backdom = game.add.group();
    backdom.enableBody = true;
    backdom.physicsBodyType = Phaser.Physics.ARCADE;   
    qtdbullets = jogador.pedras.length;
    qtdbulletsatual =0;
    megalocal = {x:jogador.pedras[0].sprite.phaserSprite.x-170,y:jogador.pedras[0].sprite.phaserSprite.y-50};

    for(var i = 0; i < jogador.pedras.length; i++) {
       var c = game.add.sprite(jogador.pedras[i].sprite.phaserSprite.x,jogador.pedras[i].sprite.phaserSprite.y,'dominoback');
       c.nome = jogador.pedras[i].nome;
       backdom.add(c);
       
       this.AniMove(c,{x:this.tela.tamanho.largura/2,y:this.tela.tamanho.altura/2},null,0);  
       this.AniMove(jogador.pedras[i],{x:this.tela.tamanho.largura/2,y:this.tela.tamanho.altura/2},null,0);
    }

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 8; i++)
    {
        var b = bullets.create(0, 0, 'bullet');
        b.name = 'bullet' + i;
        b.exists = false;
        b.visible = false;
        b.checkWorldBounds = true;
        b.events.onOutOfBounds.add(resetBullet, this);
    }
    
    game.time.events.add(1500, megaman_entrada, this);
    
}

function megaman_entrada() {
    
    entrada = game.add.sprite(megalocal.x,0,'megaman');
    entrada.scale.setTo(2,2);
    entrada.animations.add('entada',[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]);

    var tween = game.add.tween(entrada,[1]);        
    tween.to( { x: megalocal.x, y: megalocal.y }, 500, Phaser.Easing.Sinusoidal.InOut, true);        

    tween.start();
    tween.onComplete.add(function() {
        entrada.animations.play('entada',10,false);
        entrada.events.onAnimationComplete.add(fireBullet,this);
    } );    
}

function fireBullet () {
    
        bullet = bullets.getFirstExists(false);
        qtdbulletsatual+=1;
        if (bullet)
        {
            bullet.reset(megalocal.x+110, megalocal.y+90);
            bullet.body.velocity.x = 300;            
        }
        
        if(qtdbulletsatual<qtdbullets){
            game.time.events.add(500, fireBullet);
        }
        else{
            var saida = game.add.sprite(megalocal.x,megalocal.y,'megaman');
            saida.scale.setTo(2,2);
            saida.animations.add('saida',[23,24,25,26,27,28,29,30,31,32]);
            saida.animations.play('saida',10,false);
            entrada.kill();
            saida.events.onAnimationComplete.add(function(){                
                var tween = game.add.tween(saida,[1]);        
                tween.to( { x: megalocal.x, y: -20 }, 500, Phaser.Easing.Sinusoidal.InOut, true); 
                tween.start();
                tween.onComplete.add(function() {saida.kill()});
            },this);
        }
        
}

//  Called if the bullet goes out of the screen
function resetBullet (bullet) {
    bullet.kill();
}

//  Called if the bullet hits one of the sprites
Jogo.prototype.collisionHandler =function  (bullet, backdom) {
       
    var explosion = this.add.sprite(bullet.x, bullet.y, 'explosion');
    bullet.kill(); 
    backdom.kill();
    explosion.anchor.setTo(0.5, 0.5);
    explosion.scale.setTo(2,2);
    explosion.animations.add('boom');
    explosion.play('boom', 15, false, true);
}


Jogo.prototype.AniMove=function (pedra, posini,posfim,tipomove) {
        
        if(pedra==null){return;}
        var stone;
        if(pedra.sprite==null){
            stone = pedra;
        }
        else{
            stone = pedra.sprite.phaserSprite;
        }        
        var inicial;
        var final;        
       
        if(posini!=null && posfim==null){
            inicial = {x:posini.x,y:posini.y};
            final =  {x:stone.x,y:stone.y};
            stone.x=inicial.x;
            stone.y=inicial.y;
        }        
        else{
            return;
        }
       
        var tween = game.add.tween(stone);        
        tween.to( { x: final.x, y: final.y }, 500, Phaser.Easing.Sinusoidal.InOut, true);        

        tween.start();

    };
	
	 var textwin;
    var aniwin;
    Jogo.prototype.PreFinalizarJogo = function(data){
            
            game.physics.startSystem(Phaser.Physics.ARCADE);

            textwin = game.add.bitmapText(-200, -200, 'desyrel', 'You Win', 64);
            aniwin = game.add.sprite(-250, -150, 'win');
            game.physics.arcade.enable([ textwin, aniwin ]);
            
    }
    Jogo.prototype.FinalizarJogo = function(data){
       
        if(this.jogador.id==data.player){ 

            textwin.x=200;
            textwin.y=120;
            textwin.body.velocity.setTo(200, -150);
            textwin.body.collideWorldBounds = true;
            textwin.body.bounce.set(1);            
            
            aniwin.x=250;
            aniwin.y=100;
            aniwin.z=99;
            aniwin.body.immovable = true;
            aniwin.scale.setTo(3,3);
            aniwin.animations.add('rock');
            aniwin.play('rock', 15, true, false);
        }
        else{
            var explosion = game.add.sprite(250, 150, 'explosion'); 
            explosion.scale.setTo(3,3);
            explosion.animations.add('boom');
            explosion.play('boom', 15, true, false);
        }

};

 Jogo.prototype.onCollidewin=function() {
    if(textwin.text=="You Win"){
        textwin.text = "Voce Venceu";
    }
    else{
        textwin.text = "You Win";
    }  

}

