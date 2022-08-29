let isDarkModeOn = true
let cnt = null
let water = null
let percent = null
let projectFolderPath = ""
let numberOfFiles = 0
let readFilesCounter = 0
let totalLines = 0
let percentageIncOnSingleFile = 0
let loaderPercentage = 0
let filesList = null
let excludeFilesList = []
let bufferTime = 0
let isCalculationOn = false
let isToast = false

const init = () => {
    setDivsSizes()
    isDarkModeOn = true
    cnt = document.getElementById("count")
    water = document.getElementById("water")
    percent = cnt.innerText
}

const copyToClipboard = () => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(totalLines).then(() => {
            toast('Total count copied to clipboard successfully.', false)
        }).catch(() => {
            toast('Error in copying to clipboard. Please try copying manually by selecting the count.', true)
        })
    } else {
        toast('Error in copying to clipboard. Please try copying manually by selecting the count.', true)
    }
}

const setFolderPath = () => {
    if (isCalculationOn) {
        toast('Cannot modfity the project folder while scan is active.', true)
    } else {
        window.vaibhavmojidraAPI.selectFolder().then(result => {
            if (result != "") {
                projectFolderPath = result
            }
            document.getElementById("projectFolderPath").value = projectFolderPath
        })
    }
}

const calculate = () => {
    if (isCalculationOn) {
        toast('Cannot begin a new scan while the current scan is active.', true)
    } else {
        if (projectFolderPath != "") {
            changeLoaderValue(1)
            setLoaderVisibility(true)
            numberOfFiles = 0
            readFilesCounter = 0
            filesList = null
            excludeFilesList = []
            percentageIncOnSingleFile = 0
            loaderPercentage = 0
            totalLines = 0
            bufferTime = 0
            disableButtons()
            document.getElementById('totalNumberOfLines').innerHTML = totalLines
            window.vaibhavmojidraAPI.getAllFilesList(projectFolderPath).then(result => {
                numberOfFiles = parseInt(result.length)
                setBufferTime(numberOfFiles)
                filesList = result
                percentageIncOnSingleFile = 100 / numberOfFiles
                readFilesAndGetCounts()
            })
        } else {
            toast('Please select a project folder to begin the scan.', true)
        }
    }
}

const readFilesAndGetCounts = () => {
    if (readFilesCounter < numberOfFiles) {
        window.vaibhavmojidraAPI.getLineCount(filesList[readFilesCounter].fullPath).then(res => {
            filesList[readFilesCounter].numberOfLines = parseInt(res)
            readFilesCounter++
            loaderPercentage = Math.floor(loaderPercentage + percentageIncOnSingleFile)
            changeLoaderValue(loaderPercentage)
            setTimeout(() => {
                readFilesAndGetCounts()
            }, bufferTime)
        })
    } else {
        changeLoaderValue(100)
        setTimeout(() => {
            setLoaderVisibility(false)
            totalLines = filesList.reduce((total, file) => total + file.numberOfLines, 0)
            document.getElementById('totalNumberOfLines').innerHTML = totalLines
            setIncludeFiles()
            setExcludeFiles()
            changeLoaderValue(1)
            enableButtons()
            toast(`${filesList.length} files scanned from the project folder.`, false)
            document.getElementById('fileTotalLabel').innerHTML = `TOTAL FILES: ${filesList.length}`
        }, 500)
    }
}


const setIncludeFiles = () => {
    let tempText = ""
    filesList.forEach(file => {
        tempText += '<div class="card"><table class="cardTable"><tr><td class="cardFileName">' + file.fileName + '</td><td class="cardFileCount">' + file.numberOfLines + '</td><td class="cardButtonHolder"><button class="cardButton" onclick="excludeFile(\'' + file.fullPath + '\')" style="background-color:#F44336;padding-left:10px;padding-right:10px;">╳</button></td></tr><tr><td colspan="3" style="padding-left: 10px;padding-right: 10px;padding-bottom: 5px;"><input type="text" readonly value="' + file.fullPath + '" class="cardURL"/></td></tr></table></div>'
    })
    if (tempText == "") {
        document.getElementById('filesList').innerHTML = '<span class="percentNum" style="padding-left: 15px; padding-top: 10px;font-size: 18px;color: #808080;"><i>No file included in computing the line count for the selected project</i></span>'
    } else {
        document.getElementById('filesList').innerHTML = tempText
    }
    document.getElementById('fileIncludeLabel').innerHTML = `FILES INCLUDED IN CALCULATION (${filesList.length})`
}

