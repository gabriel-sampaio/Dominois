var Tela = function(mesa, maoPrincipal, spriteComprar, spritePassar) {
    this.tamanho = {
        largura : 800,
        altura : 650
    };
    
    this.containerId = 'game';
    this.backgroundColor = "#FFF";
    
    this.mesa = mesa;	
    this.maoPrincipal = maoPrincipal;
    this.spriteComprar = spriteComprar;
    this.spritePassar = spritePassar;
};