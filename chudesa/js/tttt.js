console.clear = () => {}
const even = n => !(n % 2);

// var TESTSYSTEM = true;

var app;
var isLoader = false;
var containerFront;
var frontObjectName;

var backgroundListTexture = null;
var audioList = null;

var timeLoadPage = new Date().getTime();

var backgroundList = _.cloneDeep(backgroundListDefault);
var appParam    = _.cloneDeep(appParamDefault);
var front       = _.cloneDeep(frontDefault);

initApp();

/**
 * Событие изменение размера окна
 */
 window.addEventListener("resize", resizeWindow);


/**
 * Инициализация спрайтов
 */
async function initSprite() {
    await front.forEach(element => {
        backgroundList[element.ID] = element.img.param.urlFrontImg
    });

    await PIXI.Assets.addBundle('background', backgroundList);
    await PIXI.Assets.loadBundle('background').then(
        (backgroundItems) => {
            backgroundListTexture = backgroundItems;
        }
    );
}

/**
 * Инициализация аудио
 */
async function initSound() {
    await PIXI.Assets.addBundle('sound', mainSoundList);
    await PIXI.Assets.loadBundle('sound').then(
        (audioItems) => {
            audioList = audioItems;
        }
    );
}

/**
 * Точка фхода
 */
function initApp() {

    // Выбор кантейнера
    const launchConvas = document.getElementById('launch-convas');
    
    // Создание сцены
    app = new PIXI.Application({
        view: launchConvas,
        antialiasing: true, 
        resolution: 1,
    });
    document.body.appendChild(app.view);

    Promise.all([
        initSprite(), // Инициализация спрайтов
        initSound(), // Инициализация аудио
        initBackgroundColorALL(), // Предварительная инициализация цветов
      ]).then(results => {
        initContainer(); // инициализация стартового контейнера
        loaderPageStop(); // Запуск программы
    });
}

/**
 * Инициализация контейнера
 * @param {*} actualFrontImage 
 */
