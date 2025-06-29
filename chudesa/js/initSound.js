var audioList = {};

const mainSoundList = {
    system: {
        stuk3: 'sound/dz_new.mp3',
    },

};

var mutedAll = false;

$('#sound-mute').on('click', ()=>{
    $('#sound-mute').toggleClass('sound-on');
    $('#sound-mute').toggleClass('sound-off');
    mutedAll = mutedAll ? false : true;

    $('#videoALcont').prop('muted', mutedAll);
    PIXI.sound.toggleMuteAll();
});

$('body').on('click', '#sound-play-one', function(){
    var soundName   = $(this).attr('data-id');
    var sound       = audioList[soundName];

    if ($(this).hasClass ('sound-play')){
        sound.stop();
        soundProgressBar(soundName, 0);
    }else{
        soundPlay(sound, soundName);
    }

    $('#' + $(this).attr('id') + ' i').toggleClass(['fa-play', 'fa-pause']);
    $(this).toggleClass('sound-play');
});


$('body').on('click', '#sound-stop-one', function(){
    var soundName   = $(this).attr('data-id');
    audioList[soundName].stop();

    soundProgressBar(soundName, 0);
});

$('body').on('click', '#sound-stop-all', function(){
    PIXI.sound.stopAll();
});


function soundProgressBar(soundName, progress) {
    $('#sound-progresss-' + soundName).css({
        width : (progress * 100) + '%'
    });
}

 
$('body').on('click', '.progress', function(event){
    
    var newProgress = (event.pageX - $(this).offset().left) / $(this).width();
    var soundName   = $(this).attr('data-id');
    var sound       = audioList[soundName];
    if($('#sound-play-one[data-id="' + soundName + '"]').hasClass('sound-play')){

        // sound.stop();
        // soundPlay(sound, soundName, 0);
    
        var newTime     = (sound._instances[0]._duration * newProgress);
    
        soundProgressBar(soundName, newProgress);
        soundPlay(sound, soundName, newTime);
    }

});


function soundPlay(sound, soundName, startTime = 0, loop = false) {
    const instance = sound.play({
        start: startTime,
        singleInstance: true,
        loop: loop,
    });
    instance.on('progress', function(progress, duration) {
        soundProgressBar(soundName, progress);
    });
    instance.on('end', function() {
        sound.stop();
        $('#sound-play-one[data-id="' + soundName + '"]' + ' i').toggleClass(['fa-play', 'fa-pause']);
        $('#sound-play-one[data-id="' + soundName + '"]').toggleClass('sound-play');
    });
    return sound;
}


function soundStopAll() {
    PIXI.sound.stopAll();

    $('#sound-play-one').each(function () {
        $(this).removeClass('sound-play');
    });
    $('#sound-play-one i').each(function () {
        $(this).addClass(['fa-play']);
        $(this).removeClass(['fa-pause']);
    });
}


// audioList  НЕ В ЭТОМ ФАЙЛЕ!!!!!!!!!!!!!

// const paused = PIXI.sound.togglePauseAll();
// PIXI.sound.stopAll();