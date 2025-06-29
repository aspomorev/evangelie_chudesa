console.clear = () => {};
const even = (n) => !(n % 2);

var timeLoadPage = new Date().getTime();

// var TESTSYSTEM = true;

var app;
var isLoader = false;
var sceneConteiner = [];
var containerFront = [];
var frontObjectName;

var backgroundListTexture = null;
var fontsList = null;

var backgroundList = _.cloneDeep(backgroundListDefault);
var imgList = _.cloneDeep(imgListDefault);
var appParam = _.cloneDeep(appParamDefault);
var front = _.cloneDeep(frontDefault);
var historyPrev = new historiStackPrev();
var historyNext = new historiStackNext();

var sceneConteinerAll = null;
var isMenu = false;
var isObjectOne = false;

initApp();

/**
 * Событие изменение размера окна
 */
window.addEventListener("resize", resizeWindow);

$("#history-prev").on("click", historiPrev);
$("#history-next").on("click", historiNext);

/**
 * Инициализация спрайтов
 */
async function initSprite() {
  await front.forEach((element) => {
    backgroundList[element.ID] =
      element.img.param.urlFrontImg + "?" + new Date().getTime();
  });

  await PIXI.Assets.addBundle("background", backgroundList);
  await PIXI.Assets.loadBundle("background").then((backgroundItems) => {
    backgroundListTexture = backgroundItems;
    // },
    // () => {
    // Promise.all([
    //     initSprite()
    // ]).then(results => {
    //     console.log('Ошибка исправленна');
    // });
  });
}

/**
 * Инициализация аудио
 */
async function initSound(SoundList) {
  if (typeof SoundList === "string") {
    let obj = {};
    obj[SoundList] = mainSoundList[SoundList];
    await PIXI.Assets.addBundle("sound", obj);
    await PIXI.Assets.loadBundle("sound").then((audioItems) => {
      Object.assign(audioList, audioItems);
      // console.log(audioList);
    });
  }

  if (typeof SoundList === "object") {
    await PIXI.Assets.addBundle("sound", SoundList);
    await PIXI.Assets.loadBundle("sound").then((audioItems) => {
      Object.assign(audioList, audioItems);
      // console.log(audioList);
    });
  }
}

/**
 * Инициализация шрифтов
 */
async function initFont() {
  var observersFont = [];

  await Object.keys(fontDefault).forEach(function (family) {
    var data = fontDefault[family];
    var obs = new FontFaceObserver(family, data);
    observersFont.push(obs.load());
  });

  await Promise.all(observersFont).then((fonts) => {
    fontsList = fonts;
  });
}

async function initImg() {
  var countIN = imgList.length;

  var count = frontDefault.length;
  // var URL = window.location.protocol + '//' + window.location.host + window.location.pathname;

  for (let i = 0; i < count; i++) {
    const element = frontDefault[i];
    imgList[countIN] = element.img.param.background.img;

    for (let j = 0; j < element.objects.length; j++) {
      if (element.objects[j].backgroundText) {
        var temp = element.objects[j].backgroundText;
        if (imgList.indexOf(temp) == -1) {
          imgList[countIN] = temp;
          countIN++;
        }
      }
      if (element.objects[j].background) {
        var temp = element.objects[j].background;
        if (imgList.indexOf(temp) == -1) {
          imgList[countIN] = temp;
          countIN++;
        }
      }
      if (element.objects[j].img) {
        var temp = element.objects[j].img;
        if (imgList.indexOf(temp) == -1) {
          imgList[countIN] = temp;
          countIN++;
        }
      }
      if (element.objects[j].tabVideo) {
        for (let k = 0; k < element.objects[j].tabVideo.length; k++) {
          var temp = element.objects[j].tabVideo[k].img;
          if (imgList.indexOf(temp) == -1) {
            imgList[countIN] = temp;
            countIN++;
          }
        }
      }
    }

    countIN++;
  }

  await imgList.forEach((element) => {
    var img = new Image();
    img.src = element;
  });
}

/**
 * Точка фхода
 */
function initApp() {
  if (localStorage.getItem("reload")) {
    if (localStorage.getItem("reload") >= 10) {
      $("#LoadTextDemo").html(
        '<span style="color:#ff0000">Нажмите Ctrl + F5</span>'
      );
    } else if (localStorage.getItem("reload") == 0) {
      $("#LoadTextDemo").html("Подключение...");
    } else {
      $("#LoadTextDemo").html(
        "Попытка подключения " + localStorage.getItem("reload")
      );
    }
  } else {
    localStorage.setItem("reload", 0);
  }

  // Создание сцены
  app = new PIXI.Application({
    backgroundAlpha: 0,
    view: document.getElementById("launch-convas"),
    antialiasing: true,
    resolution: 1,
  });
  // document.body.appendChild(app.view);

  $("#LoadTextDemo").html("Загрузка фото-видео материала");
  initImg()
    .then((results) => {
      console.log("initImg");
      $("#LoadTextDemo").html("Загрузка полотен");
      initSprite()
        .then((results) => {
          console.log("initSprite");
          $("#LoadTextDemo").html("Загрузка шрифтов");
          initFont()
            .then((results) => {
              console.log("initFont");
              $("#LoadTextDemo").html("Загрузка аудио материала");
              initSound(mainSoundList["system"])
                .then((results) => {
                  console.log("initSound");
                  $("#LoadTextDemo").html("Анализ полученных материалов");
                  initBackgroundColorALL()
                    .then((results) => {
                      console.log("initBackgroundColorALL");
                      // localStorage.setItem('reload', 0);

                      // if()
                      // appParam.actualFrontImage
                      var initConURL = get("page");

                      if (
                        typeof initConURL === "string" &&
                        $.isNumeric(initConURL)
                      ) {
                        appParam.actualFrontImage = parseInt(initConURL);
                      }

                      initContainer(
                        appParam.actualFrontImage,
                        false,
                        front[appParam.actualFrontImage].img.callback
                      ); // инициализация стартового контейнера
                      loaderPageStop(); // Запуск программы
                    })
                    .catch(function (err) {
                      $("#LoadTextDemo").html(
                        'Ошибка анализа полученных материалов <br> <b style="color:#ff0000">Ctrl + F5</b>'
                      );
                    });
                })
                .catch(function (err) {
                  $("#LoadTextDemo").html(
                    'Ошибка загрузки аудио материалов <br> <b style="color:#ff0000">Ctrl + F5</b>'
                  );
                });
            })
            .catch(function (err) {
              $("#LoadTextDemo").html(
                'Ошибка загрузки шрифтов <br> <b style="color:#ff0000">Ctrl + F5</b>'
              );
            });
        })
        .catch(function (err) {
          $("#LoadTextDemo").html(
            'Ошибка загрузки полотен <br> <b style="color:#ff0000">Ctrl + F5</b>'
          );
        });
    })
    .catch(function (err) {
      $("#LoadTextDemo").html(
        'Ошибка загрузки фото-видео материалов <br> <b style="color:#ff0000">Ctrl + F5</b>'
      );
    });

  // Promise.all([
  //     initSprite(), // Инициализация спрайтов
  //     initSound(), // Инициализация аудио
  //     initFont(), // Инициализация шрифтов
  //     initBackgroundColorALL(), // Предварительная инициализация цветов
  //     initImg(), // Инициализация фото
  //   ]).then(results => {
  //     localStorage.setItem('reload', 0);
  //     initContainer(appParam.actualFrontImage, false, front[appParam.actualFrontImage].img.callback); // инициализация стартового контейнера
  //     loaderPageStop(); // Запуск программы
  // }).catch(function(err) {
  //     console.log('-= Перезагрузка =- ' + err.stack );

  //     //URLs starting with http://, https://, or ftp://
  //     var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  //     var urll = replacePattern1.exec(err.message)[0];
  //     console.log(urll);

  //     var img = new Image();
  //         img.src = urll + localStorage.getItem('reload');

  //     console.log(PIXI.Assets.unloadBundle ('background'));

  //     if(localStorage.getItem('reload') >= 10){
  //         $('#LoadTextDemo').html('<span style="color:#ff0000">Нажмите Ctrl + F5</span>');
  //     }else if(localStorage.getItem('reload') != '0'){
  //         localStorage.setItem('reload', Number(localStorage.getItem('reload')) + 1);
  //         $('#LoadTextDemo').html('Попытка подключения ' + localStorage.getItem('reload'));
  //         window.location.reload (true);
  //     }else{
  //         localStorage.setItem('reload', 1);
  //         $('#LoadTextDemo').html('Попытка подключения 1');
  //         window.location.reload (true);
  //     }
  // });
}

/**
 * Инициализация контейнера
 * @param {*} actualFrontImage
 */
function initContainer(
  actualFrontImage = appParam.actualFrontImage,
  isAnimating = false,
  callback = () => {
    return false;
  }
) {
  console.log("1 - initContainer - " + actualFrontImage);
  if (!isLoader || actualFrontImage != appParam.actualFrontImage) {
    soundStopAll();

    $("[data-container]").prop("disabled", false);
    $('[data-container="' + actualFrontImage + '"]').prop(
      "disabled",
      $("[data-container]").prop("disabled") ? false : true
    );

    var tempParam;
    if (
      callback ==
      (() => {
        return false;
      })
    ) {
      tempParam = [actualFrontImage, isAnimating];
    } else {
      tempParam = [actualFrontImage, isAnimating, callback];
    }

    historyPrev.push("initContainer", tempParam);

    $("#launch-content").html("");
    // appParam = _.cloneDeep(appParamDefault);
    front = _.cloneDeep(frontDefault);
    appParam.setPositionFrontObject.isAction = false;

    // Создание контейнера
    containerFront[actualFrontImage] = new PIXI.Container({
      width: window.innerWidth - appParam.setPositionFrontObject.w_cor,
      height: window.innerHeight - appParam.setPositionFrontObject.h_cor,
      backgroundAlpha: 0,
    });
    app.stage.addChild(containerFront[actualFrontImage]);

    // Загрузка фона в контейнер
    front[actualFrontImage].img.obj = PIXI.Sprite.from(
      backgroundListTexture["scene_" + actualFrontImage]
    );
    containerFront[actualFrontImage].addChild(front[actualFrontImage].img.obj);

    // Создание контейнера
    sceneConteiner[actualFrontImage] = new PIXI.Container({
      backgroundAlpha: 0,
    });

    front[actualFrontImage].img.obj.addChild(sceneConteiner[actualFrontImage]);

    if (isLoader) {
      polygonObjectRemove();
      // Удалить фон объекта
      polygonObjectFrontRemove();

      if (isAnimating) {
        var tempID = appParam.actualFrontImage;

        appParam.actualFrontImage = actualFrontImage;

        containerFront[actualFrontImage].alpha = 0;
        containerFront[tempID].alpha = 1;

        setAnimationTicker("containerFrontAnimation");

        mathCubeFrontObjectAll();
        resizeWindow("init");
        appSetBackground();

        animating.obj.add((delta) => {
          var temp = (0.1 * delta) / appParam.speedAnimationConteiner;
          containerFront[actualFrontImage].alpha += temp;
          containerFront[tempID].alpha -= temp;

          if (
            containerFront[actualFrontImage].alpha >= 1 &&
            containerFront[tempID].alpha <= 0
          ) {
            containerFront[actualFrontImage].alpha = 1;
            containerFront[tempID].alpha = 0;
            stopAnimationTicker("containerFrontAnimation");
          }
        });

        destroyAnimationTicker(() => {
          removeContainerFront(tempID);

          if (callback() == false) {
            initStartFunction();
          }
        });
        animating.obj.start();
      } else {
        removeContainerFront();

        appParam.actualFrontImage = actualFrontImage;
        mathCubeFrontObjectAll();
        resizeWindow("init");
        appSetBackground();
        if (callback() == false) {
          initStartFunction();
        }
      }
    } else {
      appParam.actualFrontImage = actualFrontImage;

      mathCubeFrontObjectAll();

      var size = resizeWindow("init");
      appSetBackground();
      if (callback(size) == false) {
        initStartFunction();
      }
    }
  }
}

