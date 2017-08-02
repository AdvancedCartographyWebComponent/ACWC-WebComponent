(function(window, document, undefined) {
    L.MyMarkers = {};
    L.MyMarkers.version = "1.0.1";
    L.MyMarkers.Icon = L.Icon.extend({
        options: {
            iconSize: [ 35, 45 ],
            iconAnchor: [ 17, 42 ],
            popupAnchor: [ 1, -32 ],
            shadowAnchor: [ 10, 12 ],
            shadowSize: [ 36, 16 ],
            className: "my-marker",
            prefix: "",
            extraClasses: "",
            shape: "circle",
            icon: "",
            innerHTML: "",
            color: "red",
            number: "",
            isAnchor:false,
            animation : null
        },
        initialize: function(options) {
            options = L.Util.setOptions(this, options);
        },
        createIcon: function() {
            var div = document.createElement("div"), options = this.options;
            //TODO Set speed by element.setAttribute(speed, "1")

            if (options.icon) {
                div.innerHTML = this._createInner();
            }
            if (options.innerHTML) {
                div.innerHTML = options.innerHTML;
            }
            this._setIconStyles(div);
            return div;
        },
        _createInner: function() {
            var iconColorStyle = "", iconNumber = "", options = this.options;
            if (options.color) {
                iconColorStyle = "style='color: " + options.color + ";' ";
            }
            if (options.number) {
                iconNumber = "number='" + options.number + "' ";
                iconColorStyle = "style='color: " + options.color + ";font-size:12px;'";
            }
            if (options.isAnchor) {
              return "<div class =\"marker-wrapper icon-marker\"></div><i " + iconNumber + iconColorStyle +"class='" + options.extraClasses + " " + options.prefix + " " + options.icon + "'></i>";
            }else {
              return "<i " + iconNumber + iconColorStyle +"class='" + options.extraClasses + " " + options.prefix + " " + options.icon + "'></i>";
            }



        },
        _setIconStyles: function(img) {
            var options = this.options, size = L.point(options["iconSize"]), anchor, leafletName;
            anchor = L.point(options.iconAnchor);
            leafletName = "icon";
            if (!anchor && size) {
                anchor = size.divideBy(2, true);
            }
            if (!options.isAnchor) img.style.pointerEvents = "auto";
            img.className = "leaflet-marker-" + leafletName  + " " + options.className;
            if(options.animation) img.setAttribute("speed", options.animation);
            if (anchor) {
                img.style.marginLeft = -anchor.x + "px";
                img.style.marginTop = -anchor.y + "px";
            }
            if (options.color){
              img.style.color = options.color;
            }
        }
    });
    L.MyMarkers.icon = function(options) {
        return new L.MyMarkers.Icon(options);
    };
})(window, document);
