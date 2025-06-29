
// Поулчить аудио
function appendAudio(src, elem = null, type = 'audio/mpeg', clas = '', atr = '') {
    var html = '<audio ="playerAudio ' + clas + '"' + atr + '>';
        html += '<source src="' + src + '" type="'+ type +'" />';
        html += '<a href="' + src + '" download>Download</a></audio>';
        
    if (elem == null)
        return html;

    $(elem).append(html);
}


// Поулчить видео
function drawVideo(src, img = '', elem = null, type = 'udio/mpeg', size = '1080', clas= '', atr = '') {
    var html = '<video class="playerVideo ' + clas + '" ' + atr + ' poster="' + img + '">';
        html += '<source src="' + src + '" type="' + type + '" size="' + size + '" />';
        html += '<a href="' + src + '" download>Download</a></video>';

    if (elem == null)
        return html;

    $(elem).append(html);
}