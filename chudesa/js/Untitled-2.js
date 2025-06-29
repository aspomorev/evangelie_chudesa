console.clear = () => {}
const even = n => !(n % 2);


var backgroundImages = {
    url: 'img/test.jpg',
    // url: 'img/background.jpg',
    // url: 'img/Videnie_otroku_Varfolomeyu.jpg',

    
    color: '',
    position: {
        x: 0,
        y: 0
    },
    size: {
        width: 0,
        height: 0
    },
    sizeActual: {
        width: 0,
        height: 0
    },
    sizeWindow: {
        width: 0,
        height: 0,
        maxWidth: 0
    }
};

var objectElement = [
    {
        ID: 0,
        path: [127,105,422,105,422,400,127,400],
        // path: [209,94,214,86,218,79,224,74,228,72,235,71,243,72,249,76,253,81,255,86,255,92,253,98,252,102,252,110,250,115,248,118,248,121,250,122,253,124,260,126,268,127,284,132,287,134,292,135,298,133,302,133,306,130,307,128,310,128,317,126,327,120,330,120,332,119,332,116,334,113,338,109,340,106,344,103,350,97,354,95,355,96,354,98,351,101,349,103,347,105,350,104,354,103,357,102,362,101,364,102,365,102,358,105,365,106,364,108,356,109,353,111,362,112,361,114,355,114,352,116,351,116,346,121,344,124,340,126,340,129,342,131,342,134,341,137,339,137,340,140,318,158,308,154,306,153,300,157,270,153,270,164,268,179,267,206,268,209,269,204,272,197,275,192,278,192,278,195,277,198,278,202,281,209,281,214,277,219,272,221,271,221,277,221,279,225,279,228,277,231,274,234,276,235,278,240,280,243,281,248,282,255,287,266,278,269,283,283,289,308,290,319,280,320,276,344,276,346,267,349,265,364,263,374,260,386,258,393,259,395,258,399,260,402,260,409,261,411,262,414,265,417,268,419,268,423,266,432,263,433,258,432,254,430,250,426,248,425,245,427,235,426,235,410,237,404,239,397,241,373,243,350,239,346,245,328,249,318,245,309,239,299,236,322,237,347,227,350,227,357,224,365,221,378,219,393,218,397,217,406,217,409,218,414,219,417,223,418,222,421,233,430,221,428,209,426,202,425,196,423,195,422,195,420,197,416,199,412,199,402,199,392,200,383,200,372,202,363,204,355,205,352,197,348,196,346,203,334,206,325,197,326,188,325,182,326,176,325,171,324,163,325,160,324,159,321,161,315,166,302,174,287,181,273,188,259,182,258,185,253,188,248,191,244,198,235,209,209,208,191,205,172,191,190,190,194,177,207,179,208,181,210,181,213,176,217,170,222,165,227,162,232,150,231,148,233,146,234,144,236,140,238,137,231,135,229,132,228,130,228,128,231,128,233,130,234,132,234,134,235,134,238,135,241,135,246,135,248,133,247,132,244,129,243,129,239,127,239,127,236,125,235,124,231,125,228,129,226,132,223,140,221,141,217,149,206,158,193,163,193,168,186,171,181,175,177,179,170,184,159,185,156,188,154,189,149,193,141,197,136,200,134,214,127,217,126,223,121,225,116,220,117,215,117,210,115,206,114,204,111,204,108,207,106,210,105,208,103,207,99,209,95],
        pathActual: [],
        scale: {
            x: 1,
            y: 1
        },
        name: '11111111111111111111',
        text: '111111111111111111111111',
        fill: { 
            color: '0xff0000', 
            opacity: 0.1
        },
        cobe: {
            width: 0,
            height: 0,
            path: {x1:0,x2:0,y1:0,y2:0}
        },
        obj: null
    },
    {
        ID: 1,
        path: [502,105,797,105,797,754,502,754],
        pathActual: [],
        scale: {
            x: 1,
            y: 1
        },
        name: '2222222222222222',
        text: '111111111111111111111111',
        fill: { 
            color: '0xff0000', 
            opacity: 0.3
        },
        cobe: {
            width: 0,
            height: 0,
            path: {x1:0,x2:0,y1:0,y2:0}
        },
        obj: null
    },
    {
        ID: 2,
        path: [502,459,797,459,797,754,502,754],
        pathActual: [],
        scale: {
            x: 1,
            y: 1
        },
        name: '3333333333',
        text: '111111111111111111111111',
        fill: { 
            color: '0xff0000', 
            opacity: 0.3
        },
        cobe: {
            width: 0,
            height: 0,
            path: {x1:0,x2:0,y1:0,y2:0}
        },
        obj: null
    },
];

