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

//update money
setInterval(updateMoney, 10 * 60 * 1000)

function saveConfig(){
    chrome.storage.sync.set({ config })
}

chrome.runtime.onInstalled.addListener(() => {

    chrome.storage.sync.get('config', (data) => {
        console.log(`[onInstalled] config: ${JSON.stringify(data)}`)
        if (data !== undefined && config in data) {
            config = data.config
        }

        if (config.extension.firstTime) {
            console.log(`[onInstalled] firstTime`)
        }

        config.extension.firstTime = false
        saveConfig()
    })

    chrome.tabs.onActivated.addListener((activeInfo)=>{
        console.log(`[onActivated]: ${JSON.stringify(activeInfo)}`)
        chrome.tabs.get(activeInfo.tabId).then( (tab)=>{
            console.log(`[onActivated] tab getted`, tab)

            if (tab.status!=="complete"){
                return
            }

            if (tab.url=="https://marketplace.plantvsundead.com/farm#/farm"){
                chrome.scripting.executeScript({
                    target: {
                        tabId: tab.id
                    },
                    function: makeupFarmPage
                })
            }
        } )
    })
})

function updateMoney() {

    fetch(`https://api.coingecko.com/api/v3/coins/plant-vs-undead-token`)
        .then(response => response.json())
        .then(data => {
            console.log('[updateMoney] start')

            const le2pvu = 550
            const pvu2le = 105

            const pvu2usd = data.market_data.current_price.usd
            const pvu2ars = data.market_data.current_price.ars * 2

            config.money.LE.quote.PVU = 1/le2pvu   //Swap price LE to PVU
            config.money.PVU.quote.LE = pvu2le //Swap price PVU to LE

            config.money.PVU.quote.USD = pvu2usd
            config.money.PVU.quote.ARS = pvu2ars
            
            config.money.USD.quote.ARS = pvu2ars/pvu2usd
            config.money.USD.quote.PVU = 1/pvu2usd
            config.money.USD.quote.LE = pvu2le / pvu2usd

            config.money.ARS.quote.USD = 1/config.money.USD.quote.ARS
            config.money.ARS.quote.PVU = 1/pvu2ars
            config.money.ARS.quote.LE = pvu2le/pvu2ars

            config.money.LE.quote.USD = pvu2usd / le2pvu
            config.money.LE.quote.ARS = pvu2ars / le2pvu

            console.log('[updateMoney] config')
            console.log(config.money)

            saveConfig()
        }).catch(e => {
            console.error('[updateMoney]',e)
        })
}

function makeupFarmPage(){
    console.log('[makeupFarmPage] start')
    console.log('[makeupFarmPage] end')
}