const excludeFile = filePath => {
    let obj = filesList.find(file => file.fullPath == filePath)
    totalLines = totalLines - obj.numberOfLines
    document.getElementById('totalNumberOfLines').innerHTML = totalLines
    filesList = filesList.filter(file => file.fullPath != filePath)
    excludeFilesList = [obj, ...excludeFilesList]
    setIncludeFiles()
    setExcludeFiles()
}

const setExcludeFiles = () => {
    let tempText = ""
    excludeFilesList.forEach(file => {
        tempText += '<div class="card"><table class="cardTable"><tr><td class="cardFileName">' + file.fileName + '</td><td class="cardFileCount">' + file.numberOfLines + '</td><td class="cardButtonHolder"><button class="cardButton" onclick="includeFile(\'' + file.fullPath + '\')" style="background-color:#4CAF50;padding-left:8px;padding-right:8px;font-size:30px;">+</button></td></tr><tr><td colspan="3" style="padding-left:10px;padding-right:10px;padding-bottom:5px;"> <input type="text" readonly value="' + file.fullPath + '" class="cardURL"/></td></tr></table></div>'
    })
    if (tempText == "") {
        document.getElementById('binList').innerHTML = '<span class="percentNum" style="padding-left: 15px; padding-top: 10px;font-size: 18px;color: #808080;"><i>No file excluded in computing the line count for the selected project</i></span>'
    } else {
        document.getElementById('binList').innerHTML = tempText
    }
    document.getElementById('fileExcludeLabel').innerHTML = `EXCLUDED FILES FROM CALCULATION (${excludeFilesList.length})`
}

const includeFile = filePath => {
    let obj = excludeFilesList.find(file => file.fullPath == filePath)
    totalLines = totalLines + obj.numberOfLines
    document.getElementById('totalNumberOfLines').innerHTML = totalLines
    excludeFilesList = excludeFilesList.filter(file => file.fullPath != filePath)
    filesList = [obj, ...filesList]
    setIncludeFiles()
    setExcludeFiles()
}

const setBufferTime = numberOfFiles => {
    if (numberOfFiles <= 5) {
        bufferTime = 800
    } else if (numberOfFiles > 5 && numberOfFiles <= 15) {
        bufferTime = (5000 / numberOfFiles)
    } else {
        bufferTime = (10000 / numberOfFiles)
    }
}

const changeLoaderValue = loaderValue => {
    cnt.innerHTML = loaderValue
    water.style.transform = 'translate(0' + ',' + (100 - loaderValue) + '%)'
}

const setDivsSizes = () => {
    let remainingheightsOneFourth = ((window.innerHeight - 210) / 6)
    document.getElementById('loaderDiv').style.height = (window.innerHeight - 110) + "px"
    document.getElementById('filesList').style.height = (remainingheightsOneFourth * 4) + "px"
    document.getElementById('binList').style.height = (remainingheightsOneFourth * 2) + "px"
}

const setLoaderVisibility = value => {
    if (value) {
        document.getElementById('filesList').style.display = "none"
        document.getElementById('binList').style.display = "none"
        document.getElementById('exclude').style.display = "none"
        document.getElementById('include').style.display = "none"
        document.getElementById('loaderDiv').style.display = "block"
    } else {
        document.getElementById('loaderDiv').style.display = "none"
        document.getElementById('filesList').style.display = "block"
        document.getElementById('binList').style.display = "block"
        document.getElementById('exclude').style.display = "table"
        document.getElementById('include').style.display = "table"
    }
}