var app;
var background;
var tuchText;
var objectFov;


var graphics;

// Точка входа
runApp();


// Событие изменение размеров экрана
window.addEventListener("resize", resizeWindow);


// Точка входа
function runApp() {
    const launchConvas = document.getElementById('launch-convas');
    
    // Создание сцены
    app = new PIXI.Application({
        view: launchConvas
    });
    document.body.appendChild(app.view);

 

    // Добавление фона
    background = PIXI.Sprite.from(backgroundImages.url);
    app.stage.addChild(background);
    

    // Установка фона в рабочей области
    if(backgroundImages.color == ''){
        RGBaster.colors(backgroundImages.url, {
            // Не учитывать белый цвет
            // exclude: ['rgb(255,255,255)'],
            success: function(payload) {
            // Устанавливаем фоновый цвет равный самому популярному.
            document.body.style.background = payload.dominant;
            }
        });
    }else{
        // Устанавливаем предустановленный цвет
        document.body.style.background = backgroundImages.color;
    }

    drawPolygonObject();

    resizeWindow();
    // app.ticker.add(updateText);
}   

function resizeWindow() {
    if(backgroundImages.size.width != 0 && backgroundImages.size.height != 0){
        resizeAll(window.innerWidth, window.innerHeight);
    }else{
        // Получения оригинального размера фона
        var img = new Image();
        img.onload = function() {
            backgroundImages.size = {
                width: this.width,
                height: this.height
            };
            resizeAll(window.innerWidth, window.innerHeight);
        };
        img.src = backgroundImages.url;
    }
}

function resizeAll(windowWidth, windowHeight) {
    backgroundImages.sizeWindow = {
        width: windowWidth,
        height: windowHeight
    };

    var backgroundImagesRatioWidth   = backgroundImages.size.width / backgroundImages.size.height;
    var backgroundImagesRatioHeight  = backgroundImages.size.height / backgroundImages.size.width;
    var windowRatio                  = windowWidth / windowHeight;

    if(backgroundImagesRatioWidth > windowRatio){
        // Подгоняем под ширину
        backgroundImages.sizeActual.width   = windowWidth;
        backgroundImages.sizeActual.height  = windowWidth * backgroundImagesRatioHeight;
        backgroundImages.position.x         = 0;
        backgroundImages.position.y         = (windowHeight - backgroundImages.sizeActual.height) / 2;
    }else{
        // Подгоняем под высоту
        backgroundImages.sizeActual.width   = windowHeight * backgroundImagesRatioWidth;
        backgroundImages.sizeActual.height  = windowHeight
        backgroundImages.position.x         = (windowWidth - backgroundImages.sizeActual.width) / 2;
        backgroundImages.position.y         = 0;
    }

    // Размер рабочей области
    app.renderer.resize(windowWidth, windowHeight);
    if(objectFov){
        objectFov.clear();
    }

    // Размер фона
    background.width    = backgroundImages.sizeActual.width;
    background.height   = backgroundImages.sizeActual.height;
    background.x        = backgroundImages.position.x;
    background.y        = backgroundImages.position.y;
    
    // Размер объектов на фото
    for (let index = 0; index < objectElement.length; index++) {
        var pathTemp        = 0;
        var path            = objectElement[index].path;
        objectElement[index].pathActual = [];
        var pathComponent   = {
            x: [],
            y: []
        };

        // Разделяем координаты на Х и Y
        for (n = 0; n < path.length; n++) {
            if (even(n)) {
                pathTemp = backgroundImages.sizeActual.width / backgroundImages.size.width * path[n] + backgroundImages.position.x;
                pathComponent.x.push(pathTemp);
                objectElement[index].pathActual.push(pathTemp);
            } else {
                pathTemp = backgroundImages.sizeActual.height / backgroundImages.size.height * path[n] + backgroundImages.position.y;
                pathComponent.y.push(pathTemp);
                objectElement[index].pathActual.push(pathTemp);
            }
        }

        // Крайние координаты объекта
        objectElement[index].cobe.path = {
            x1: Math.min.apply(null, pathComponent.x),
            x2: Math.max.apply(null, pathComponent.x),
            y1: Math.min.apply(null, pathComponent.y),
            y2: Math.max.apply(null, pathComponent.y),
        }

        objectElement[index].cobe.width   = objectElement[index].cobe.path.x2 - objectElement[index].cobe.path.x1;
        objectElement[index].cobe.height  = objectElement[index].cobe.path.y2 - objectElement[index].cobe.path.y1;

        backgroundImages.sizeWindow.maxWidth = windowWidth / 100 * 40;

        objectElement[index].scale.x = backgroundImages.sizeWindow.maxWidth / objectElement[index].cobe.width;

        if(objectElement[index].cobe.height * objectElement[index].scale.x > windowHeight){
            objectElement[index].scale.y = windowHeight / objectElement[index].cobe.height;
        }

        objectElement[index].obj.clear();
        objectElement[index].obj.lineStyle(0);
        objectElement[index].obj.beginFill(objectElement[index].fill.color, objectElement[index].fill.opacity);
        objectElement[index].obj.drawPolygon(objectElement[index].pathActual);
        objectElement[index].obj.endFill();
    }
}

