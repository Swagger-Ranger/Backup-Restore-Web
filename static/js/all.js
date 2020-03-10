(function (doc, win) {
    var docEl = doc.documentElement,
    
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        docEl.style.fontSize = clientWidth / 18 + 'px';
    };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
}) (document, window);

function fontSize(res){
    let docEl = document.documentElement,
        clientWidth = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
    if (!clientWidth) return;
    let fontSize = 200 * (clientWidth / 3840);
    return res*fontSize;
}