initialLocalStorage();

function initialLocalStorage() {
    // if (localStorage.isSet) return;
    localStorage.tabsInfo = '';
    localStorage.isSet = true;
}


function getDOM(class_name) {
    var arr_elements = document.getElementsByClassName(class_name);
    var arr_res = '';
    for (var i = 0; i < arr_elements.length; i++) {
        let element = arr_elements[i];
        arr_res += element.innerHTML;
        arr_res += ",";
    }
    return arr_res;
}



const windowsLooping = () => {
    if (localStorage.tabsInfo != '') {
        var data = JSON.parse(localStorage.tabsInfo);
        // var tabs = [];

        chrome.windows.getAll({ populate: true }, function(windows) {
            for (var i = 0; i < windows.length; ++i) {
                var w = windows[i];
                for (var j = 0; j < w.tabs.length; ++j) {
                    var tab = w.tabs[j];
                    var url = JSON.stringify(tab.url.split('/')[2]);
                    var stored_info = data.find(t => t.url == url);
                    if (stored_info) {
                        countDown(stored_info);
                    }
                    // tabs.push(tab);
                }
            }

        });
    }
}

function show(title, message) {
    var notification = new Notification(title, {
        icon: 'src/img/48.png',
        body: message
    });

    notification.addEventListener('click', function() {
        var query = title.replace(" ", "+");
        runScript(`
        window.open("http://www.google.com/search?q=` + query + `");
        `);
    })

}

const runScript = (script) => {
    chrome.tabs.executeScript(null, {
        code: script
    });
};

const playSound = (src) => {
    const sound = new Audio();
    sound.src = 'src/audio/' + src;
    sound.play();
};

function getEventData(class_event, class_title, class_clock) {
    var arr_elements = document.getElementsByClassName(class_event);
    var arr_res = [];
    for (var i = 0; i < arr_elements.length; i++) {
        let event = arr_elements[i];
        let title = event.getElementsByClassName(class_title)[0];
        let clock = event.getElementsByClassName(class_clock)[0];

        if (clock) {
            title = title.innerHTML;
            clock = clock.innerHTML;
            arr_res.push({
                title: title,
                clock: clock
            });
        }
    }
    return JSON.stringify(arr_res);
}

const countDown = async(tab) => {

    var script = '(' + getEventData + ')("osg-event", ' + JSON.stringify(tab.t_name) + ', ' + JSON.stringify(tab.class_name) + ');';
    chrome.tabs.executeScript(tab.id, {
        code: script
    }, (results) => {
        var events = JSON.parse(results[0]);
        // runScript('console.log(' + JSON.stringify(events) + ')');

        events.forEach(evt => {
            var title = evt.title;
            var clock = evt.clock;
            // runScript('console.log(' + JSON.stringify(clock) + ', ' + JSON.stringify(tab.f_time) + ')');
            var opt = {
                type: "basic",
                title: "Primary Title",
                message: "Primary message to display",
                iconUrl: "url_to_small_icon"
            }

            if (clock != "") {
                if (clock == tab.f_time) {
                    show(title, "This is the first sounds");
                    playSound('sound1.mp3');

                } else if (clock == tab.s_time) {
                    show(title, "This is the second sounds");
                    playSound('sound2.mp3');
                }
            }
        });

    });
};

setInterval(function() {
    windowsLooping();
}, 1000);