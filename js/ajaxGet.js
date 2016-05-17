/*
 * Uses AJAX to retrieve information or submit data.
 */

(function() {

/**
 * Retrieves content from URL using AJAX and
 * invokes callback() when successful.
 */
function ajaxGet(url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            callback(xhttp.responseText);
        }
    };
    xhttp.open("GET", url);
    xhttp.send();
}

// Create global 'sr' object
window.sr = {};

// Add functions to sr object
window.sr.ajaxGet = ajaxGet;

})();