// Отрисовка объектов на фото
function drawPolygonObject () {
    for (let index = 0; index < objectElement.length; index++) {
        objectElement[index].obj = new PIXI.Graphics();
        objectElement[index].obj.lineStyle(0);
        objectElement[index].obj.beginFill(objectElement[index].fill.color, objectElement[index].fill.opacity);
        objectElement[index].obj.drawPolygon(objectElement[index].path);
        objectElement[index].obj.endFill();
        objectElement[index].obj.interactive = true;
        objectElement[index].obj.buttonMode = true;
        objectElement[index].obj.on('pointerdown', (event) => polygonObjectOnClick(event, objectElement[index].ID));
        objectElement[index].obj.on('mouseover', (event) => polygonObjectOnOver(event, objectElement[index].ID));
        objectElement[index].obj.on('pointerover', (event) => polygonObjectOnPointerOver(event, objectElement[index].ID));
        objectElement[index].obj.on('pointerout', (event) => polygonObjectOnPointerOut(event, objectElement[index].ID));
        
        app.stage.addChild(objectElement[index].obj);
    }
}

// Событие нажатие на объект
function polygonObjectOnClick(event, ID) {
    var object = objectElement[ID];
    var positiomTemp = {
        x: 0,
        y: 0
    };

    for (let index = 0; index < objectElement.length; index++) {
        objectElement[index].obj.clear();
    }


    if(object.scale.y == 1){ 
        scaleTemp = object.scale.x;
        positiomTemp.y = (backgroundImages.sizeWindow.height - object.cobe.height * scaleTemp) / 2;
    }else{
        scaleTemp = object.scale.y;
        positiomTemp.x = (backgroundImages.sizeWindow.maxWidth - object.cobe.width * scaleTemp) / 2;
    }



    var caleTemp = background.scale.x;
    var caleTemp2 = background.scale.x * scaleTemp;


var bullet_ticker = new PIXI.Ticker
bullet_ticker.add ((delta) => anim (delta));
bullet_ticker.start();

var x = -(object.cobe.path.x1 * scaleTemp - backgroundImages.position.x * scaleTemp - positiomTemp.x);
var y = -(object.cobe.path.y1 * scaleTemp - backgroundImages.position.y * scaleTemp - positiomTemp.y);

var xTemp = 0;
var yTemp = 0;
var stop = {
    scale: -1,
    x: -1,
    y: -1
};

function anim (delta){
    // // console.log(app.ticker.FPS);
    // // console.log(xTemp++);
    // let today = new Date();
    // let milliseconds = today.getMilliseconds();
    // console.log(delta + ' ' + app.ticker.FPS + ' ' + xTemp++ +' '+ milliseconds ); // 709

    var speed = bullet_ticker.FPS;



    if((stop.scale == -1 || stop.scale == 0) && caleTemp < caleTemp2){
        stop.scale = stop.scale == -1 ? 0 : stop.scale;

        caleTemp += (caleTemp2 / speed);
        background.scale.x = caleTemp > caleTemp2 ? caleTemp2 : caleTemp;
        background.scale.y = caleTemp > caleTemp2 ? caleTemp2 : caleTemp;
    }else if((stop.scale == -1 || stop.scale == 1) && caleTemp > caleTemp2){
        stop.scale = stop.scale == -1 ? 1 : stop.scale;

        caleTemp += (caleTemp2 / speed);
        background.scale.x = caleTemp > caleTemp2 ? caleTemp2 : caleTemp;
        background.scale.y = caleTemp > caleTemp2 ? caleTemp2 : caleTemp;
    }else{
        stop.scale = 2;
        background.scale.x = caleTemp2;
        background.scale.y = caleTemp2;
    }






    if((stop.x == -1 || stop.x == 0) && x < xTemp){
        stop.x = stop.x == -1 ? 0 : stop.x;
        xTemp += (x / speed);
        background.x = xTemp > x ? xTemp : x;
    }else if((stop.x == -1 || stop.x == 1) && x > xTemp){
        stop.x = stop.x == -1 ? 1 : stop.x;


        xTemp += (x / speed);
        background.x = xTemp > x ? xTemp : x;
    }else{
        stop.x = 2;
        background.x = x;
    }







    if((stop.y == -1 || stop.y == 0) && y < yTemp){
        stop.y = stop.y == -1 ? 0 : stop.y;

        
        yTemp += (y / speed);
        background.y = yTemp > y ? yTemp : y;
    }else if((stop.y == -1 || stop.y == 1) && y > yTemp){
        stop.y = stop.y == -1 ? 1 : stop.y;
        yTemp += (y / speed);
        background.y = yTemp > y ? yTemp : y;
    }else{
        stop.y = 2;
        background.y = y;
    }
    

    if(stop.scale == 2 && stop.x == 2 && stop.y == 2){
        console.log(1111111111111111111111);
        bullet_ticker.destroy()
    }
}



    // background.scale.x *= scaleTemp;
    // background.scale.y *= scaleTemp;
    // background.x = -(object.cobe.path.x1 * scaleTemp - backgroundImages.position.x * scaleTemp - positiomTemp.x);
    // background.y = -(object.cobe.path.y1 * scaleTemp - backgroundImages.position.y * scaleTemp - positiomTemp.y);

    var pathTemp        = [0,0];
    var pathTempEnd     = [0,0,0,backgroundImages.sizeWindow.height,backgroundImages.sizeWindow.width,backgroundImages.sizeWindow.height,backgroundImages.sizeWindow.width,0];
    var pethTempEdit    = object.pathActual;

    for (let index = 0; index < pethTempEdit.length; index++) {

        var errorX = 0;
        var errorY = 0;

        if(backgroundImages.position.x == 0){ 
            errorX = backgroundImages.position.x * scaleTemp;
        }

        if(backgroundImages.position.y == 0){ 
            errorY = backgroundImages.position.y * scaleTemp;
        }
        
        if (even(index)) {
            pethTempEdit[index] = pethTempEdit[index] * scaleTemp - object.cobe.path.x1 * scaleTemp + errorX + positiomTemp.x;
        }else{
            pethTempEdit[index] = pethTempEdit[index] * scaleTemp - object.cobe.path.y1 * scaleTemp + errorY + positiomTemp.y;
        }
    } 

    objectFov = new PIXI.Graphics();
    objectFov.lineStyle(0);
    objectFov.beginFill(0x000000, 0.7);
    objectFov.drawPolygon([...pathTemp, ...pethTempEdit, ...[pethTempEdit[0], pethTempEdit[1]], ...pathTempEnd]);
    objectFov.endFill();
    app.stage.addChild(objectFov);
}

// Событие появления курсора мыши
function polygonObjectOnPointerOver(event, ID) {
    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 24,
        fontStyle: 'italic',
        // fontWeight: 'bold',
        fill: ['#ffffff'], // gradient
        // stroke: '#000',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
        lineJoin: 'round',
    });
    
    tuchText = new PIXI.Text(objectElement[ID].name, style);
    app.stage.addChild(tuchText);
}

// Событие покидания курсора мыши
function polygonObjectOnPointerOut() {
    app.stage.removeChild(tuchText);
}

// Событие движение по объекту
function polygonObjectOnOver(event) {
    app.ticker.add(() => {
        tuchText.position.copyFrom(event.data.global);
    });
}