const darkModeSwitch = () => {
    let r = document.querySelector(':root')
    isDarkModeOn = isDarkModeOn ? false : true
    if (isDarkModeOn) {
        r.style.setProperty('--page_bg', '#121212')
        r.style.setProperty('--text_color', '#FDFDFD')
        r.style.setProperty('--card_bg', '#262626')
        r.style.setProperty('--button_color', '#f5f5f5')
        r.style.setProperty('--button_text_color', '#333333')
        r.style.setProperty('--toast_back_color', '#B0BEC5')
        document.getElementById('darkmodeImg').src = '../assets/img/off.png'
    } else {
        r.style.setProperty('--page_bg', '#ECEFF1')
        r.style.setProperty('--text_color', '#1A1A1A')
        r.style.setProperty('--card_bg', '#CFD8DC')
        r.style.setProperty('--button_color', '#1976D2')
        r.style.setProperty('--button_text_color', '#FDFDFD')
        r.style.setProperty('--toast_back_color', '#37474F')
        document.getElementById('darkmodeImg').src = '../assets/img/on.png'
    }
}

const disableButtons = () => {
    isCalculationOn = true
    document.getElementById('pathChooserBtn').style.opacity = "0.6"
    document.getElementById('calculateBtn').style.opacity = "0.6"
    document.getElementById('pathChooserBtn').style.cursor = "not-allowed"
    document.getElementById('calculateBtn').style.cursor = "not-allowed"
}

const enableButtons = () => {
    isCalculationOn = false
    document.getElementById('pathChooserBtn').style.opacity = "1"
    document.getElementById('calculateBtn').style.opacity = "1"
    document.getElementById('pathChooserBtn').style.cursor = "pointer"
    document.getElementById('calculateBtn').style.cursor = "pointer"
}

const toast = (mesaage, isError) => {
    if (!isToast) {
        isToast = true
        if (isError) {
            document.getElementById('toastDiv').style.display = "block"
            document.getElementById('toastDiv').innerHTML = '<div style="position: absolute;z-index: 10;bottom: 0;width: 100vw;padding-top: 3px;padding-bottom: 3px;background-color: #F44336;transition: 1s;"> <span style="padding-left: 10px;color: #f5f5f5;width: 0px;transition: 1s;">⚠ ' + mesaage + '</span> </div> <div id="toast_cover" style="position: absolute;z-index: 100;bottom: 0;right:0;width: 100vw;padding-top: 3px;padding-bottom: 3px;background-color: #F44336;transition: 1s;"> <span style="padding-left: 10px;color: #F44336;width: 0px;transition: 1s;">T</span> </div>'
            removeCover(100)
            setTimeout(() => {
                document.getElementById('toastDiv').style.display = "none"
                isToast = false
            }, 3000)
        } else {
            document.getElementById('toastDiv').style.display = "block"
            document.getElementById('toastDiv').innerHTML = '<div style="position: absolute;z-index: 10;bottom: 0;width: 100vw;padding-top: 3px;padding-bottom: 3px;background-color: var(--toast_back_color);transition: 1s;"><span style="padding-left: 10px;color: var(--button_text_color);width: 0px;transition: 1s;"><i>' + mesaage + '</i></span> </div> <div id="toast_cover" style="position: absolute;z-index: 100;bottom: 0;right:0;width: 100vw;padding-top: 3px;padding-bottom: 3px;background-color: var(--toast_back_color);transition: 1s;"><span style="padding-left: 10px;color: var(--toast_back_color);width: 0px;transition: 1s;">T</span></div>'
            removeCover(100)
            setTimeout(() => {
                isToast = false
                document.getElementById('toastDiv').style.display = "none"
            }, 4000)
        }
    }
}

const removeCover = wd => {
    if (wd <= 10) {
        document.getElementById('toast_cover').display = "none"
    }
    else {
        setTimeout(() => {
            let wc = wd - 1
            document.getElementById('toast_cover').style.width = wc + "vw"
            removeCover(wc)
        }, 12)
    }
}

