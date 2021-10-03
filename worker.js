let config = {
    extension: {
        enable: false,
        firstTime: true,
    },
    money: {
        USD: {
            enable: false,
            quote: {
                ARS: 0.0,
                PVU: 0.0,
                LE: 0.0
            }
        },
        ARS: {
            enable: false,
            quote: {
                USD: 0.0,
                PVU: 0.0,
                LE: 0.0
            }
        },
        PVU: {
            enable: false,
            quote: {
                USD: 0.0,
                ARS: 0.0,
                LE: 0.0
            }
        },
        LE: {
            enable: false,
            quote: {
                USD: 0.0,
                ARS: 0.0,
                PVU: 0.0
            }
        }
    }
}

chrome.runtime.onInstalled.addListener(() => {

    chrome.storage.sync.get('config', (data) => {
        if (data !== undefined && config in data) {
            config = data.config
        }

        if (config.extension.firstTime) {
            updateMoney()
        }

        config.extension.firstTime = false
    })

    saveConfig()
})
