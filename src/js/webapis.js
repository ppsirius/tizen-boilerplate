let webApi;

webApi = document.createElement("script");
webApi.type = "text/javascript";
webApi.src = "$WEBAPIS/webapis/webapis.js";

function appendWebApis() {
    if (window.tizen) {
        document.body.appendChild(webApi);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    appendWebApis();
});

