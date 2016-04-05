// For an introduction to the Hub/Pivot template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=392285
(function () {
    "use strict";

    var activation = Windows.ApplicationModel.Activation;
    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;

    window.alert = function (message) {
        var msgBox = new Windows.UI.Popups.MessageDialog(message);
        msgBox.showAsync();
    }

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application was suspended and then terminated.
                // To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
            }
            
            $('#uploadCsv').on('change', function (e) {
                var files = e.target.files;
                if (files.length > 1) {
                    alert('Please select only one file');
                    return;
                }
                if (files.length === 0) {
                    alert('Please select a file');
                    return;
                }

                var file = files[0];
                if (!file.name.endsWith('.csv')) {
                    alert('Please select a csv file');
                    return;
                }

                if (typeof (FileReader) != "undefined") {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var rows = e.target.result.split("\n");
                        var lines = [];
                        for (var i = 0; i < rows.length; i++) {
                            var cells = rows[i].split(",");
                            lines[i] = cells[0];
                            for (var j = 1; j < cells.length; j++) {
                                lines[i] += ',' + cells[j].trim();
                            }
                        }
                        if (window.processLookups != undefined)
                            window.processLookups(lines);
                    }
                    reader.readAsText(file);

                } else {
                    alert("This browser does not support HTML5.");
                }
            });

            window.requestPause = 0;
            $('#requestPause').on('change', function (e) {
                window.requestPause = $(e.target)[0].value * 1000;
            });

            hookUpBackButtonGlobalEventHandlers();
            nav.history = app.sessionState.history || {};
            nav.history.current.initialPlaceholder = true;

            // Optimize the load of the application and while the splash screen is shown, execute high priority scheduled work.
            ui.disableAnimations();
            var p = ui.processAll()

               .then(function () {
                    ui.enableAnimations();
                })
                .then(function completed() {

                });

            args.setPromise(p);
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    function hookUpBackButtonGlobalEventHandlers() {
        // Subscribes to global events on the window object
        window.addEventListener('keyup', backButtonGlobalKeyUpHandler, false)
    }

    // CONSTANTS
    var KEY_LEFT = "Left";
    var KEY_BROWSER_BACK = "BrowserBack";
    var MOUSE_BACK_BUTTON = 3;

    function backButtonGlobalKeyUpHandler(event) {
        // Navigates back when (alt + left) or BrowserBack keys are released.
        if ((event.key === KEY_LEFT && event.altKey && !event.shiftKey && !event.ctrlKey) || (event.key === KEY_BROWSER_BACK)) {
            nav.back();
        }
    }

    app.start();
})();
