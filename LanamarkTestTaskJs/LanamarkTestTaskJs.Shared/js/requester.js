(function () {
    "use strict";

    window.processLookups = function (serialNumbers) {
        if (!Array.isArray(serialNumbers) || serialNumbers.length === 0)
            alert("Incorrect parameter: should be not empty array");

        function process(item) {
            var values = item.split(',');

            var options = {
                url: 'https://support.lenovo.com/services/by/be/SystemXWarrantyLookup/QueryWarrantyStatus',
                type: 'POST',
                data: 'SerialNumber=' + values[0] + '&MachineType=' + values[1],
                headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }
            }

            function callback(responseText, status) {
                if (status === 200) {
                    var response = JSON.parse(responseText);
                    if (!!response.IsSucceeded) {
                        var data = JSON.stringify(response.Data);
                        output(data);
                    } else {
                        output('Has no matching data');
                    }
                } else {
                    output("Error obtaining a lookup. XHR status code: " + status);
                }
            }

            function output(value) {
                var listView = $('#basicListView')[0].winControl;
                Lookups.data.push({ title: item, text: value });
                var itemList = new WinJS.Binding.List(Lookups.data);
                listView.itemDataSource = itemList.dataSource;
                listView.selectionMode = WinJS.UI.SelectionMode.single;
                listView.tapBehavior = WinJS.UI.TapBehavior.none;
            }

            WinJS.xhr(options).done(
                function (result) {
                    callback(result.responseText, result.status);
                },
                function (result) {
                    callback(null, result.status);
                }
            );
        }

        function sleep(delay) {
            var start = new Date().getTime();
            while (new Date().getTime() < start + delay);
        }

        var promise = new WinJS.Promise(function(){});

        $.each(serialNumbers, function (index, item) {
            promise.then(process(item))
                .then(sleep(window.requestPause));
        });
    }
}
)()