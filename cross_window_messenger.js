function CrossWindowMessenger(enableListener) {

    var uniqueIdParameterName = "uid";
    var callbackStorage = [];


    if (enableListener) {
        window.addEventListener("message", function (event) {
            callbackStorage.forEach(function (item) {
                if (item.uniqueId = event.data.uniqueId) {
                    item.callback(event.data.payload);
                }
            });
        });
    }

    this.openWindow = function (windowURL, callback) {
        var uniqueId = generateUniqueId();

        //Можно расширить параметры, в зависимости от того с какими открываются окна
        window.open(prepareURL(windowURL, uniqueId));

        callbackStorage.push({
            uniqueId: uniqueId,
            callback: callback
        });
    };

    this.sendReturnMessage = function (payload) {
        var uniqueId = parseUniqueIdParameter();
        if (window.opener !== null) {
            window.opener.postMessage({
                uniqueId: uniqueId,
                payload: payload
            }, "*");
        }
    };

    function parseUniqueIdParameter() {
        var url = window.location.href;
        var regex = new RegExp("[?&]" + uniqueIdParameterName + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function prepareURL(rawURL, uniqueId) {
        if (rawURL.indexOf("?") === -1) {
            return rawURL + '?' + uniqueIdParameterName + "=" + uniqueId;
        } else {
            return rawURL + '&' + uniqueIdParameterName + "=" + uniqueId;
        }
    }

    function generateUniqueId() {
        var ts = String(new Date().getTime()), i, out = '';
        for (i = 0; i < ts.length; i += 2) {
            out += Number(ts.substr(i, 2)).toString(36);
        }
        return out;
    }
}