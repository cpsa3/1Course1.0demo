function httpGetSync(filePath) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/base/app/" + filePath, false);
    xhr.send();
    return xhr.responseText;
}

function preloadTpl(path) {
    return inject(function($templateCache) {
        var response = httpGetSync(path);
        $templateCache.put(path, response);
    });
}