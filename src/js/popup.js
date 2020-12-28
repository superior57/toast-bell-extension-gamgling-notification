const btnSave = document.getElementById("btnSave");

const fTime = document.getElementById("fTime");
const sTime = document.getElementById("sTime");
const cName = document.getElementById("cName");
const tName = document.getElementById("tName");

cName.value = "osg-clock";
tName.value = "osg-event__teams";
fTime.value = "00:00";
sTime.value = "00:00";

localStorage.cName = localStorage.cName == "" || localStorage.cName == 'undefined' ? 'osg-clock' : localStorage.cName;

initialForms();
// events ...
btnSave.addEventListener(
    "click",
    evt => {
        handleSaveButton();
    },
    false
);

// functions ...
function initialForms() {
    chrome.tabs.getSelected(function(tab) {
        var url = JSON.stringify(tab.url.split('/')[2]);
        if (localStorage.tabsInfo != '') {
            var data = JSON.parse(localStorage.tabsInfo);
            var stored_info = data.find(t => t.url == url);
            if (stored_info) {
                cName.value = stored_info.class_name;
                fTime.value = stored_info.f_time;
                sTime.value = stored_info.s_time;
                tName.value = stored_info.t_name;
            }
        }
    });
}

const handleSaveButton = () => {
    chrome.tabs.getSelected(function(tab) {
        var url = JSON.stringify(tab.url.split('/')[2]);
        var currentData = localStorage.tabsInfo;
        var data = {
            id: tab.id,
            url: url,
            class_name: cName.value,
            f_time: fTime.value,
            s_time: sTime.value,
            t_name: tName.value
        };
        if (currentData == "") {
            currentData = [data];
        } else {
            currentData = JSON.parse(currentData);
            if (currentData.find(element => element.url == data.url)) {
                currentData = currentData.filter(element => element.url != url);
            }
            currentData.push(data);
        }
        localStorage.tabsInfo = JSON.stringify(currentData);
    });
};