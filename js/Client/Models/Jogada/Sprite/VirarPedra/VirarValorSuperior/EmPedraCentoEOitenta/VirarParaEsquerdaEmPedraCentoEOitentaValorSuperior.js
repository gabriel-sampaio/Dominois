var VirarParaEsquerdaEmPedraCentoEOitentaValorSuperior = function() {}

VirarParaEsquerdaEmPedraCentoEOitentaValorSuperior.prototype.Jogar = function(pedra) {
	console.log(this);
	return new JogadaSprite
	(
		pedra.sprite.phaserSprite.position.x - pedra.sprite.largura,
		pedra.sprite.phaserSprite.position.y - 2*pedra.sprite.largura + 5,
		RotacaoSprite.Noventa
	);
}