function initContainer(actualFrontImage = appParam.actualFrontImage, isAnimating = false) {
    if(isLoader){




        polygonObjectRemove();

        containerFront.removeChild(front[appParam.actualFrontImage].img.obj);
        front[appParam.actualFrontImage].img.obj.destroy();
        front[appParam.actualFrontImage].img.obj = null;

        containerFront.width = window.innerWidth;
        containerFront.height = window.innerHeight;
        containerFront.position.set(0,0);

        appParam = _.cloneDeep(appParamDefault);
        front = _.cloneDeep(frontDefault);




        
    }else{
        // Создание контейнера
        containerFront = new PIXI.Container({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        app.stage.addChild(containerFront);
    }


    // Загрузка фона в контейнер
    front[actualFrontImage].img.obj = PIXI.Sprite.from(backgroundListTexture['scene_' + actualFrontImage]);
    containerFront.addChild(front[actualFrontImage].img.obj);

    appParam.actualFrontImage = actualFrontImage;

    resizeWindow('init');
    appSetBackgroundColor();
    initStartFunction();
}

/**
 * Функции для обработки
 */
function initStartFunction() {
    drawPolygonObject();


    // PIXI.sound.stopAll();
}

/**
 * Закончить загрузку
 */
function loaderPageStop () {
    isLoader = true;
    timeLoadPage = new Date().getTime() - timeLoadPage;

    if(timeLoadPage < appParam.timeLoaderMin){
        setTimeout(() => {
            resizeWindow();
            $('#loader').addClass('out');
        }, appParam.timeLoaderMin);
        setTimeout(() => {$('#loader').addClass('stop');console.log(1111111);}, appParam.timeLoaderMin + 500);
        
    }else{
        resizeWindow();
        $('#loader').addClass('out');
        setTimeout(() => {$('#loader').addClass('stop');console.log(22222222);}, appParam.timeLoaderMin + 500);
    }
    console.log('timeLoadPage: ' + timeLoadPage);
}

/**
 * Изменение размера рабочей области и контейнера
 */ 
function resizeWindow (status = null) {
    // Рендер сцены
    app.renderer.resize(window.innerWidth, window.innerHeight);

    if(appParam.setPositionFrontObject.isAction){
        addObjectBacFront();
    }

    // Изменение размеров и центовка контейнера
    // if(backgroundListTexture['scene_' + appParam.actualFrontImage].orig.width != 0 && backgroundListTexture['scene_' + appParam.actualFrontImage].orig.height != 0){
        resizeConteinerFront(status);
    // }else{
    //     // Получения оригинального размера фона
    //     var img = new Image();
    //     img.src = front[appParam.actualFrontImage].img.param.urlFrontImg;
    //     await img.onload = function() {
    //         backgroundListTexture['scene_' + appParam.actualFrontImage].orig.width            = this.width;
    //         backgroundListTexture['scene_' + appParam.actualFrontImage].orig.height           = this.height;
    //         frontDefault[appParam.actualFrontImage].img.param.width     = this.width;
    //         frontDefault[appParam.actualFrontImage].img.param.height    = this.height;
    //         await resizeConteinerFront(status);
    //     };
    // }
}

/**
 * Авто изменение размера контейнера
 */
function resizeConteinerFront (status = null) {

    if(!appParam.setPositionFrontObject.isAction){
        var frontImgRatioWidth           = backgroundListTexture['scene_' + appParam.actualFrontImage].orig.width / backgroundListTexture['scene_' + appParam.actualFrontImage].orig.height;
        var frontImgRatioHeight          = backgroundListTexture['scene_' + appParam.actualFrontImage].orig.height / backgroundListTexture['scene_' + appParam.actualFrontImage].orig.width;
        var windowRatio                  = window.innerWidth / window.innerHeight;
        var x = 0, y = 0;
    
        if(frontImgRatioWidth > windowRatio){
            // Подгоняем под ширину
            appParam.width      = window.innerWidth;
            appParam.height     = window.innerWidth * frontImgRatioHeight;

            y                       = (window.innerHeight - appParam.height) / 2;
        }else{
            // Подгоняем под высоту
            appParam.width      = window.innerHeight * frontImgRatioWidth;
            appParam.height     = window.innerHeight;
            x                       = (window.innerWidth - appParam.width) / 2;
        }
    
        if(status == 'init'){
            var position = front[appParam.actualFrontImage].img.param.positionInit;

            if(position != null){
                if(position == 'centre'){
                    x = window.innerWidth / 2 - appParam.width / 2;
                }else if(position == 'left'){
                    x = 0;
                }else if(position == 'right'){
                    x = window.innerWidth - appParam.width;
                }
            }
        }

        appParam.position.x     = x;
        appParam.position.y     = y;
    
        containerFront.position.set(x, y);
        
        containerFront.width    = appParam.width;
        containerFront.height   = appParam.height;
    }else{
        setSizeFrontObjectDefault(appParam.setPositionFrontObject.ID, appParam.setPositionFrontObject.position, appParam.setPositionFrontObject.padding, false, appParam.setPositionFrontObject.speedAnimation);
        setPositionFrontObjectToDefault(appParam.setPositionFrontObject.ID, appParam.setPositionFrontObject.position, appParam.setPositionFrontObject.centrePosition, false, appParam.setPositionFrontObject.speedAnimation);
    }
}
 
/**
 * Установка цвета заднего фона
 */
function appSetBackgroundColor () {
    var paramImg = front[appParam.actualFrontImage].img.param;
    // Установка фона в рабочей области
    if(paramImg.backgroundColor == null){
        RGBaster.colors(paramImg.urlFrontImg, {
            // Не учитывать белый цвет
            exclude: ['rgb(255,255,255)'],
            success: function(payload) {
                // Устанавливаем фоновый цвет равный самому популярному.
                var RGBA = payload.dominant;
                var RGB = RGBA.slice(4).slice(0, -1).split(',');
                var RGB16 = rgbToHex(RGB[0], RGB[1], RGB[2]);

                frontDefault[appParam.actualFrontImage].img.param.backgroundColor = {
                    RGBA: RGBA,
                    RGB16:RGB16,
                }

                document.body.style.background = RGBA;
                app.renderer.backgroundColor = RGB16;
            }
        });
    }else{
        // Устанавливаем предустановленный цвет
        document.body.style.background  = paramImg.backgroundColor.RGBA;
        app.renderer.background.color    = paramImg.backgroundColor.RGB16;
    }

}

/**
 * Предварительная инициализация всех цветов
 */
async function initBackgroundColorALL () {
    var count = frontDefault.length - 1;
    for (let index = 0; index <= count; index++) {
        const element = frontDefault[index].img.param;

        if(element.backgroundColor == null){
            RGBaster.colors(element.urlFrontImg, {
                // Не учитывать белый цвет
                exclude: ['rgb(255,255,255)'],
                success: function(payload) {

                    // Устанавливаем фоновый цвет равный самому популярному.
                    var RGBA = payload.dominant;
                    var RGB = RGBA.slice(4).slice(0, -1).split(',');
                    var RGB16 = rgbToHex(RGB[0], RGB[1], RGB[2]);

                    frontDefault[index].img.param.backgroundColor = {
                        RGBA: RGBA,
                        RGB16:RGB16,
                    }
                }
            });
        }

        if(index == count){
            front[appParam.actualFrontImage].img.param.backgroundColor = frontDefault[appParam.actualFrontImage].img.param.backgroundColor;
        }
    }
}

/**
 * Перевод формата RGB в HEX
 * @param {*} r 
 * @param {*} g 
 * @param {*} b 
 * @returns 
 */
function rgbToHex (r, g, b) {
  return "0x" + ((1 << 24) + (r << 16) + (g << 8) + (b << 0)).toString(16).slice(1);
}

/**
 * Отрисовка объектов на фоне
 */
function drawPolygonObject () {
    front[appParam.actualFrontImage].objects.forEach(element => {
        element.obj = new PIXI.Graphics();
        element.obj.lineStyle(0);
        element.obj.beginFill(element.fillColor ? element.fillColor : appParam.fillColorDefault, element.fillOpacity ? element.fillOpacity : appParam.fillOpacityDefault);
        element.obj.drawPolygon(element.path);
        element.obj.endFill();
        element.obj.interactive = true;
        element.obj.buttonMode = true;
        element.obj.alpha = element.alpha ? element.alpha : appParam.alphaDefault;
        element.obj.on('pointerdown',   (event) => polygonObjectOnClick(event, element.ID));
        element.obj.on('pointerover',   (event) => polygonObjectOnPointerOver(event, element.ID));
        element.obj.on('pointerout',    (event) => polygonObjectOnPointerOut(event, element.ID));
        element.obj.on('pointermove',   (event) => polygonObjectOnMove(event));
        
        containerFront.addChild(element.obj);

        mathCubeFrontObject(element);
    });
}

/**
 * Расчет крайних координат и размера объекта фона
 * @param {*} element 
 */
function mathCubeFrontObject(element) {
    var pathTemp = {x:[], y:[]};
    // Разделяем координаты на Х и Y
    for (n = 0; n < element.path.length; n++) {
        if (even(n)) {
            pathTemp.x.push(element.path[n]);
        }else{
            pathTemp.y.push(element.path[n]);
        }
    }

    // Крайние координаты объекта
    element.cube.path = {
        x1: Math.min.apply(null, pathTemp.x),
        x2: Math.max.apply(null, pathTemp.x),
        y1: Math.min.apply(null, pathTemp.y),
        y2: Math.max.apply(null, pathTemp.y),
    };

    element.cube.width   = element.cube.path.x2 - element.cube.path.x1;
    element.cube.height  = element.cube.path.y2 - element.cube.path.y1;
}

/**
 * Удалить объекты с фона
 * @param {*} ID 
 */
function polygonObjectRemove (ID = null){
    if(ID != null){
        front[appParam.actualFrontImage].objects[ID].obj.clear();
    }else{
        for (let index = 0; index < front[appParam.actualFrontImage].objects.length; index++) {
            if(front[appParam.actualFrontImage].objects[index].obj){
                containerFront.removeChild(front[appParam.actualFrontImage].objects[index].obj);
                front[appParam.actualFrontImage].objects[index].obj.clear();
            }
        }
        if(front[appParam.actualFrontImage].objectFront.obj){
            containerFront.removeChild(front[appParam.actualFrontImage].objectFront.obj);
            front[appParam.actualFrontImage].objectFront.obj.clear();
        }

        if(front[appParam.actualFrontImage].objectFront.objDual){
            containerFront.removeChild(front[appParam.actualFrontImage].objectFront.objDual);
            front[appParam.actualFrontImage].objectFront.objDual.clear();
        }
        
    }
}

/**
 * Вывод текста с названием объекта
 * @param {*} event
 * @param {int} ID - id объекта на фоне (0 - обводка)
 */
function polygonObjectOnPointerOver(event, ID) {
    var element = front[appParam.actualFrontImage].objects[ID];
    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 24,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff'], // gradient
        stroke: '#000',
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
    if(frontObjectName != null){
        app.stage.removeChild(frontObjectName);
        frontObjectName = null;
    }

    frontObjectName = new PIXI.Text(element.name, style);
    app.stage.addChild(frontObjectName);
    polygonObjectOnMove(event);

    front[appParam.actualFrontImage].objects[ID].obj.alpha = element.alphaOver ? element.alphaOver : appParam.alphaOverDefault;
}

/**
 * Удаление подписиь у объектов
 * @param {*} event 
 * @param {*} ID 
 */
function polygonObjectOnPointerOut(event, ID) {
    var element = front[appParam.actualFrontImage].objects[ID];
    app.stage.removeChild(frontObjectName);
    frontObjectName = null;
    front[appParam.actualFrontImage].objects[ID].obj.alpha = element.alpha ? element.alpha : appParam.alphaDefault;
}

/**
 * Измениение положения подписи у объектов за мышкой
 */
function polygonObjectOnMove(event) {
    if(frontObjectName != null){
        // var mouseCoords = app.renderer.plugins.interaction.mouse.global;
        frontObjectName.position.x = event.global.x + 10;
        frontObjectName.position.y = event.global.y + 10;
    }
}

/**
 * Событие при нажатии на объект
 * @param {*} event 
 * @param {int} ID id объекта на фоне
 */
function polygonObjectOnClick(event, ID) {
    var element             = front[appParam.actualFrontImage].objects[ID];
    var toPosition          = element.toPosition ? element.toPosition : appParam.toPositionDefault;
    var setPositionObject   = element.setPositionObject ? element.setPositionObject : appParam.setPositionObjectDefault;
    var padding             = element.padding ? element.padding : appParam.setPositionFrontObject.padding;
    var speedAnimation      = element.speedAnimation ? element.speedAnimation : appParam.setPositionFrontObject.speedAnimation;


    appParam.setPositionFrontObject.ID = ID;

    // Удалить текстовые подсказки
    polygonObjectOnPointerOut(event, ID);
    
    // Удалить все обекты фона
    polygonObjectRemove();

    // Нарисовать обводку объекта фона
    polygonObjectFront(ID);
        
    //Маштабирование объекта
    setSizeFrontObjectDefault(ID, toPosition, padding, element.isAnimating, speedAnimation);
 
    // Перемещение объекта
    setPositionFrontObjectToDefault(ID, toPosition, setPositionObject, element.isAnimating, speedAnimation);

    var callback = front[appParam.actualFrontImage].objects[ID].callback ? front[appParam.actualFrontImage].objects[ID].callback : (() => {});

    if(element.isAnimating){
        destroyAnimationTicker(callback);
        animating.obj.start();
    }else{
        callback();
    }
    
    appParam.setPositionFrontObject.isAction = true;
}

/**
 * Вохврат фона в исходное положение
 * @param {*} isAnimating 
 * @param {*} speedAnimation 
 */
function closePolygonObject(isAnimating = false, speedAnimation = appParam.setPositionFrontObject.speedAnimation) {
    var ID          = appParam.setPositionFrontObject.ID;

    setSizeFrontObjectStart(ID, isAnimating, speedAnimation);

    setPositionFrontObjectToStart(ID, isAnimating, speedAnimation);

    if (isAnimating) {
        destroyAnimationTicker((() => {
            polygonObjectRemove();
            initStartFunction();
        }));
        animating.obj.start();
    }else{
        polygonObjectRemove();
        initStartFunction();
    }

    appParam.setPositionFrontObject.isAction = false;
}

/**
 * Возврат положение в исходное состояние
 * @param {*} params 
 */
function setPositionFrontObjectToStart(ID, isAnimating = false, speedAnimation = appParam.setPositionFrontObject.speedAnimation) {
    var newX = appParam.setPositionFrontObject.positionXAction;
    var newY = appParam.setPositionFrontObject.positionYAction;

    if(isAnimating){
        setAnimationTicker(ID);

        var xTemp   = (newX - containerFront.x) / speedAnimation;
        var yTemp  = (newY - containerFront.y) / speedAnimation;

        animating.obj.add ((delta) => {
            containerFront.x    += xTemp * delta;
            containerFront.y   += yTemp * delta;

            if(newX >= 0){
                if(containerFront.x <= newX){
                    containerFront.x    = newX;
                    containerFront.y   = newY;
                    stopAnimationTicker(ID);
                }
            }else{
                if(containerFront.x >= newX){
                    containerFront.x    = newX;
                    containerFront.y   = newY;
                    stopAnimationTicker(ID);
                }
            }
        });
    }else{
        containerFront.x   = newX;
        containerFront.y   = newY;
    }
}

/**
 * Возврат размера в исходное состояние
 * @param {*} ID 
 * @param {*} isAnimating 
 * @param {*} speedAnimation 
 */
function setSizeFrontObjectStart(ID, isAnimating = false, speedAnimation = appParam.setPositionFrontObject.speedAnimation) {
    var newWidth    = appParam.setPositionFrontObject.widthAction;
    var newHeight   = appParam.setPositionFrontObject.heightAction;

    // Подгоняем под высоту
    if(isAnimating){
        setAnimationTicker(ID);

        var widthTemp   = (newWidth - containerFront.width) / speedAnimation;
        var heightTemp  = (newHeight - containerFront.height) / speedAnimation;

        animating.obj.add ((delta) => {
            containerFront.width    += widthTemp * delta;
            containerFront.height   += heightTemp * delta;

            if(containerFront.width <= newWidth){
                containerFront.width    = newWidth;
                containerFront.height   = newHeight;
                stopAnimationTicker(ID);
            }
        });
    }else{
        containerFront.width    = newWidth;
        containerFront.height   = newHeight;
    }
    appParam.width          = newWidth;
    appParam.height         = newHeight;

}





































/**
 * Отрисовка фона у объекта
 * @param {*} ID 
 */
function polygonObjectFront(ID) {
    var elementAction   = front[appParam.actualFrontImage].objects[ID];
    var elementFront    = front[appParam.actualFrontImage].objectFront;

    var fillColor       = elementAction.fillColorFront ? elementAction.fillColorFront : (elementFront.fillColor ? elementFront.fillColor : appParam.fillColorDefault);
    var fillOpacity     = elementAction.fillOpacityFront ? elementAction.fillOpacityFront : (elementFront.fillOpacity ? elementFront.fillOpacity : appParam.fillOpacityDefault);

    var pathTempEnd     = [0,0,0,backgroundListTexture['scene_' + appParam.actualFrontImage].orig.height,backgroundListTexture['scene_' + appParam.actualFrontImage].orig.width,backgroundListTexture['scene_' + appParam.actualFrontImage].orig.height,backgroundListTexture['scene_' + appParam.actualFrontImage].orig.width,0];

    front[appParam.actualFrontImage].objectFront.path = [...[0, 0], ...elementAction.path, ...[elementAction.path[0], elementAction.path[1]], ...pathTempEnd];

    front[appParam.actualFrontImage].objectFront.obj = new PIXI.Graphics();
    front[appParam.actualFrontImage].objectFront.obj.lineStyle(0);
    front[appParam.actualFrontImage].objectFront.obj.beginFill(fillColor, fillOpacity);
    front[appParam.actualFrontImage].objectFront.obj.drawPolygon(front[appParam.actualFrontImage].objectFront.path);

    front[appParam.actualFrontImage].objectFront.obj.endFill();
    front[appParam.actualFrontImage].objectFront.obj.zIndex = 25;
    
    const filter = new PIXI.Filter();
    front[appParam.actualFrontImage].objectFront.obj.filters = [filter];

    containerFront.addChild(front[appParam.actualFrontImage].objectFront.obj);






    




















    addObjectBacFront();
}

/**
 * Обновление размеров глобального затенения
 */
function addObjectBacFront() {
    var elementAction   = front[appParam.actualFrontImage].objects[appParam.setPositionFrontObject.ID];
    var elementFront    = front[appParam.actualFrontImage].objectFront;
    var fillColor       = elementAction.fillColorFront ? elementAction.fillColorFront : (elementFront.fillColor ? elementFront.fillColor : appParam.fillColorDefault);
    var fillOpacity     = elementAction.fillOpacityFront ? elementAction.fillOpacityFront : (elementFront.fillOpacity ? elementFront.fillOpacity : appParam.fillOpacityDefault);

    var isAdd           = false;

    if(front[appParam.actualFrontImage].objectFront.objDual){
        front[appParam.actualFrontImage].objectFront.objDual.clear();
    }else{
        front[appParam.actualFrontImage].objectFront.objDual = new PIXI.Graphics();
        isAdd = true;
    }

    front[appParam.actualFrontImage].objectFront.objDual.lineStyle(0);
    front[appParam.actualFrontImage].objectFront.objDual.beginFill(fillColor, fillOpacity);
    front[appParam.actualFrontImage].objectFront.objDual.drawPolygon([0,0,window.innerWidth,0,window.innerWidth,window.innerHeight,0,window.innerHeight]);
    front[appParam.actualFrontImage].objectFront.objDual.endFill();

    if(isAdd){
        app.stage.addChildAt(front[appParam.actualFrontImage].objectFront.objDual, 0);
    }
}


/**
 * Получение стандартных координат
 * @param {*} ID 
 * @param {*} position [centre, left, right]
 * @param {*} centrePosition [centre, leftTop, rightTop, leftCentre, rightCentre, leftBottom, rightBottom]
 */
function setPositionFrontObjectToDefault(ID, position = 'centre', centrePosition = 'centre', isAnimating = false, speedAnimation = 60) {
    var x = 0;
    var y = 0;

    if(position == 'centre'){
        x = window.innerWidth / 2;
        y = window.innerHeight / 2;
    }else if(position == 'left'){
        x = window.innerWidth / 100 * appParam.setPositionFrontObject.positionLeft / 2;
        y = window.innerHeight / 2;
    }else if(position == 'right'){
        x = window.innerWidth / 100 * (100 - appParam.setPositionFrontObject.positionRight / 2);
        y = window.innerHeight / 2;
    }

    appParam.setPositionFrontObject.ID              = ID;
    appParam.setPositionFrontObject.position        = position;
    appParam.setPositionFrontObject.centrePosition  = centrePosition;

    setPositionFrontObject(ID, x, y, centrePosition, isAnimating, speedAnimation);
}

/**
 * Переместить объект в заданные координаты
 * @param {*} ID 
 * @param {*} x 
 * @param {*} y 
 * @param {*} centrePosition [centre, leftTop, rightTop, leftCentre, rightCentre, leftBottom, rightBottom]
 */
function setPositionFrontObject(ID, x, y, centrePosition = 'centre', isAnimating = false, speedAnimation = 60) {
    appParam.setPositionFrontObject.ID              = ID;

    var cube            = front[appParam.actualFrontImage].objects[ID].cube;
    var scale           = (appParam.height / backgroundListTexture['scene_' + appParam.actualFrontImage].orig.height);
    var centre          = {x: 0, y: 0};

    if(centrePosition == 'centre'){
        centre.x = cube.width / 2;
        centre.y = cube.height / 2;
    }else if(centrePosition == 'leftTop'){
        centre.x = 0;
        centre.y = 0;
    }else if(centrePosition == 'rightTop'){
        centre.x = cube.width;
        centre.y = 0;
    }else if(centrePosition == 'leftCentre'){
        centre.x = 0;
        centre.y = cube.height / 2;
    }else if(centrePosition == 'rightCentre'){
        centre.x = cube.width;
        centre.y = cube.height / 2;
    }else if(centrePosition == 'leftBottom'){
        centre.x = 0;
        centre.y = cube.height;
    }else if(centrePosition == 'rightBottom'){
        centre.x = cube.width;
        centre.y = cube.height;
    }

    if(!appParam.setPositionFrontObject.isAction){
        appParam.setPositionFrontObject.positionXAction     = containerFront.x;
        appParam.setPositionFrontObject.positionYAction     = containerFront.y;
    }

    var newX = -(cube.path.x1 * scale + centre.x * scale - x);
    var newY = -(cube.path.y1 * scale + centre.y * scale - y);

    if(isAnimating){
        setAnimationTicker(ID);

        var xTemp   = (newX - containerFront.x) / speedAnimation;
        var yTemp  = (newY - containerFront.y) / speedAnimation;

        animating.obj.add ((delta) => {
            containerFront.x    += xTemp * delta;
            containerFront.y   += yTemp * delta;

            if(newX >= 0){
                if(containerFront.x >= newX){
                    containerFront.x    = newX;
                    containerFront.y   = newY;
                    stopAnimationTicker(ID);
                }
            }else{
                if(containerFront.x <= newX){
                    containerFront.x    = newX;
                    containerFront.y   = newY;
                    stopAnimationTicker(ID);
                }
            }


        });
    }else{
        containerFront.x    = newX;
        containerFront.y   = newY;
    }
}

/**
 * Подогнать размер объекта под габариты
 * @param {*} ID 
 * @param {*} position [centre, left, right]
 */
function setSizeFrontObjectDefault(ID, position, padding = 0, isAnimating = false, speedAnimation = 60) {
    var pos;
    var newWidth;
    var newHeight;

    var element = front[appParam.actualFrontImage].objects[ID];

    if(position == 'centre'){
        pos = 35;
    }else if(position == 'left'){
        pos = appParam.setPositionFrontObject.positionLeft;
    }else if(position == 'right'){
        pos = appParam.setPositionFrontObject.positionRight;
    }

    var scale           = (appParam.width / backgroundListTexture['scene_' + appParam.actualFrontImage].orig.width);
    var windowWidht     = window.innerWidth / 100 * pos;
    var windowHeight    = window.innerHeight;
    var contRatioWidth  = element.cube.width / element.cube.height;
    var windowRatio     = windowWidht / windowHeight;

    if(contRatioWidth > windowRatio){
        newWidth    = (containerFront.width * windowWidht) / (element.cube.width * scale) - padding;
        newHeight   = newWidth * containerFront.height / containerFront.width;
    }else{
        newHeight   = (containerFront.height * windowHeight) / (element.cube.height * scale) - padding;
        newWidth    = newHeight * containerFront.width / containerFront.height;
    }

    if(!appParam.setPositionFrontObject.isAction){
        appParam.setPositionFrontObject.widthAction  = appParam.width;
        appParam.setPositionFrontObject.heightAction = appParam.height;
    }

    // Подгоняем под высоту
    if(isAnimating){
        setAnimationTicker(ID);
        var widthTemp   = (newWidth - containerFront.width) / speedAnimation;
        var heightTemp  = (newHeight - containerFront.height) / speedAnimation;



        animating.obj.add ((delta) => {
            containerFront.width    += widthTemp * delta;
            containerFront.height   += heightTemp * delta;

            if(containerFront.width >= newWidth){
                containerFront.width    = newWidth;
                containerFront.height   = newHeight;
                stopAnimationTicker(ID);
            }
        });
    }else{
        containerFront.width    = newWidth;
        containerFront.height   = newHeight;
    }
    appParam.width          = newWidth;
    appParam.height         = newHeight;

}

/**
 * Добавить объхект анимации
 */
function setAnimationTicker(ID) {

    if(animating.obj == null){
        animating.obj = new PIXI.Ticker;
    }
    animating.item.push(ID);
}

function stopAnimationTicker(ID) {
    for (let index = 0; index < animating.item.length; index++) {
        const element = animating.item[index];
        if(element == ID){
            animating.item[index] = -1;
            break;
        }
    }
}

/**
 * Отключение анимации движения объектов
 * @param {*} ID 
 */
function destroyAnimationTicker(callback) {
    animating.obj.add ((delta) => {
        var isDestroy = true;
        for (let index = 0; index < animating.item.length; index++) {
            const element = animating.item[index];
            if(element != -1){
                isDestroy = false;
                break;
            }
        }

        if(isDestroy){
            animating.obj.destroy();
            animating.obj = null;
            animating.item = [];
            callback();
        }
    });
    
}

/**
 * Проверка существует ли функция
 * @param {*} functionToCheck 
 * @returns 
 */
function isFunction(functionToCheck)  {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}


























































// // Событие нажатие на объект
// function polygonObjectOnClick(event, ID) {
//     var object = objectElement[ID];
//     var positiomTemp = {
//         x: 0,
//         y: 0
//     };

//     polygonObjectRemove();


//     if(object.scale.y == 1){ 
//         scaleTemp = object.scale.x;
//         positiomTemp.y = (backgroundImages.sizeWindow.height - object.cobe.height * scaleTemp) / 2;
//     }else{
//         scaleTemp = object.scale.y;
//         positiomTemp.x = (backgroundImages.sizeWindow.maxWidth - object.cobe.width * scaleTemp) / 2;
//     }




// ///////////////////////////////////////////
//     var pathTemp        = [backgroundImages.position.x,backgroundImages.position.y];
//     var pethTempEdit    = object.pathActual;
//     var pathTempEnd     = [
//         backgroundImages.position.x,        backgroundImages.position.y,
//         backgroundImages.position.x,        backgroundImages.sizeActual.height + backgroundImages.position.y,
//         backgroundImages.sizeActual.width,  backgroundImages.sizeActual.height + backgroundImages.position.y,
//         backgroundImages.sizeActual.width,  backgroundImages.position.y ];



//     objectFov = new PIXI.Graphics();
//     objectFov.lineStyle(0);
//     objectFov.beginFill(0x000000, 0.7);
//     objectFov.drawPolygon([...pathTemp, ...pethTempEdit, ...[pethTempEdit[0], pethTempEdit[1]], ...pathTempEnd]);
//     objectFov.endFill();
//     app.stage.addChild(objectFov);

//     objectFov.scale.x = background.scale.x;
//     objectFov.scale.y = background.scale.y;
// ///////////////////////////////////////////








//     // ///////////////////////////////////////////
//     // var bullet_ticker = new PIXI.Ticker
//     // bullet_ticker.add ((delta) => anim (delta));
//     // bullet_ticker.start();
//     // ///////////////////////////////////////////


// console.log('background ' + background.x + ' ' + background.y);
// console.log('objectFov ' + objectFov.x + ' ' + objectFov.y);
// console.log('background.scale ' + background.scale.x + ' ' + background.scale.y);

// var x = -(object.cobe.path.x1 * scaleTemp + background.x * scaleTemp);
// var y = -(object.cobe.path.y1 * scaleTemp + background.y * scaleTemp);

// background.scale.x *= scaleTemp;
// background.scale.y *= scaleTemp;

// objectFov.scale.x *= scaleTemp;
// objectFov.scale.y *= scaleTemp;


// background.x = x;
// background.y = y;

// objectFov.x = x;
// objectFov.y = y;

// console.log('==============================');

// console.log('background ' + background.x + ' ' + background.y);
// console.log('objectFov ' + objectFov.x + ' ' + objectFov.y);
// console.log('background.scale ' + background.scale.x + ' ' + background.scale.y);


// // function anim (delta){
// //     // // console.log(app.ticker.FPS);
// //     // // console.log(xTemp++);
// //     // let today = new Date();
// //     // let milliseconds = today.getMilliseconds();
// //     // console.log(delta + ' ' + app.ticker.FPS + ' ' + xTemp++ +' '+ milliseconds ); // 709

// //     var speed = bullet_ticker.FPS;



// //         background.scale.x = background.scale.x;
// //         background.scale.y = background.scale.x;

// //         objectFov.scale.x = background.scale.x;
// //         objectFov.scale.y = background.scale.x;


// //         background.x = x;
// //         background.y = y;

// //         objectFov.x = x;
// //         objectFov.y = y;
    

// //     // if(stop.scale == 2 && stop.x == 2 && stop.y == 2){
// //     //     console.log(1111111111111111111111);
// //         bullet_ticker.destroy()
// //     // }
// // }



//     // background.scale.x *= scaleTemp;
//     // background.scale.y *= scaleTemp;
//     // background.x = -(object.cobe.path.x1 * scaleTemp - backgroundImages.position.x * scaleTemp - positiomTemp.x);
//     // background.y = -(object.cobe.path.y1 * scaleTemp - backgroundImages.position.y * scaleTemp - positiomTemp.y);

   
// }















































