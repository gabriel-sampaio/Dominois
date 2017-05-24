var TornarPedraClicavel = function() {}

TornarPedraClicavel.prototype.Tornar = function(jogo, pedra, opcoesJogada) {
	if (opcoesJogada.length == 0) {
		return new NenhumaOpcaoAJogarClick().Tornar(pedra);
	}
		
	if (opcoesJogada.length == 1) {
		return new JogarEmUnicaOpcaoClick().Tonar(jogo, pedra, opcoesJogada); 
	}
	
	return new EscolherEmQualOpcaoJogarClick().Tornar(pedra, opcoesJogada);
}