/**
 * Удаление контейнера
 * @param {*} actualFrontImage
 */
function removeContainerFront(actualFrontImage = appParam.actualFrontImage) {
  containerFront[actualFrontImage].removeChild(front[actualFrontImage].img.obj);
  app.stage.removeChild(containerFront[actualFrontImage]);
  containerFront[actualFrontImage].destroy({ children: true });
  containerFront[actualFrontImage] = null;
  sceneConteiner[actualFrontImage] = null;
}

function removeSceneConteinerAll(actualFrontImage = appParam.actualFrontImage) {
  sceneConteinerAll.removeChildren();
  app.stage.removeChild(sceneConteinerAll);
  sceneConteinerAll.destroy({ children: true });
  sceneConteiner[actualFrontImage] = null;
}

/**
 * Функции для обработки
 */
function initStartFunction() {
  drawPolygonObject();
  // soundStopAll();
}

/**
 * Закончить загрузку
 */
function loaderPageStop() {
  isLoader = true;
  timeLoadPage = new Date().getTime() - timeLoadPage;

  if (timeLoadPage < appParam.timeLoaderMin) {
    setTimeout(() => {
      resizeWindow();
      $("#loader").addClass("out");
    }, appParam.timeLoaderMin);
    setTimeout(() => {
      $("#loader").addClass("stop");
    }, appParam.timeLoaderMin + 350);
  } else {
    resizeWindow();
    $("#loader").addClass("out");
    setTimeout(() => {
      $("#loader").addClass("stop");
    }, 350);
  }
  console.log("timeLoadPage: " + timeLoadPage);
}

/**
 * Изменение размера рабочей области и контейнера
 */
function resizeWindow(status = null) {
  // if(isLoader){
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    $("body").addClass("mobile");
    mobile = true;
  }
  hh = 10;

  // Рендер сцены
  app.renderer.resize(
    window.innerWidth,
    window.innerHeight - (window.innerHeight / 100) * hh
  );

  if (appParam.setPositionFrontObject.isAction) {
    addObjectBacFront();
  }

  // Изменение размеров и центовка контейнера
  // if(backgroundListTexture['scene_' + appParam.actualFrontImage].orig.width != 0 && backgroundListTexture['scene_' + appParam.actualFrontImage].orig.height != 0){
  var size = resizeConteinerFront(status, hh);
  return size;
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
  // }
}

/**
 * Авто изменение размера контейнера
 */
function resizeConteinerFront(status = null, hh = 0) {
  HeightNew = window.innerHeight - (window.innerHeight / 100) * hh;
  if (!appParam.setPositionFrontObject.isAction) {
    var orig = backgroundListTexture["scene_" + appParam.actualFrontImage].orig;
    var frontImgRatioWidth = orig.width / orig.height;
    var frontImgRatioHeight = orig.height / orig.width;
    var windowRatio = window.innerWidth / HeightNew;
    var x = 0,
      y = 0;
    var padding = front[appParam.actualFrontImage].img.param.padding
      ? front[appParam.actualFrontImage].img.param.padding
      : 0;

    if (frontImgRatioWidth > windowRatio) {
      // Подгоняем под ширину
      appParam.width = window.innerWidth - padding;
      appParam.height = window.innerWidth * frontImgRatioHeight - padding;
      y = (HeightNew - appParam.height) / 2;
      x = (window.innerWidth - appParam.width) / 2;
    } else {
      // Подгоняем под высоту
      appParam.width = HeightNew * frontImgRatioWidth - padding;
      appParam.height = HeightNew - padding;
      x = (window.innerWidth - appParam.width) / 2;
      y = (HeightNew - appParam.height) / 2;
    }

    // if(status == 'init'){
    var position = front[appParam.actualFrontImage].img.param.positionInit;

    if (position != null) {
      if (position == "centre") {
        x = window.innerWidth / 2 - appParam.width / 2;
      } else if (position == "left") {
        x = 0;
      } else if (position == "right") {
        x = window.innerWidth - appParam.width;
      } else if (position == "topCenter") {
        x = window.innerWidth / 2 - appParam.width / 2;
        y = 0;
      } else if (position == "bottomCenter") {
        x = window.innerWidth / 2 - appParam.width / 2;
        y = HeightNew - appParam.height;
      }
    }
    // }

    appParam.position.x = x;
    appParam.position.y = y;

    containerFront[appParam.actualFrontImage].position.set(x, y);

    containerFront[appParam.actualFrontImage].width = appParam.width;
    containerFront[appParam.actualFrontImage].height = appParam.height;
  } else {
    var id = appParam.setPositionFrontObject.ID;
    var pp = front[appParam.actualFrontImage].objects[id].padding;
    var padding =
      pp || pp == 0
        ? pp
        : front[appParam.actualFrontImage].img.param.padding
        ? front[appParam.actualFrontImage].img.param.padding
        : appParam.setPositionFrontObject.padding;

    setSizeFrontObjectDefault(
      appParam.setPositionFrontObject.ID,
      appParam.setPositionFrontObject.position,
      padding,
      appParam.setPositionFrontObject.w_cor,
      appParam.setPositionFrontObject.h_cor,
      false,
      appParam.setPositionFrontObject.speedAnimation
    );
    setPositionFrontObjectToDefault(
      appParam.setPositionFrontObject.ID,
      appParam.setPositionFrontObject.position,
      appParam.setPositionFrontObject.centrePosition,
      appParam.setPositionFrontObject.w_cor,
      appParam.setPositionFrontObject.h_cor,
      false,
      appParam.setPositionFrontObject.speedAnimation
    );
  }

  return { x: x, y: y, width: appParam.width, height: appParam.height };
}

/**
 * Установка цвета заднего фона
 */
function appSetBackground() {
  var paramImg = front[appParam.actualFrontImage].img.param;
  // Установка фона в рабочей области

  if (paramImg.background.img) {
    document.body.style.background =
      "url(" + paramImg.background.img + ") 0 0 / " + paramImg.background.size;
    // document.body.style.backgroundSize = paramImg.background.size;
    return true;
  } else if (paramImg.background.color) {
    // Устанавливаем предустановленный цвет
    document.body.style.background = paramImg.background.color;
    return true;
  } else {
    RGBaster.colors(paramImg.urlFrontImg, {
      // Не учитывать белый цвет
      exclude: ["rgb(255,255,255)"],
      success: function (payload) {
        frontDefault[appParam.actualFrontImage].img.param.background.color =
          payload.dominant;
        document.body.style.background = payload.dominant;
        return true;
      },
    });
    return true;
  }
  return false;
}

/**
 * Установка фона
 * @param {*} src
 */
function setBackground(src) {
  $("#contentElement").css({
    background: "url(" + src + ") no-repeat",
    "background-size": "100% 100%",
    transition: "0s",
  });
}

function setBackgroundText(src) {
  $(".contentElementContent").css({
    background: "url(" + src + ") no-repeat rgb(255 255 255 / 48%)",
    "background-size": "100% 100%",
    "box-shadow": "0 0 20px 0px rgb(0 0 0)",
  });
}

/**
 * Перевод цвета в 16-ти ричный
 * @param {*} RGBA
 * @returns
 */
function RGBtoRGB16(RGBA) {
  var RGB = RGBA.slice(4).slice(0, -1).split(",");
  return rgbToHex(RGB[0], RGB[1], RGB[2]);
}

/**
 * Предварительная инициализация всех цветов
 */
