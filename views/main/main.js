let config = {}

chrome.storage.sync.get('config', (data) => {
    config = data.config

    updateState()
})

function updateState(){
    if ( config.extension.enable ){
        $("#chkMakeup").prop('checked', true)
        $("#divBodyMakeup").show()
    } else {
        $("#chkMakeup").prop('checked', false)
        $("#divBodyMakeup").hide()
    }
}

$("#chkMakeup").click(() => {
    $("#divBodyMakeup").fadeToggle()
    config.extension.enable = !config.extension.enable

    chrome.storage.sync.set({config})
})

