var JogarEmPedraDuzentosESetentaValorInferiorParaEsquerda = function() {}

JogarEmPedraDuzentosESetentaValorInferiorParaEsquerda.prototype.Jogar = function(pedra) {
console.log(this);
 return new JogadaSprite
 (
    pedra.sprite.phaserSprite.position.x - pedra.sprite.altura,
    pedra.sprite.phaserSprite.position.y,
    RotacaoSprite.DuzentosESetenta,
    pedra.sprite.phaserSprite.position.x - pedra.sprite.altura
 );
}