async function initBackgroundColorALL() {
  var count = frontDefault.length - 1;
  for (let index = 0; index <= count; index++) {
    const element = frontDefault[index].img.param;

    if (element.background.color == null) {
      RGBaster.colors(element.urlFrontImg, {
        // Не учитывать белый цвет
        exclude: ["rgb(255,255,255)"],
        success: function (payload) {
          frontDefault[index].img.param.background.color = payload.dominantж;
        },
      });
    }

    if (index == count) {
      front[appParam.actualFrontImage].img.param.background.color =
        frontDefault[appParam.actualFrontImage].img.param.background.color;
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
function rgbToHex(r, g, b) {
  return (
    "0x" + ((1 << 24) + (r << 16) + (g << 8) + (b << 0)).toString(16).slice(1)
  );
}

/**
 * Отрисовка объектов на фоне
 */
function drawPolygonObject() {
  front[appParam.actualFrontImage].objects.forEach((element) => {
    element.obj = new PIXI.Graphics();
    element.obj.lineStyle(0);
    element.obj.beginFill(
      element.fillColor ? element.fillColor : appParam.fillColorDefault,
      element.fillOpacity ? element.fillOpacity : appParam.fillOpacityDefault
    );
    element.obj.drawPolygon(element.path);
    element.obj.endFill();
    element.obj.interactive = true;
    element.obj.buttonMode = true;
    element.obj.alpha = element.alpha ? element.alpha : appParam.alphaDefault;
    element.obj.on("pointerdown", (event) => {
      console.log("polygonObjectOnClick - ", event, element.ID);

      polygonObjectOnClick(event, element.ID);
    });
    element.obj.on("pointerover", (event) =>
      polygonObjectOnPointerOver(event, element.ID)
    );
    element.obj.on("pointerout", (event) =>
      polygonObjectOnPointerOut(event, element.ID)
    );
    element.obj.on("pointermove", (event) =>
      polygonObjectOnMove(event, element.ID)
    );

    containerFront[appParam.actualFrontImage].addChild(element.obj);

    // mathCubeFrontObject(element);
  });
}

function mathCubeFrontObjectAll() {
  front[appParam.actualFrontImage].objects.forEach((element) => {
    mathCubeFrontObject(element);
  });
}

/**
 * Расчет крайних координат и размера объекта фона
 * @param {*} element
 */
function mathCubeFrontObject(element) {
  if (Number.isInteger(element) && element >= 0) {
    element = front[appParam.actualFrontImage].objects[element];
  }

  var pathTemp = { x: [], y: [] };
  // Разделяем координаты на Х и Y
  for (n = 0; n < element.path.length; n++) {
    if (even(n)) {
      pathTemp.x.push(element.path[n]);
    } else {
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

  element.cube.width = element.cube.path.x2 - element.cube.path.x1;
  element.cube.height = element.cube.path.y2 - element.cube.path.y1;
}

/**
 * Удалить объекты с фона
 * @param {*} ID
 */
function polygonObjectRemove(ID = null) {
  if (ID != null) {
    front[appParam.actualFrontImage].objects[ID].obj.clear();
  } else {
    for (
      let index = 0;
      index < front[appParam.actualFrontImage].objects.length;
      index++
    ) {
      if (front[appParam.actualFrontImage].objects[index].obj) {
        containerFront[appParam.actualFrontImage].removeChild(
          front[appParam.actualFrontImage].objects[index].obj
        );
        front[appParam.actualFrontImage].objects[index].obj.clear();
      }
    }
  }
}

/**
 * Удалить фон объектов
 */
function polygonObjectFrontRemove(isAnimating = false) {
  if (front[appParam.actualFrontImage].objectFront.obj) {
    containerFront[appParam.actualFrontImage].removeChild(
      front[appParam.actualFrontImage].objectFront.obj
    );
    front[appParam.actualFrontImage].objectFront.obj.clear();
  }

  if (appParam.bacFront) {
    containerFront[appParam.actualFrontImage].removeChild(appParam.bacFront);
    appParam.bacFront.clear();
    appParam.bacFront.destroy();
    appParam.bacFront = null;
  }
}

function polygonObjectFrontRemoveAnimation(isAnimating = false) {
  if (front[appParam.actualFrontImage].objectFront.obj) {
    if (isAnimating) {
      setAnimationTicker("polygonObjectFrontRemove");

      animating.obj.add((delta) => {
        var temp = (0.1 * delta) / appParam.speedAnimationConteiner / 2;
        front[appParam.actualFrontImage].objectFront.obj.alpha -= temp;
        appParam.bacFront.alpha -= temp;

        if (
          front[appParam.actualFrontImage].objectFront.obj.alpha <= 0 &&
          appParam.bacFront.alpha <= 0
        ) {
          front[appParam.actualFrontImage].objectFront.obj.alpha = 0;
          appParam.bacFront.alpha = 0;
          stopAnimationTicker("polygonObjectFrontRemove");
        }
      });
    }
  }
}

/**
 * Вывод текста с названием объекта
 * @param {*} event
 * @param {int} ID - id объекта на фоне (0 - обводка)
 */
function polygonObjectOnPointerOver(event, ID) {
  // const instance = audioList['stuk2'].play({
  //     singleInstance: true
  // });

  // instance.on('end', function() {
  //     audioList['stuk2'].stop();
  // });

  var element = front[appParam.actualFrontImage].objects[ID];
  if (frontObjectName != null) {
    app.stage.removeChild(frontObjectName);
    frontObjectName = null;
  }

  frontObjectName = new PIXI.Text(
    element.name,
    new PIXI.TextStyle(textStyleDefault.frontObjectName)
  );
  app.stage.addChild(frontObjectName);
  polygonObjectOnMove(event, ID);

  front[appParam.actualFrontImage].objects[ID].obj.alpha = element.alphaOver
    ? element.alphaOver
    : appParam.alphaOverDefault;
}

/**
 * Удаление подпись у объектов
 * @param {*} event
 * @param {*} ID
 */
function polygonObjectOnPointerOut(event, ID) {
  // audioList['stuk2'].stop();
  if (frontObjectName) {
    var element = front[appParam.actualFrontImage].objects[ID];
    app.stage.removeChild(frontObjectName);
    frontObjectName = null;
    front[appParam.actualFrontImage].objects[ID].obj.alpha = element.alpha
      ? element.alpha
      : appParam.alphaDefault;
  }
}

/**
 * Измениение положения подписи у объектов за мышкой
 */
function polygonObjectOnMove(event, ID) {
  if (frontObjectName != null) {
    var x, y;

    if (event) {
      // var mouseCoords = app.renderer.plugins.interaction.mouse.global;
      x = event.global.x;
      y = event.global.y;
    } else {
      var element = front[appParam.actualFrontImage].objects[ID];

      x = element.cube.path.x2;
      y = element.cube.path.y2;
    }

    frontObjectName.position.x = x + 20;
    frontObjectName.position.y = y + 20;
  }
}

/**
 * Событие при нажатии на объект
 * @param {*} event
 * @param {int} ID id объекта на фоне
 */
function polygonObjectOnClick(event, ID, ID_scene = -1) {
  console.log("polygonObjectOnClick");
  var isGOTO = false;
  var isGOTOBACK = true;

  if (ID_scene == -1) {
    ID_scene = appParam.actualFrontImage;
    appParam.setPositionFrontObject.ID = ID;
  } else if (ID_scene == -2) {
    isGOTOBACK = false;
    ID_scene = appParam.actualFrontImage;
    appParam.setPositionFrontObject.ID = ID;
  } else {
    isGOTO = true;
  }

  if (ID_scene < 0 || ID < 0) {
    return;
  }

  var element = front[ID_scene].objects[ID];
  var isSoundOne = false;

  console.log("element - ", element);

  initSound(element.sound).then((result) => {
    isSoundOne = true;
    isSoundOneHTML();
  });

  if (typeof element !== "undefined") {
    console.log("polygonObjectOnClick111111111");
    console.log(element);

    if (element.eventStop != true) {
      console.log("polygonObjectOnClick22222222222222");

      var toPosition = element.toPosition
        ? element.toPosition
        : appParam.toPositionDefault;
      var setPositionObject = element.setPositionObject
        ? element.setPositionObject
        : appParam.setPositionObjectDefault;
      var padding =
        element.padding || element.padding == 0
          ? element.padding
          : appParam.setPositionFrontObject.padding;
      var speedAnimation = element.speedAnimation
        ? element.speedAnimation
        : appParam.setPositionFrontObject.speedAnimation;
      var callback = front[ID_scene].objects[ID].callback
        ? front[ID_scene].objects[ID].callback
        : () => {};

      console.log(toPosition);
      console.log(setPositionObject);
      console.log(padding);
      console.log(speedAnimation);
      console.log(callback);

      $("#launch-content").html("");

      if (element.img) {
        console.log("img");

        // Удалить текстовые подсказки
        polygonObjectOnPointerOut(event, ID);
        // Удалить все обекты фона
        // polygonObjectRemove();

        if (isGOTOBACK) {
          if (isGOTO) {
            if (ID_scene == 3 && ID == 0) {
              historyPrev.push("removePolygonObjectContent", [], true);
            } else {
              historyPrev.push(
                "removePolygonObjectContent",
                [
                  () => {
                    polygonObjectOnClick(
                      true,
                      appParam.setPositionFrontObject.ID,
                      -2
                    );
                  },
                ],
                true
              );
            }
          } else {
            historyPrev.push(
              "removePolygonObjectContent",
              [front[ID_scene].img.callback],
              true
            );
          }
        }

        drawPolygonObjectContent(element, ID_scene, isSoundOne);
        callback(element);
      } else if (element.callbackToStart) {
        console.log("callbackToStart");

        // Удалить текстовые подсказки
        polygonObjectOnPointerOut(event, ID);
        // Удалить все обекты фона
        polygonObjectRemove();

        callback(element);
        if (front[ID_scene].img.param.text) {
          drawPolygonObjectContent("init", -1, isSoundOne);
        }
      } else {
        console.log(11111111111111111111111111111);
        // appParam.setPositionFrontObject.ID = ID;

        // Удалить текстовые подсказки
        polygonObjectOnPointerOut(event, ID);

        // Удалить все обекты фона
        polygonObjectRemove();

        // Удалить фон объекта
        polygonObjectFrontRemove();

        if (!element.stopMove) {
          console.log(22222222222222222222222222222222);

          // Нарисовать обводку объекта фона
          polygonObjectFront(ID, element.isAnimating);
          console.log("polygonObjectFront");

          //Маштабирование объекта
          setSizeFrontObjectDefault(
            ID,
            toPosition,
            padding,
            appParam.setPositionFrontObject.w_cor,
            appParam.setPositionFrontObject.h_cor,
            element.isAnimating,
            speedAnimation
          );
          console.log(
            "setSizeFrontObjectDefault",
            ID,
            toPosition,
            padding,
            appParam.setPositionFrontObject.w_cor,
            appParam.setPositionFrontObject.h_cor,
            element.isAnimating,
            speedAnimation
          );

          // Перемещение объекта
          setPositionFrontObjectToDefault(
            ID,
            toPosition,
            setPositionObject,
            appParam.setPositionFrontObject.w_cor,
            appParam.setPositionFrontObject.h_cor,
            element.isAnimating,
            speedAnimation
          );
          console.log("setPositionFrontObjectToDefault");
        }

        if (element.isAnimating) {
          destroyAnimationTicker(() => {
            if (callback == "() => {}") {
              historyPrev.push(
                "closePolygonObject",
                [true, front[ID_scene].img.callback],
                true
              );
              drawPolygonObjectContent(element, -1, isSoundOne);
            } else {
              callback();
            }
          });
          animating.obj.start();
        } else {
          if (callback == "() => {}") {
            historyPrev.push(
              "closePolygonObject",
              [true, front[ID_scene].img.callback],
              true
            );
            drawPolygonObjectContent(element, -1, isSoundOne);
          } else {
            console.log("3");

            callback();
          }
        }

        appParam.setPositionFrontObject.isAction = true;
      }

      if (element.background) {
        setBackground(element.background);
      }
    }
  }
  console.log("polygonObjectOnClick");
}

function isSoundOneHTML() {
  $("#sound-play-one").prop("disabled", false);
  $("#sound-play-one").html('<i class="fa-solid fa-play"></i> Cлушать аудио');
}

function removePolygonObjectContent(callback) {
  $("#launch-content").html("");
  isObjectOne = false;
  // setTimeout(function tick() {
  if (jQuery.isFunction(callback)) {
    callback();
  }
  // }, 100)
}

function drawVideoBox(video, isOne = false, id_scene = -1, id_element = -1) {
  if (isOne || video.length == 1) {
    if (isOne) {
      drawVideoOne(video, id_scene, id_element);
    } else {
      drawVideoOne(video[0].src, id_scene, id_element);
    }
  } else {
    var videoTAB = "";
    video.forEach((item) => {
      videoTAB +=
        '<a class="videoALbtn" data-id-scene ="' +
        id_scene +
        '" data-id-element ="' +
        id_element +
        '" href="' +
        item.src +
        '" title="' +
        item.name +
        '"><img src="' +
        item.img +
        '" alt="' +
        item.name +
        '"></a>';
    });

    $("#launch-content").append(
      '<div class="contentElementContentVideo"><div class="video-flex">' +
        videoTAB +
        "</div></div>"
    );
  }
}

function removeVideoBox() {
  $(".contentElementContentVideo").remove();
}

/**
 * Отобразить контент объекта
 * @param {*} element
 */
function drawPolygonObjectContent(element, scene = -1, isSoundOne = false) {
  if (element == "init") {
    element = front[appParam.actualFrontImage].img.param;
    $("#launch-content").append(
      `
            <div id="ObjectContent" class="ObjectContent-` +
        element.positionInit +
        ` b-none">
                <h1>` +
        element.name +
        `</h2>
                <div class="content">
                    <div class="content-ObjectContent">` +
        element.text +
        `</div>
                </div>
            </div>
        `
    );

    $(".ObjectContent").mCustomScrollbar({
      theme: "dark",
      scrollEasing: "easeInOut",
      scrollInertia: 1500,
      mouseWheel: { enable: true },
    });

    $("#ObjectContent").css({ opacity: 1 });
  } else {
    var temp21 = "";
    var temp23 = "";
    var media = "";
    var temp = "";
    var mobDelBox = "";
    // if(element.tabVideo){
    //     element.tabVideo.forEach(item => {
    //         videoTAB += '<a href="#"><img class="videoALbtn" src="' + item.img + '" alt="' + item.name + '" data-src="' + item.src + '" data-name="' + item.name + '"></a>';
    //     });

    //     temp21 = '<div class="contentElementContentVideo">' + videoTAB + '</div>';
    // }

    if (
      element.sound ||
      element.tabVideo ||
      element.url ||
      element.gallery ||
      element.bottonGOTO
    ) {
      media = '<div class="contentElementContentMedia">';
      if (element.sound) {
        media +=
          '<button id="sound-play-one" disabled type="button" data-id="' +
          element.sound +
          '"><i class="fa fa-spinner rotation-el"></i> Загрузка аудио</button><div class="progress" data-id="' +
          element.sound +
          '"><div id="sound-progresss-' +
          element.sound +
          '" class="progress-bar" style="width: 0%;"></div></div>';
      }
      if (element.tabVideo) {
        media +=
          '<button id="video-play-content" type="button"><i class="fa-solid fa-play"></i> Смотреть видео</button>';
      }
      if (element.url) {
        media +=
          '<a class="link-conent" href="' +
          element.url +
          '" target="_blank"><i class="fa-solid fa-link"></i>Ссылка на сайт монастыря</a>';
      }

      if (element.gallery) {
        if (element.isGalleryContent) {
          mobDelBox = "mobileDuo";
          temp23 =
            '<div class="contentElementContentDec DecDrawGallery"><div class="contentElementText">' +
            drawGallery() +
            "</div></div>";
        } else {
          media +=
            '<button id="gallery-content" type="button"><i class="fa-solid fa-images"></i> Смотерть галерею</button>';
        }
      }

      if (element.bottonGOTO) {
        media +=
          '<button id="BottonGOTO-content" class="contentElementBottonGOTO" type="button"><i class="fa-solid fa-object-group"></i> ' +
          element.bottonGOTO.name +
          "</button>";
      }

      media += "</div>";
    }

    var temp1 =
      '<div id="contentElement" class="content-' +
      scene +
      (element.img ? " isImg " : "") +
      " position-" +
      element.toPosition +
      '">';
    var temp2 = '<div class="contentElementContent ' + mobDelBox + '">';

    var temp22 =
      '<div class="contentElementContentDec"><div class="contentElementText' +
      (media ? " contentElementContentDec-media" : "") +
      '"><h1 class="contentElementName">' +
      element.name +
      "</h1>" +
      element.text +
      "</div></div>";

    var temp3 = "</div>";
    var temp4 =
      '<div class="contentElementImgBox"><img class="contentElementImg ' +
      (element.imgGOTO ? "contentElementImgGOTO" : "") +
      '" src="' +
      (element.img ? element.img : "") +
      '" alt="' +
      element.imgTitle +
      '"/><span>' +
      element.imgTitle +
      "</span></div>";

    if (element.img) {
      if (element.toPosition == "left") {
        temp =
          temp1 +
          temp4 +
          temp2 +
          temp21 +
          temp22 +
          temp23 +
          temp3 +
          media +
          temp3;
      } else {
        temp =
          temp1 +
          temp2 +
          temp21 +
          temp22 +
          temp23 +
          temp3 +
          media +
          temp4 +
          temp3;
      }
    } else {
      temp = temp1 + temp2 + temp22 + temp23 + temp3 + media + temp3;
    }

    $("#launch-content").append(temp);

    $(".contentElementText").mCustomScrollbar({
      theme: "dark",
      scrollEasing: "easeInOut",
      scrollInertia: 1500,
      mouseWheel: { enable: true },
    });

    // if(element.tabVideo){
    //     $(".contentElementContentVideo").mCustomScrollbar({
    //         axis:"x",
    //         theme:"dark",
    //         scrollEasing:"easeInOut",
    //         scrollInertia:1500,
    //         mouseWheel:{ enable: true }
    //     });
    // }
    $("#contentElement").css({ opacity: 1 });
  }

  if (element.backgroundText) {
    setBackgroundText(element.backgroundText);
  }
  $(".FragmentEvangelie").addClass("d-none");
  if (isSoundOne) {
    isSoundOneHTML();
  }
}

$("body").on("click", ".videoALbtn", function (e) {
  e.preventDefault();
  // historyPrev.push('drawVideoBox',[appParam.setPositionFrontObject.ID, true );
  var src = $(this).attr("href");
  var id_scene = -1,
    id_element = -1;

  if (typeof src === "undefined") {
    src = $(this).data("href");
  }

  if (
    typeof $(this).data("id-scene") !== "undefined" &&
    typeof $(this).data("id-element") !== "undefined"
  ) {
    id_scene = $(this).data("id-scene");
    id_element = $(this).data("id-element");
  }

  drawVideoOne(src, id_scene, id_element);
});

$("body").on("click", "#video-play-content", function (e) {
  var id_scene;
  var id_element;

  if (
    typeof $(this).data("id-scene") !== "undefined" &&
    typeof $(this).data("id-element") !== "undefined"
  ) {
    id_scene = $(this).data("id-scene");
    id_element = $(this).data("id-element");
  } else {
    id_scene = appParam.actualFrontImage;
    id_element = appParam.setPositionFrontObject.ID;
  }

  var temp = front[id_scene].objects[id_element].tabVideo;

  if (temp.length > 1) {
    historyPrev.push("removeVideoBox", [], true);
  }

  drawVideoBox(temp, false, id_scene, id_element);
});

$("body").on("click", "#gallery-content", function (e) {
  drawGalleryFull();
});

$("body").on("click", ".drawGallery", function (e) {
  drawGalleryFull($(this).data("id"));
});

function drawGalleryFull(id_element = null, temp = null) {
  var gallery = "";

  if (temp == null) {
    temp =
      front[appParam.actualFrontImage].objects[
        appParam.setPositionFrontObject.ID
      ].gallery;
  }

  $(".FragmentEvangelie").addClass("d-none");

  historyPrev.push("closeGallery", [], true);

  if (id_element == null) {
    $.each(temp, function (index, element) {
      gallery +=
        '<div class="itc-slider__item"><img src="' +
        element.src +
        '" alt="' +
        element.name +
        '"><div class="itc-slider__item_text"><h2>' +
        element.name +
        "</h2>" +
        (element.text ? "<p>" + element.text + "</p>" : "") +
        "</div></div>";
    });
  } else {
    for (let index = id_element; index < temp.length; index++) {
      const element = temp[index];
      gallery +=
        '<div class="itc-slider__item"><img src="' +
        element.src +
        '" alt="' +
        element.name +
        '"><div class="itc-slider__item_text"><h2>' +
        element.name +
        "</h2>" +
        (element.text ? "<p>" + element.text + "</p>" : "") +
        "</div></div>";
    }

    for (let index = 0; index < id_element; index++) {
      const element = temp[index];
      gallery +=
        '<div class="itc-slider__item"><img src="' +
        element.src +
        '" alt="' +
        element.name +
        '"><div class="itc-slider__item_text"><h2>' +
        element.name +
        "</h2>" +
        (element.text ? "<p>" + element.text + "</p>" : "") +
        "</div></div>";
    }
  }

  $("#launch-content").append(
    '<div class="contentElementContentGallery"><div class="itc-slider" data-slider="itc-slider" data-loop="false" data-autoplay="false"><div class="itc-slider__wrapper"><div class="itc-slider__items">' +
      gallery +
      '</div></div><button class="itc-slider__btn itc-slider__btn_prev"></button><button class="itc-slider__btn itc-slider__btn_next"></button></div></div>'
  );

  ItcSlider.getOrCreateInstance(".itc-slider", {
    loop: true, // без зацикливания
    autoplay: true,
    interval: 2500,
  });
}

function drawGallery() {
  var temp =
    front[appParam.actualFrontImage].objects[appParam.setPositionFrontObject.ID]
      .gallery;
  var gallery = "";

  $.each(temp, function (index, element) {
    gallery +=
      '<div class="drawGallery" data-id="' +
      index +
      '"><img src="' +
      element.src +
      '" alt="' +
      element.name +
      '"><h2>' +
      element.name +
      "</h2>" +
      (element.text ? "<p>" + element.text + "</p>" : "") +
      "</div>";
  });

  return gallery;
}

function closeGallery() {
  $(".FragmentEvangelie").removeClass("d-none");
  $(".contentElementContentGallery").remove();
  $(".FragmentEvangelie").removeClass("z-5");
}

function drawVideoOne(
  src,
  id_scene = -1,
  id_element = -1,
  classNew = "",
  full = false,
  controls = true
) {
  removeVideoBox();

  var el = [];

  if (id_scene >= 0 && id_element >= 0) {
    el = [id_scene, id_element];
  }

  historyPrev.push("videoClose", el, true);
  soundStopAll();

  $(".FragmentEvangelie").addClass("d-none");

  // console.log($(this).data('name'));
  // console.log($(this).data('src'));
  $("#launch-content").append(
    '<div id="videoALbox"><div class="videoWrapper ' +
      (full ? "w-100vw" : "") +
      '"><div class="ambilightWrapper"><div class="aspectRatio"><video pip="false" id="videoALcont" class="' +
      classNew +
      '" ' +
      (controls ? "controls" : "") +
      " autoplay" +
      (mutedAll ? " muted" : "") +
      ' ><source src="' +
      src +
      '" type="video/mp4"></video></div><canvas id="ambilight"></canvas></div></div></div>'
  );

  let intervalId;
  const FRAMERATE = 60;

  const canvas = document.getElementById("ambilight");
  const context = canvas.getContext("2d");

  const video = document.getElementById("videoALcont");

  function repaintAmbilight() {
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  }

  function startAmbilightRepaint() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    intervalId = window.setInterval(repaintAmbilight, 1000 / FRAMERATE);
  }

  function stopAmbilightRepaint() {
    clearInterval(intervalId);
  }

  video.addEventListener("play", startAmbilightRepaint);

  video.addEventListener("pause", stopAmbilightRepaint);

  video.addEventListener("ended", stopAmbilightRepaint);

  video.addEventListener("seeked", repaintAmbilight);

  video.addEventListener("load", repaintAmbilight);

  // load first frame
  repaintAmbilight();
  video.currentTime = 0;
}

function videoClose(id_scene = -1, id_element = -1) {
  historiNextClear();
  $("#videoALbox").remove();
  $(".FragmentEvangelie").removeClass("d-none");

  if ($("#video-play-content").length) {
    var scene, element;

    if (id_scene >= 0 || id_element >= 0) {
      scene = id_scene;
      element = id_element;
    } else {
      scene = appParam.actualFrontImage;
      element = appParam.setPositionFrontObject.ID;
    }

    var temp = front[scene].objects[element].tabVideo;
    if (temp.length > 1) {
      drawVideoBox(temp);
    }
  }
}

/**
 * Вохврат фона в исходное положение
 * @param {*} isAnimating
 * @param {*} speedAnimation
 */
function closePolygonObject(
  isAnimating = false,
  callback = () => {
    return false;
  },
  speedAnimation = appParam.setPositionFrontObject.speedAnimation
) {
  var ID = appParam.setPositionFrontObject.ID;
  $("#launch-content").html("");
  setSizeFrontObjectStart(ID, isAnimating, speedAnimation);

  setPositionFrontObjectToStart(ID, isAnimating, speedAnimation);

  if (isAnimating) {
    polygonObjectFrontRemoveAnimation(isAnimating);

    destroyAnimationTicker(() => {
      // Удалить фон объекта
      polygonObjectFrontRemove(isAnimating);

      resizeWindow();
      if (callback() == false) {
        initStartFunction();
      }
    });
    animating.obj.start();
  } else {
    // Удалить фон объекта
    polygonObjectFrontRemove(isAnimating);
    resizeWindow();

    if (callback() == false) {
      initStartFunction();
    }
  }

  appParam.setPositionFrontObject.isAction = false;
  $(".FragmentEvangelie").removeClass("d-none");
}

/**
 * Возврат положение в исходное состояние
 * @param {*} params
 */
function setPositionFrontObjectToStart(
  ID,
  isAnimating = false,
  speedAnimation = appParam.setPositionFrontObject.speedAnimation
) {
  var newX = appParam.setPositionFrontObject.positionXAction;
  var newY = appParam.setPositionFrontObject.positionYAction;
  if (isAnimating) {
    setAnimationTicker("setPositionFrontObjectToStart: " + ID);

    var xTemp =
      (newX - containerFront[appParam.actualFrontImage].x) / speedAnimation;
    var yTemp =
      (newY - containerFront[appParam.actualFrontImage].y) / speedAnimation;
    var isX = false;
    var isY = false;

    animating.obj.add((delta) => {
      if (!isX) {
        containerFront[appParam.actualFrontImage].x += xTemp * delta;
        if (xTemp >= 0) {
          if (containerFront[appParam.actualFrontImage].x >= newX) {
            containerFront[appParam.actualFrontImage].x = newX;
            isX = true;
          }
        } else {
          if (containerFront[appParam.actualFrontImage].x <= newX) {
            containerFront[appParam.actualFrontImage].x = newX;
            isX = true;
          }
        }
      }
      if (!isY) {
        containerFront[appParam.actualFrontImage].y += yTemp * delta;
        if (yTemp >= 0) {
          if (containerFront[appParam.actualFrontImage].y >= newY) {
            containerFront[appParam.actualFrontImage].y = newY;
            isY = true;
          }
        } else {
          if (containerFront[appParam.actualFrontImage].y <= newY) {
            containerFront[appParam.actualFrontImage].y = newY;
            isY = true;
          }
        }
      }

      if (isX && isY) {
        stopAnimationTicker("setPositionFrontObjectToStart: " + ID);
      }
    });
  } else {
    containerFront[appParam.actualFrontImage].x = newX;
    containerFront[appParam.actualFrontImage].y = newY;
  }
}

/**
 * Возврат размера в исходное состояние
 * @param {*} ID
 * @param {*} isAnimating
 * @param {*} speedAnimation
 */
function setSizeFrontObjectStart(
  ID,
  isAnimating = false,
  speedAnimation = appParam.setPositionFrontObject.speedAnimation
) {
  var newWidth = appParam.setPositionFrontObject.widthAction;
  var newHeight = appParam.setPositionFrontObject.heightAction;

  // Подгоняем под высоту
  if (isAnimating) {
    setAnimationTicker("setSizeFrontObjectStart: " + ID);

    var widthTemp =
      (newWidth - containerFront[appParam.actualFrontImage].width) /
      speedAnimation;
    var heightTemp =
      (newHeight - containerFront[appParam.actualFrontImage].height) /
      speedAnimation;
    var isWidth = false;
    var isHeight = false;

    animating.obj.add((delta) => {
      if (!isWidth) {
        containerFront[appParam.actualFrontImage].width += widthTemp * delta;
        if (widthTemp >= 0) {
          if (containerFront[appParam.actualFrontImage].width >= newWidth) {
            containerFront[appParam.actualFrontImage].width = newWidth;
            isWidth = true;
          }
        } else {
          if (containerFront[appParam.actualFrontImage].width <= newWidth) {
            containerFront[appParam.actualFrontImage].width = newWidth;
            isWidth = true;
          }
        }
      }

      if (!isHeight) {
        containerFront[appParam.actualFrontImage].height += heightTemp * delta;
        if (widthTemp >= 0) {
          if (containerFront[appParam.actualFrontImage].height >= newHeight) {
            containerFront[appParam.actualFrontImage].height = newHeight;
            isHeight = true;
          }
        } else {
          if (containerFront[appParam.actualFrontImage].height <= newHeight) {
            containerFront[appParam.actualFrontImage].height = newHeight;
            isHeight = true;
          }
        }
      }

      if (isWidth && isHeight) {
        stopAnimationTicker("setSizeFrontObjectStart: " + ID);
      }
    });
  } else {
    containerFront[appParam.actualFrontImage].width = newWidth;
    containerFront[appParam.actualFrontImage].height = newHeight;
  }
  appParam.width = newWidth;
  appParam.height = newHeight;
}

/**
 * Отрисовка фона у объекта
 * @param {*} ID
 */
function polygonObjectFront(ID, isAnimating = fasle) {
  var elementAction = front[appParam.actualFrontImage].objects[ID];
  var elementFront = front[appParam.actualFrontImage].objectFront;

  var fillColor = elementAction.fillColorFront
    ? elementAction.fillColorFront
    : elementFront.fillColor
    ? elementFront.fillColor
    : appParam.fillColorDefault;
  var fillOpacity = elementAction.fillOpacityFront
    ? elementAction.fillOpacityFront
    : elementFront.fillOpacity
    ? elementFront.fillOpacity
    : appParam.fillOpacityDefault;

  var pathTempEnd = [
    0,
    0,
    0,
    backgroundListTexture["scene_" + appParam.actualFrontImage].orig.height,
    backgroundListTexture["scene_" + appParam.actualFrontImage].orig.width,
    backgroundListTexture["scene_" + appParam.actualFrontImage].orig.height,
    backgroundListTexture["scene_" + appParam.actualFrontImage].orig.width,
    0,
  ];

  front[appParam.actualFrontImage].objectFront.path = [
    ...[0, 0],
    ...elementAction.path,
    ...[elementAction.path[0], elementAction.path[1]],
    ...pathTempEnd,
  ];

  front[appParam.actualFrontImage].objectFront.obj = new PIXI.Graphics();
  front[appParam.actualFrontImage].objectFront.obj.lineStyle(0);
  front[appParam.actualFrontImage].objectFront.obj.beginFill(
    fillColor,
    fillOpacity
  );
  front[appParam.actualFrontImage].objectFront.obj.drawPolygon(
    front[appParam.actualFrontImage].objectFront.path
  );

  front[appParam.actualFrontImage].objectFront.obj.endFill();
  front[appParam.actualFrontImage].objectFront.obj.zIndex = 25;

  // const filter = new PIXI.Filter();
  // front[appParam.actualFrontImage].objectFront.obj.filters = [filter];

  containerFront[appParam.actualFrontImage].addChild(
    front[appParam.actualFrontImage].objectFront.obj
  );

  if (isAnimating) {
    front[appParam.actualFrontImage].objectFront.obj.alpha = 0;

    setAnimationTicker("polygonObjectFront");

    animating.obj.add((delta) => {
      var temp = (0.1 * delta) / appParam.speedAnimationConteiner / 2;
      front[appParam.actualFrontImage].objectFront.obj.alpha += temp;
      if (
        front[appParam.actualFrontImage].objectFront.obj.alpha >=
        front[appParam.actualFrontImage].objectFront.fillOpacity
      ) {
        front[appParam.actualFrontImage].objectFront.obj.alpha =
          front[appParam.actualFrontImage].objectFront.fillOpacity;
        stopAnimationTicker("polygonObjectFront");
      }
    });

    destroyAnimationTicker();
    animating.obj.start();
  } else {
    front[appParam.actualFrontImage].objectFront.obj.alpha =
      front[appParam.actualFrontImage].objectFront.fillOpacity;
  }

  addObjectBacFront();
}

/**
 * Обновление размеров глобального затенения
 */
function addObjectBacFront() {
  var elementAction =
    front[appParam.actualFrontImage].objects[
      appParam.setPositionFrontObject.ID
    ];
  var elementFront = front[appParam.actualFrontImage].objectFront;
  var fillColor = elementAction.fillColorFront
    ? elementAction.fillColorFront
    : elementFront.fillColor
    ? elementFront.fillColor
    : appParam.fillColorDefault;
  var fillOpacity = elementAction.fillOpacityFront
    ? elementAction.fillOpacityFront
    : elementFront.fillOpacity
    ? elementFront.fillOpacity
    : appParam.fillOpacityDefault;

  var isAdd = false;

  if (appParam.bacFront) {
    appParam.bacFront.clear();
  } else {
    appParam.bacFront = new PIXI.Graphics();
    isAdd = true;
  }

  appParam.bacFront.lineStyle(0);
  appParam.bacFront.beginFill(fillColor, fillOpacity);
  appParam.bacFront.drawPolygon([
    0,
    0,
    window.innerWidth,
    0,
    window.innerWidth,
    window.innerHeight,
    0,
    window.innerHeight,
  ]);
  appParam.bacFront.endFill();

  if (isAdd) {
    app.stage.addChildAt(appParam.bacFront, 0);
  }
}

/**
 * Получение стандартных координат
 * @param {*} ID
 * @param {*} position [centre, left, right]
 * @param {*} centrePosition [centre, leftTop, rightTop, leftCentre, rightCentre, leftBottom, rightBottom]
 */
function setPositionFrontObjectToDefault(
  ID,
  position = "center",
  centrePosition = "center",
  w_cor = 0,
  h_cor = 0,
  isAnimating = false,
  speedAnimation = 60
) {
  var x = 0;
  var y = 0;
  var padding_cor = front[appParam.actualFrontImage].img.param.padding;

  if (typeof padding_cor == "undefined") {
    padding_cor = 0;
  }

  if (position == "center") {
    x = (window.innerWidth - w_cor) / 2 + padding_cor / 2;
    y = (window.innerHeight - h_cor) / 2;
  } else if (position == "left") {
    x =
      (((window.innerWidth - w_cor) / 100) *
        appParam.setPositionFrontObject.positionLeft) /
        2 +
      padding_cor / 2;
    y = (window.innerHeight - h_cor) / 2;
  } else if (position == "right") {
    x =
      ((window.innerWidth - w_cor) / 100) *
        (100 - appParam.setPositionFrontObject.positionRight / 2) +
      padding_cor / 2;
    y = (window.innerHeight - h_cor) / 2;
  } else if (position == "topCenter") {
    x = (window.innerWidth - w_cor) / 2 + padding_cor / 2;
    y = 0;
  }

  appParam.setPositionFrontObject.ID = ID;
  appParam.setPositionFrontObject.position = position;
  appParam.setPositionFrontObject.centrePosition = centrePosition;

  setPositionFrontObject(ID, x, y, centrePosition, isAnimating, speedAnimation);
}

/**
 * Переместить объект в заданные координаты
 * @param {*} ID
 * @param {*} x
 * @param {*} y
 * @param {*} centrePosition [centre, leftTop, rightTop, leftCentre, rightCentre, leftBottom, rightBottom]
 */
function setPositionFrontObject(
  ID,
  x,
  y,
  centrePosition = "center",
  isAnimating = false,
  speedAnimation = 60
) {
  appParam.setPositionFrontObject.ID = ID;

  var cube = front[appParam.actualFrontImage].objects[ID].cube;
  var scale =
    appParam.height /
    backgroundListTexture["scene_" + appParam.actualFrontImage].orig.height;
  var centre = { x: 0, y: 0 };

  if (centrePosition == "center") {
    centre.x = cube.width / 2;
    centre.y = cube.height / 2;
  } else if (centrePosition == "topCenter") {
    centre.x = cube.width / 2;
    centre.y = 0;
  } else if (centrePosition == "leftTop") {
    centre.x = 0;
    centre.y = 0;
  } else if (centrePosition == "rightTop") {
    centre.x = cube.width;
    centre.y = 0;
  } else if (centrePosition == "leftCenter") {
    centre.x = 0;
    centre.y = cube.height / 2;
  } else if (centrePosition == "rightCenter") {
    centre.x = cube.width;
    centre.y = cube.height / 2;
  } else if (centrePosition == "leftBottom") {
    centre.x = 0;
    centre.y = cube.height;
  } else if (centrePosition == "rightBottom") {
    centre.x = cube.width;
    centre.y = cube.height;
  }

  if (!appParam.setPositionFrontObject.isAction) {
    appParam.setPositionFrontObject.positionXAction =
      containerFront[appParam.actualFrontImage].x;
    appParam.setPositionFrontObject.positionYAction =
      containerFront[appParam.actualFrontImage].y;
  }

  var newX = -(cube.path.x1 * scale + centre.x * scale - x);
  var newY = -(cube.path.y1 * scale + centre.y * scale - y);

  if (isAnimating) {
    setAnimationTicker("setPositionFrontObject: " + ID);

    var xTemp =
      (newX - containerFront[appParam.actualFrontImage].x) / speedAnimation;
    var yTemp =
      (newY - containerFront[appParam.actualFrontImage].y) / speedAnimation;
    var isX = false;
    var isY = false;

    animating.obj.add((delta) => {
      if (!isX) {
        containerFront[appParam.actualFrontImage].x += xTemp * delta;
        if (xTemp >= 0) {
          if (containerFront[appParam.actualFrontImage].x >= newX) {
            containerFront[appParam.actualFrontImage].x = newX;
            isX = true;
          }
        } else {
          if (containerFront[appParam.actualFrontImage].x <= newX) {
            containerFront[appParam.actualFrontImage].x = newX;
            isX = true;
          }
        }
      }
      if (!isY) {
        containerFront[appParam.actualFrontImage].y += yTemp * delta;
        if (yTemp >= 0) {
          if (containerFront[appParam.actualFrontImage].y >= newY) {
            containerFront[appParam.actualFrontImage].y = newY;
            isY = true;
          }
        } else {
          if (containerFront[appParam.actualFrontImage].y <= newY) {
            containerFront[appParam.actualFrontImage].y = newY;
            isY = true;
          }
        }
      }

      if (isX && isY) {
        stopAnimationTicker("setPositionFrontObject: " + ID);
      }
    });
  } else {
    containerFront[appParam.actualFrontImage].x = newX;
    containerFront[appParam.actualFrontImage].y = newY;
  }
}

/**
 * Подогнать размер объекта под габариты
 * @param {*} ID
 * @param {*} position [centre, left, right]
 */
function setSizeFrontObjectDefault(
  ID,
  position,
  padding = 0,
  w_cor = 0,
  h_cor = 0,
  isAnimating = false,
  speedAnimation = 60
) {
  var pos;
  var newWidth;
  var newHeight;
  var padding_cor = front[appParam.actualFrontImage].img.param.padding;
  var element = front[appParam.actualFrontImage].objects[ID];

  if (typeof padding_cor == "undefined") {
    padding_cor = 0;
  }

  if (position == "center") {
    pos = 100;
  } else if (position == "topCenter") {
    pos = 100;
  } else if (position == "left") {
    pos = appParam.setPositionFrontObject.positionLeft;
  } else if (position == "right") {
    pos = appParam.setPositionFrontObject.positionRight;
  }

  var scale =
    appParam.width /
    backgroundListTexture["scene_" + appParam.actualFrontImage].orig.width;
  var windowWidht = ((window.innerWidth - w_cor) / 100) * pos - padding_cor / 2;
  var windowHeight = window.innerHeight - h_cor - padding_cor / 2;
  var contRatioWidth = element.cube.width / element.cube.height;
  var windowRatio = windowWidht / windowHeight;

  if (contRatioWidth > windowRatio) {
    newWidth =
      (containerFront[appParam.actualFrontImage].width * windowWidht) /
        (element.cube.width * scale) -
      padding;
    newHeight =
      (newWidth * containerFront[appParam.actualFrontImage].height) /
      containerFront[appParam.actualFrontImage].width;
  } else {
    newHeight =
      (containerFront[appParam.actualFrontImage].height * windowHeight) /
        (element.cube.height * scale) -
      padding;
    newWidth =
      (newHeight * containerFront[appParam.actualFrontImage].width) /
      containerFront[appParam.actualFrontImage].height;
  }

  if (!appParam.setPositionFrontObject.isAction) {
    appParam.setPositionFrontObject.widthAction = appParam.width;
    appParam.setPositionFrontObject.heightAction = appParam.height;
  }

  console.log(appParam.actualFrontImage);
  console.log(front[appParam.actualFrontImage]);
  console.log(front[appParam.actualFrontImage].img);
  console.log(front[appParam.actualFrontImage].img.param);
  console.log(front[appParam.actualFrontImage].img.param.padding);
  console.log(window.innerWidth, w_cor, pos, padding_cor);
  console.log(scale, windowWidht, windowHeight, contRatioWidth, windowRatio);
  console.log(newWidth, newHeight);

  // Подгоняем под высоту
  if (isAnimating) {
    setAnimationTicker("setSizeFrontObjectDefault: " + ID);
    var widthTemp =
      (newWidth - containerFront[appParam.actualFrontImage].width) /
      speedAnimation;
    var heightTemp =
      (newHeight - containerFront[appParam.actualFrontImage].height) /
      speedAnimation;
    var isWidth = false;
    var isHeight = false;

    animating.obj.add((delta) => {
      if (!isWidth) {
        containerFront[appParam.actualFrontImage].width += widthTemp * delta;
        if (widthTemp >= 0) {
          if (containerFront[appParam.actualFrontImage].width >= newWidth) {
            containerFront[appParam.actualFrontImage].width = newWidth;
            isWidth = true;
          }
        } else {
          if (containerFront[appParam.actualFrontImage].width <= newWidth) {
            containerFront[appParam.actualFrontImage].width = newWidth;
            isWidth = true;
          }
        }
      }

      if (!isHeight) {
        containerFront[appParam.actualFrontImage].height += heightTemp * delta;
        if (widthTemp >= 0) {
          if (containerFront[appParam.actualFrontImage].height >= newHeight) {
            containerFront[appParam.actualFrontImage].height = newHeight;
            isHeight = true;
          }
        } else {
          if (containerFront[appParam.actualFrontImage].height <= newHeight) {
            containerFront[appParam.actualFrontImage].height = newHeight;
            isHeight = true;
          }
        }
      }

      if (isWidth && isHeight) {
        stopAnimationTicker("setSizeFrontObjectDefault: " + ID);
      }
    });
  } else {
    containerFront[appParam.actualFrontImage].width = newWidth;
    containerFront[appParam.actualFrontImage].height = newHeight;
  }

  appParam.width = newWidth;
  appParam.height = newHeight;
}

/**
 * Добавить объхект анимации
 */
function setAnimationTicker(ID) {
  historyPrev._isamin = true;

  if (animating.obj == null) {
    animating.obj = new PIXI.Ticker();
  }
  animating.item.push(ID);
}

function stopAnimationTicker(ID) {
  for (let index = 0; index < animating.item.length; index++) {
    const element = animating.item[index];
    if (element == ID) {
      animating.item[index] = -1;
      break;
    }
  }
}

/**
 * Отключение анимации движения объектов
 * @param {*} ID
 */
function destroyAnimationTicker(callback = () => {}) {
  animating.obj.add((delta) => {
    var isDestroy = true;
    for (let index = 0; index < animating.item.length; index++) {
      const element = animating.item[index];
      if (element != -1) {
        isDestroy = false;
        break;
      }
    }

    if (isDestroy) {
      animating.obj.destroy();
      animating.obj = null;
      animating.item = [];
      historyPrev._isamin = false;
      callback();
    }
  });
}

/**
 * Проверка существует ли функция
 * @param {*} functionToCheck
 * @returns
 */
function isFunction(functionToCheck) {
  var getType = {};
  return (
    functionToCheck &&
    getType.toString.call(functionToCheck) === "[object Function]"
  );
}

function historiStackPrev() {
  this._isamin = false;
  this._size = 0;
  this._storage = {};
  this._actual = null;
}

historiStackPrev.prototype.push = function (
  data,
  param = [],
  NOTactual = false
) {
  var temp = "";

  param.forEach(function (entry) {
    temp += entry + ", ";
  });

  var tempActual = data + "(" + temp + ")";

  if (this._actual != null) {
    var size = ++this._size;
    if (NOTactual) {
      this._storage[size] = tempActual;
    } else {
      this._storage[size] = this._actual;
    }
  }

  if (!NOTactual) {
    this._actual = tempActual;
  }

  if (this._size) {
    $("#history-prev").addClass("active");
    $("#history-prev").prop("disabled", false);
  }

  console.log("----push---");
  console.log(this._storage);
  console.log(this._actual);
  console.log(this._size);
};

historiStackPrev.prototype.pop = function () {
  if (!this._isamin) {
    var size = this._size,
      deletedData;

    if (size) {
      deletedData = this._storage[size];

      var blackList = [
        "removePolygonObjectContent",
        "closePolygonObject",
        "videoClose",
        "removeVideoBox",
        "closeGallery",
        "drawShadow",
      ];

      var delTemp = true;
      blackList.forEach((element) => {
        console.log(
          deletedData.indexOf(element) + " " + deletedData + " == " + element
        );
        if (delTemp && deletedData.indexOf(element) == 0) {
          delTemp = false;
        }
      });

      if (delTemp) {
        this._actual = null;
      }

      // if(blackList.indexOf(deletedData) == -1){
      //     this._actual = null;
      // }
      // if(size > 1){

      //     if(deletedData.indexOf('initContainer') == 0){
      //         delTemp = true;
      //         blackList.forEach(element => {
      //             if(delTemp && this._storage[size - 1].indexOf(element) == 0){
      //                 delTemp = false;
      //             }
      //         });

      //         if(!delTemp){
      //             delete this._storage[size-1];
      //             this._size--;
      //         }
      //     }
      // }

      delete this._storage[size];
      this._size--;

      // console.log('----pop---');
      // console.log(this._storage);
      // console.log(this._actual);
      // console.log(this._size);

      return deletedData;
    }
  }
  // console.log('----pop---');
  // console.log(this._storage);
  // console.log(this._actual);
  // console.log(this._size);
};

function historiStackNext() {
  this._storage = null;
}

historiStackNext.prototype.push = function (data, param = []) {
  var temp = "";

  param.forEach(function (entry) {
    temp += entry + ", ";
  });

  this._storage = data + "(" + temp + ")";

  $("#history-next").addClass("active");
  $("#history-next").prop("disabled", false);
};

historiStackNext.prototype.pop = function () {
  var deletedData;

  if (historyNext._storage != null) {
    deletedData = this._storage;
    this._storage = null;

    return deletedData;
  }
};

function historiPrev() {
  soundStopAll();

  if (historyPrev._size) {
    eval(historyPrev.pop());
    if (historyPrev._size == 0) {
      $("#history-prev").removeClass("active");
      $("#history-prev").prop("disabled", true);
    }
  } else {
    $("#history-prev").removeClass("active");
    $("#history-prev").prop("disabled", true);
  }
}

function historiNext() {
  soundStopAll();

  if (historyNext._storage != null) {
    eval(historyNext.pop());
    $("#history-next").removeClass("active");
    $("#history-next").prop("disabled", true);
  }
}

function historiNextClear() {
  if (historyNext._storage != null) {
    historyNext.pop();
    $("#history-next").removeClass("active");
    $("#history-next").prop("disabled", true);
  }
}

var main_overcolor = "#000";
var main_overbackground = "#fff";
var main_overtitle = "#1f1f21";

var overclass = "";
var overcolor = main_overcolor;
var overbackground = main_overbackground;
var overtitle = main_overtitle;

var overcase = null;

// $('body').on('click', '.btn-over', function (e) {
//     soundStopAll();
//     console.log(00000000);

//     isMenu = true;
//     var temp = $(this);
//     temp.addClass('click');

//     overclass           = temp.data('over');
//     overcolor           = temp.data('color') ? temp.data('color') : main_overcolor;
//     overbackground      = temp.data('background') ? temp.data('background') : main_overbackground;
//     overtitle           = temp.data('title') ? temp.data('title') : main_overtitle;
//     overcase            = temp.data('case');

//     $("body").get(0).style.setProperty("--main-bg-color", overbackground);
//     $("body").get(0).style.setProperty("--main-text-color", overcolor);
//     $("body").get(0).style.setProperty("--main-title-color", overtitle);

//     setTimeout(function tick() {
//         $('.over-' + overclass).addClass('d-block');
//         $('.over-' + overclass).removeClass('hide');
//         $('.over-' + overclass).addClass('show');

//         $('.over-' + overclass).show();

//         switch (overclass) {
//             case 'menu':
//                 console.log(111111111);
//             break;
//         }
//     }, 500);

//     setTimeout(function tick2() {
//         temp.removeClass('click');
//     }, 1000);
// });

$("body").on("click", "[data-container]", function (e) {
  var data = $(this).data("container");
  close();
  initContainer(data, true, front[data].img.callback);
});

$("body").on("click", "[data-over], [data-case]", function (e) {
  var obj = $(this);

  overclass = obj.data("over");
  overcolor = obj.data("color") ? obj.data("color") : main_overcolor;
  overbackground = obj.data("background")
    ? obj.data("background")
    : main_overbackground;
  overtitle = obj.data("title") ? obj.data("title") : main_overtitle;
  overcase = obj.data("case");

  eventMenu(overclass, overcase, overcolor, overbackground, overtitle);
});

function eventMenu(
  overclass,
  overcase = null,
  overcolor = main_overcolor,
  overbackground = main_overbackground,
  overtitle = main_overtitle
) {
  $("body").get(0).style.setProperty("--main-bg-color", overbackground);
  $("body").get(0).style.setProperty("--main-text-color", overcolor);
  $("body").get(0).style.setProperty("--main-title-color", overtitle);
  $(".FragmentEvangelie").addClass("z-5");

  if ($(".over-" + overclass).length) {
    isMenu = true;
    $(".over-" + overclass).addClass("d-block");
    $(".over-" + overclass).removeClass("hide");
    $(".over-" + overclass).addClass("show");

    $(".over-" + overclass).show();
  }

  switch (overcase) {
    case 0:
      // close();
      // isObjectOne = true;
      // removeSceneConteinerAll();
      // polygonObjectOnClick(true, 0, 3)
      break;
    case 1:
      // close();
      // removeSceneConteinerAll();
      // initContainer(3, true, front[3].img.callback);
      break;
    case 2:
      close();

      // drawVideoOne('videos/Евангелие. Образы и образа. Тайная вечеря.mp4', -1, -1, true);
      // openFullscreen();
      // // removeSceneConteinerAll();
      // // initContainer(3, false);
      break;
    case 3:
      close();

      drawVideoOne(
        "videos/Фильм Евангелие Образы и образа Тайная вечеря (video-converter.com).mp4",
        -1,
        -1,
        "startVideoEvan",
        true,
        false
      );
      historyNext.push("scene_1_end", [], true);

      $(".startVideoEvan").on("ended", function () {
        historiNext();
      });
      // removeSceneConteinerAll();
      // initContainer(3, false);
      break;
    case 4:
      close();
      // removeSceneConteinerAll();
      initContainer(1, true, front[1].img.callback);

      break;
    case 5:
      showReferenceMenu(".reference", $reference);
      // close();
      // removeSceneConteinerAll();
      // initContainer(3, false);
      break;
    case 6:
      // close();
      // removeSceneConteinerAll();
      // initContainer(3, false);
      break;
    case 7:
      close();
      drawVideoOne(
        "videos/Фильм Евангелие Образы и образа Тайная вечеря (video-converter.com).mp4"
      );

      break;

    case 8:
      // temp =[
      //     {
      //         name: '<p>Апостол Иоанн. Первая четверть XI в. Мозаика арки нартекса. Монастырь Хосиос Лукас, Фокида, Греция</p> <p>Изображение воспроизводится по изданию: Лазарев В. Н. Мозаики Софии Киевской. М.: Искусство, 1960.</p>',
      //         src: 'img/element/gallery/Иконография апостол Иоанн/image001.jpg',
      //     },
      //     {
      //         name: '<p>Апостол Иоанн. Первая четверть XI в. Мозаика арки нартекса. Монастырь Хосиос Лукас, Фокида, Греция</p> <p>Изображение воспроизводится по изданию: Лазарев В. Н. Мозаики Софии Киевской. М.: Искусство, 1960.</p>',
      //         src: 'img/element/gallery/Иконография апостол Иоанн/image001.jpg',
      //     },
      //     {
      //         name: '<p>Апостол Иоанн. Первая четверть XI в. Мозаика арки нартекса. Монастырь Хосиос Лукас, Фокида, Греция</p> <p>Изображение воспроизводится по изданию: Лазарев В. Н. Мозаики Софии Киевской. М.: Искусство, 1960.</p>',
      //         src: 'img/element/gallery/Иконография апостол Иоанн/image001.jpg',
      //     },
      //     {
      //         name: '<p>Апостол Иоанн. Первая четверть XI в. Мозаика арки нартекса. Монастырь Хосиос Лукас, Фокида, Греция</p> <p>Изображение воспроизводится по изданию: Лазарев В. Н. Мозаики Софии Киевской. М.: Искусство, 1960.</p>',
      //         src: 'img/element/gallery/Иконография апостол Иоанн/image001.jpg',
      //     },
      // ];

      // drawGalleryFull(null, temp);

      break;

    case 11:
      close();

      drawVideoOne(
        "videos/Моление о чаше. Серия 2 Видео.mp4",
        -1,
        -1,
        "startVideoEvan",
        true,
        false
      );
      historyNext.push("scene_5_end1", [], true);

      $(".startVideoEvan").on("ended", function () {
        historiNext();
      });
      // removeSceneConteinerAll();
      // initContainer(3, false);
      break;

    case 12:
      close();

      drawVideoOne(
        "videos/Композиция 2.mp4",
        -1,
        -1,
        "startVideoEvan",
        true,
        false
      );
      historyNext.push("scene_5_end2", [], true);

      $(".startVideoEvan").on("ended", function () {
        historiNext();
      });
      // removeSceneConteinerAll();
      // initContainer(3, false);
      break;
    case 13:
      initContainer(7, true, front[7].img.callback);

    case 15:
      close();

      drawVideoOne(
        "videos/Распятие_основное_видео.mp4",
        -1,
        -1,
        "startVideoEvan",
        true,
        false
      );
      historyNext.push("scene_12_end1", [], true);

      $(".startVideoEvan").on("ended", function () {
        historiNext();
      });
      // removeSceneConteinerAll();
      // initContainer(3, false);
      break;

    case 16:
      close();

      drawVideoOne(
        "videos/Музыкальный_образ_Распятие.mp4",
        -1,
        -1,
        "startVideoEvan",
        true,
        false
      );
      historyNext.push("scene_13_end1", [], true);

      $(".startVideoEvan").on("ended", function () {
        historiNext();
      });
      // removeSceneConteinerAll();
      // initContainer(3, false);
      break;

    case 17:
      close();

      drawVideoOne("videos/Суд.mp4", -1, -1, "startVideoEvan", true, false);
      historyNext.push("scene_14_end1", [], true);

      $(".startVideoEvan").on("ended", function () {
        historiNext();
      });
      // removeSceneConteinerAll();
      // initContainer(3, false);
      break;

    case 18:
      close();

      drawVideoOne(
        "videos/Приведение к Пилату.mp4",
        -1,
        -1,
        "startVideoEvan",
        true,
        false
      );
      historyNext.push("scene_15_end1", [], true);

      $(".startVideoEvan").on("ended", function () {
        historiNext();
      });
      // removeSceneConteinerAll();
      // initContainer(3, false);
      break;

    case 19:
      close();

      drawVideoOne(
        "videos/Путь на Голгофу.mp4",
        -1,
        -1,
        "startVideoEvan",
        true,
        false
      );
      historyNext.push("scene_15_end1", [], true);

      $(".startVideoEvan").on("ended", function () {
        historiNext();
      });
      // removeSceneConteinerAll();
      // initContainer(3, false);
      break;

    case 20:
      close();

      drawVideoOne(
        "videos/Погребение Христа.mp4",
        -1,
        -1,
        "startVideoEvan",
        true,
        false
      );
      historyNext.push("scene_15_end1", [], true);

      $(".startVideoEvan").on("ended", function () {
        historiNext();
      });
      // removeSceneConteinerAll();
      // initContainer(3, false);
      break;

    case 21:
      close();

      drawVideoOne(
        "videos/_06 Распятие Христа (1) (1).mp4",
        -1,
        -1,
        "startVideoEvan",
        true,
        false
      );
      historyNext.push("scene_15_end1", [], true);

      $(".startVideoEvan").on("ended", function () {
        historiNext();
      });
      // removeSceneConteinerAll();
      // initContainer(3, false);
      break;

    case 22:
      close();

      drawVideoOne(
        "videos/_03 Суд Синедриона (1).mp4",
        -1,
        -1,
        "startVideoEvan",
        true,
        false
      );
      historyNext.push("scene_15_end1", [], true);

      $(".startVideoEvan").on("ended", function () {
        historiNext();
      });
      // removeSceneConteinerAll();
      // initContainer(3, false);
      break;

    case 23:
      close();

      drawVideoOne(
        "videos/_04 Приведение к Пилату (1).mp4",
        -1,
        -1,
        "startVideoEvan",
        true,
        false
      );
      historyNext.push("scene_15_end1", [], true);

      $(".startVideoEvan").on("ended", function () {
        historiNext();
      });
      // removeSceneConteinerAll();
      // initContainer(3, false);
      break;

    case 24:
      close();

      drawVideoOne(
        "videos/_05 Путь на Голгофу (1).mp4",
        -1,
        -1,
        "startVideoEvan",
        true,
        false
      );
      historyNext.push("scene_15_end1", [], true);

      $(".startVideoEvan").on("ended", function () {
        historiNext();
      });
      // removeSceneConteinerAll();
      // initContainer(3, false);
      break;

    case 25:
      close();

      drawVideoOne(
        "videos/_02 Моление о чаше (1).mp4",
        -1,
        -1,
        "startVideoEvan",
        true,
        false
      );
      historyNext.push("scene_15_end1", [], true);

      $(".startVideoEvan").on("ended", function () {
        historiNext();
      });
      // removeSceneConteinerAll();
      // initContainer(3, false);
      break;

    case 26:
      close();

      drawVideoOne(
        "videos/_01 Тайная Вечеря (1).mp4",
        -1,
        -1,
        "startVideoEvan",
        true,
        false
      );
      historyNext.push("scene_15_end1", [], true);

      $(".startVideoEvan").on("ended", function () {
        historiNext();
      });
      // removeSceneConteinerAll();
      // initContainer(3, false);
      break;

    case 27:
      close();

      drawVideoOne(
        "videos/_07 Погребение Христа (1).mp4",
        -1,
        -1,
        "startVideoEvan",
        true,
        false
      );
      historyNext.push("scene_31_end1", [], true);

      $(".startVideoEvan").on("ended", function () {
        historiNext();
      });
      // removeSceneConteinerAll();
      // initContainer(3, false);
      break;
  }
}

function close() {
  $(".over").removeClass("show");
  $(".over").addClass("hide");
  $(".FragmentEvangelie").removeClass("z-5");

  $("body").get(0).style.setProperty("--main-bg-color", main_overbackground);
  $("body").get(0).style.setProperty("--main-text-color", main_overcolor);
  $("body").get(0).style.setProperty("--main-title-color", main_overtitle);

  setTimeout(function tick2() {
    $(".over").removeClass("d-block");
  }, 500);
  isMenu = false;
}

$("body").on("click", ".btn-close", function (e) {
  close();
});

var if_flag = false;

$(".goScrollToContent-full").on("click", function (e) {
  e.preventDefault();

  var href = $(this).attr("href");

  $(".content-full").mCustomScrollbar("scrollTo", href, {
    scrollInertia: 1500,
  });

  // switch (href) {
  //     case '#m-f-n-j-p':
  //         if(!if_flag){
  //             if_flag = true;
  //         }

  //         break;
  // }
});

if ($(".content-full").length) {
  $(".content-full").mCustomScrollbar({
    theme: "dark",
    scrollEasing: "easeInOut",
    scrollInertia: 1500,
    mouseWheel: { enable: true },
  });
}

$("body").on("click", ".contentElementImgGOTO", function (e) {
  e.preventDefault();

  if (typeof $(this).data("id-scene") === "undefined") {
    var tempDataGO =
      front[appParam.actualFrontImage].objects[
        appParam.setPositionFrontObject.ID
      ].imgGOTO;

    if (
      typeof tempDataGO.id_element === "undefined" &&
      typeof tempDataGO.id_scene !== "undefined"
    ) {
      initContainer(
        tempDataGO.id_scene,
        true,
        front[tempDataGO.id_scene].img.callback
      );
    } else if (typeof tempDataGO.id_element !== "object") {
      polygonObjectOnClick(e, tempDataGO.id_element, tempDataGO.id_scene);
    } else if (tempDataGO.id_element.length == 1) {
      polygonObjectOnClick(e, tempDataGO.id_element[0], tempDataGO.id_scene);
    } else {
      var tempElement = "";
      tempDataGO.id_element.forEach((item) => {
        var temp = front[tempDataGO.id_scene].objects[item];
        tempElement +=
          '<div class="goToALbtn contentElementImgGOTO" data-id-scene="' +
          tempDataGO.id_scene +
          '" data-id-element="' +
          item +
          '"><img src="' +
          temp.img +
          '" alt="' +
          temp.name +
          '"></div>';
      });

      $("#launch-content").append(
        '<div class="contentElementContentVideo"><div class="video-flex">' +
          tempElement +
          "</div></div>"
      );
    }
  } else {
    var tempIDscene = $(this).data("id-scene");
    var tempIDelement = $(this).data("id-element");

    polygonObjectOnClick(e, tempIDelement, tempIDscene);
  }
});

$("body").on("click", ".contentElementBottonGOTO", function (e) {
  e.preventDefault();

  var bottonGOTO =
    front[appParam.actualFrontImage].objects[appParam.setPositionFrontObject.ID]
      .bottonGOTO;

  initContainer(
    bottonGOTO.id_scene,
    true,
    front[bottonGOTO.id_scene].img.callback
  );
});

function drawMenu(scene, menu, w, h, padding, s) {
  var wItem = w;
  for (let index = 0; index < menu.length; index++) {
    const element = menu[index];
    wItem +=
      drawItemMenu(scene, element.name, wItem, h, padding, element.callback) +
      s;
  }
}

function drawItemMenu(scene, text, w, h, padding, callback) {
  const menu = new PIXI.HTMLText(
    text,
    new PIXI.TextStyle(textStyleDefault.scene_0_menu)
  );
  menu.x = w;
  menu.y = h;

  var graphics = new PIXI.Graphics();
  graphics.lineStyle(2, 0xa17622, 1);
  graphics.beginFill(0xa17622, 1);
  graphics.drawRoundedRect(
    w - padding,
    h - (padding - 3),
    menu.width + padding * 2,
    padding * 2 + 20,
    5
  );
  graphics.endFill();
  graphics.interactive = true;
  graphics.buttonMode = true;
  graphics.on("pointerdown", (event) => {
    callback();
  });
  graphics.on("pointerover", (event) => {
    if (!isMenu && !isObjectOne) {
      graphics.alpha = 0.65;

      const instance = audioList["stuk3"].play({
        singleInstance: true,
        volume: 0.1,
      });
      instance.on("end", function () {
        audioList["stuk3"].stop();
      });
    }
  });
  graphics.on("pointerout", (event) => {
    graphics.alpha = 1;
  });

  scene.addChild(graphics);
  scene.addChild(menu);

  return menu.width + 20;
}

$("body").on("pointerover", ".button-interactive", (event) => {
  const instance = audioList["stuk3"].play({
    singleInstance: true,
    volume: 0.1,
  });
  instance.on("end", function () {
    audioList["stuk3"].stop();
  });
});

function drawTOPMenu(scene) {
  // TOPmenu = [];

  drawItemTOPMenu(scene, "menu", "menu", 50, 15, true, () => {
    eventMenu("menu");
  });
  drawItemTOPMenu(
    scene,
    "sound",
    mutedAll ? "sound-off" : "sound-on",
    50,
    55,
    true,
    sound_mute
  );
  drawItemTOPMenu(
    scene,
    "prev",
    "prev",
    50,
    100,
    historyPrev._size == 0 ? false : true,
    historiPrev
  );
  drawItemTOPMenu(
    scene,
    "next",
    "next",
    50,
    140,
    historyNext._storage == null ? false : true,
    historiNext
  );
}

function drawItemTOPMenu(
  scene,
  name,
  img,
  w,
  h,
  visible = true,
  callback = () => {}
) {
  // const filter = new PIXI.filters.ColorMatrixFilter();
  // var colorMatrix =  [
  //     255 / 255, 0.0, 0.0, 0.0,
  //     0.0, 0 / 255, 0.0, 0.0,
  //     0.0, 0.0, 0 / 255, 0.0,
  //     0.0, 0.0, 0.0, 1.0
  // ];
  // filter.matrix = colorMatrix;
  // menu.filters = [filter];

  var menu = PIXI.Sprite.from(backgroundListTexture[img]);
  menu.anchor.x = 0;
  menu.anchor.y = 0;
  menu.position.x = 1920 - w;
  menu.position.y = h;
  menu.interactive = true;
  menu.buttonMode = true;
  menu.scale.x = 0.2;
  menu.scale.y = 0.2;
  menu.interactive = true;
  menu.buttonMode = true;
  menu.visible = visible;
  menu.on("pointerdown", (event) => {
    callback();
  });
  menu.on("pointerover", (event) => {
    if (!isMenu && !isObjectOne) {
      menu.alpha = 0.65;

      // const instance = audioList['stuk3'].play({
      //     singleInstance: true
      // });
      // instance.on('end', function() {
      //     audioList['stuk3'].stop();
      // });
    }
  });
  menu.on("pointerout", (event) => {
    menu.alpha = 1;
  });
  scene.addChild(menu);

  TOPmenu[name] = menu;
}

function get(name) {
  if (
    (name = new RegExp("[?&]" + encodeURIComponent(name) + "=([^&]*)").exec(
      location.search
    ))
  )
    return decodeURIComponent(name[1]);
}

function setInterFASE(id) {
  $("#interFASElogo").html(interFASE[id]["logo"]);
  $("#interFASEover").html(interFASE[id]["over"]);

  $("#interFASEmenu").attr("data-id", id);

  if (interFASE[id]["menu"] != "") {
    $("#interFASEmenu").html(
      interFASE[id]["menu"] +
        '<button type="button" id="close_mobile" class="w-100 button-menu button-interactive btn-menu">Закрыть</button>'
    );
    $("#menu_mobile").addClass("active");
  } else {
    $("#interFASEmenu").html(interFASE[id]["menu"]);
    $("#menu_mobile").removeClass("active");
  }
}

$("body").on("click", "#menu_mobile", (event) => {
  id = $("#interFASEmenu").attr("data-id");
  if (interFASE[id]["menu"] != "") {
    $("#interFASEmenu").toggleClass("d-flex");
  }
});

$("body.mobile").on("click", "#interFASEmenu .button-menu", (event) => {
  id = $("#interFASEmenu").attr("data-id");
  if (interFASE[id]["menu"] != "") {
    $("#interFASEmenu").toggleClass("d-flex");
  }
});
