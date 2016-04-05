// data.js
(function () {
    "use strict";

    var data = [];
    var itemList = new WinJS.Binding.List(data);
    WinJS.Namespace.define("Lookups", { itemList: itemList, data: data });

})();