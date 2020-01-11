function collide(s1, s2){
    var hit = false;

    //calcular distância entre os centros dos sprites
    var vetX = s1.centerX() - s2.centerX();
    var vetY = s1.centerY() - s2.centerY();

    //armazenar somas das metades dos sprites em largura e altura
    var sumHalfWidth = s1.halfWidth() + s2.halfWidth();
    var sumHalfHeight = s1.halfHeight() + s2.halfHeight();
    
    //verifica se houve colisão
    if(Math.abs(vetX) < sumHalfWidth && Math.abs(vetY) < sumHalfHeight){
        hit = true;
    }
    return hit;
}

//collide somente no eixo x 
function collideX(s1, s2){
    var hit = false;

    //calcular distância entre os centros dos sprites
    var vetX = s1.centerX() - s2.centerX();

    //armazenar somas das metades dos sprites em largura e altura
    var sumHalfWidth = s1.halfWidth() + s2.halfWidth();
    
    //verifica se houve colisão
    if(Math.abs(vetX) < sumHalfWidth){
        hit = true;
    }
    return hit;
}


//collide somente no eixo y
function collideY(s1, s2){
    var hit = false;

    //calcular distância entre os centros dos sprites
    var vetY = s1.centerY() - s2.centerY();

    //armazenar somas das metades dos sprites em largura e altura
    
    var sumHalfHeight = s1.halfHeight() + s2.halfHeight();
    
    //verifica se houve colisão
    if(Math.abs(vetY) < sumHalfHeight){
        hit = true;
    }
    return hit;
}