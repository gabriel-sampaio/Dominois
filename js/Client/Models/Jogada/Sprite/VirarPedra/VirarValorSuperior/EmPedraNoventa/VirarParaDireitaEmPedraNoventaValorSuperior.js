var VirarParaDireitaEmPedraNoventaValorSuperior = function() {}

VirarParaDireitaEmPedraNoventaValorSuperior.prototype.Jogar = function(pedra) {
	console.log(this);
	return new JogadaSprite
	(
		pedra.sprite.phaserSprite.position.x,
		pedra.sprite.phaserSprite.position.y + pedra.sprite.largura,
		RotacaoSprite.DuzentosESetenta
	);
}
