var parede = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25],
    [50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50],
    [75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75],
    [100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
    [125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125],
    [150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150],
    [175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175],
    [200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200,200],
    [225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225,225],
    [250,250,250,250,250,250,250,250,250,250,250,250,250,250,250,250,250,250,250,250],
    [275,275,275,275,275,275,275,275,275,275,275,275,275,275,275,275,275,275,275,275],
    [300,300,300,300,300,300,300,300,300,300,300,300,300,300,300,300,300,300,300,300],
    [325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325,325],
    [350,350,350,350,350,350,350,350,350,350,350,350,350,350,350,350,350,350,350,350],
    [375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375,375],
    [400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400],
    [425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425],
    [450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450,450],
    [475,475,475,475,475,475,475,475,475,475,475,475,475,475,475,475,475,475,475,475],
];

var muro = [
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
    [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475],
];

var mapa = [
    [1,2,0,2,0,2,0,2,0,0,0,2,0,2,0,2,0,2,0,1],
    [0,0,0,0,0,0,0,3,1,0,3,0,0,0,0,0,0,0,0,0],
    [1,0,0,3,0,0,0,3,0,0,3,0,0,0,3,3,0,0,0,1],
    [0,0,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,3,3,3,0,0,3,0,0,0,0,1],
    [0,3,3,0,0,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0],
    [1,2,0,2,0,1,1,1,1,1,1,1,1,1,1,2,0,2,0,1],
    [0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,0],
    [0,3,0,1,3,0,0,0,3,3,3,3,3,0,3,0,0,0,0,0],
    [0,0,3,0,3,0,0,0,3,3,3,0,3,0,0,0,0,3,0,0],
    [1,0,0,1,0,0,2,0,2,0,2,0,2,0,2,0,1,0,0,1],
    [0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,3,3,1],
    [0,0,0,0,2,0,2,0,2,0,2,0,2,0,3,0,0,3,3,0],
    [1,0,0,1,1,1,1,1,1,3,0,3,3,3,0,0,0,0,0,1],
    [0,3,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,3,0,0],
    [1,3,0,2,0,2,0,2,0,0,0,2,0,2,0,2,0,3,3,1],
    [0,3,3,3,3,0,0,3,0,0,3,1,0,0,0,0,0,0,3,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [0,2,0,2,0,2,0,2,0,0,0,2,0,2,0,2,0,2,0,0],
];