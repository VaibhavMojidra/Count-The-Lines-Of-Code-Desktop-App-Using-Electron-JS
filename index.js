const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron')
const path = require('path')
const fs = require("fs")
const readline = require('readline')
const events = require('events')
const { session } = require('electron')

let developeWindow = null
let aboutWindow = null
let userGuideWindow = null
let mainWindow = null
let arrayOfFiles = null
let jsClientFunctions = {
    darkModeSwitch: null,
    copyResult: null,
    calculate: null,
    selectProjectFolder: null
}

process.env.NODE_ENV = 'production'

const isMac = process.platform === 'darwin' ? true : false

const initializeApp = () => {
    mainWindow = new BrowserWindow({
        title: "Vaibhav Mojidra Electron JS Hello World",
        width: 1280,
        height: 720,
        minHeight: 545,
        minWidth: 630,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: `${__dirname}/assets/icons/Icon_256x256.png`
    })
    mainWindow.loadFile('./app/html/main.html')

    mainWindow.on('closed', () => {
        arrayOfFiles = null
        mainWindow = null
    })

    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)

    ipcMain.handle('dialog:openDirectory', getFolderPath)
    ipcMain.handle('getAllFilesList', (e, pa) => {
        arrayOfFiles = []
        return getAllDirFiles(e, pa)
    })
    ipcMain.handle('getLineCount', getLineCountOfFile)
    mainWindow.webContents.on('did-finish-load', () => {
        jsClientFunctions.darkModeSwitch = () => mainWindow.webContents.executeJavaScript("darkModeSwitch()")
        jsClientFunctions.calculate = () => mainWindow.webContents.executeJavaScript("calculate()")
        jsClientFunctions.copyResult = () => mainWindow.webContents.executeJavaScript("copyToClipboard()")
        jsClientFunctions.selectProjectFolder = () => mainWindow.webContents.executeJavaScript("setFolderPath()")
    })
}

const createAboutWindow = () => {
    aboutWindow = new BrowserWindow({
        title: "About Count The Lines Of Code",
        width: 500,
        height: 420,
        icon: `${__dirname}/assets/icons/Icon_256x256.png`,
        resizable: false,
        maximizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    aboutWindow.loadFile('./app/html/about.html')
    aboutWindow.on('closed', () => aboutWindow = null)
}

const createDeveloperWindow = () => {
    developeWindow = new BrowserWindow({
        title: "Developer Vaibhav Mojidra",
        width: 500,
        height: 420,
        resizable: false,
        maximizable: false,
        icon: `${__dirname}/assets/icons/Icon_256x256.png`,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    developeWindow.loadFile('./app/html/developer.html')
    developeWindow.on('closed', () => developeWindow = null)
}

const createUserGuideWindow = () => {
    userGuideWindow = new BrowserWindow({
        title: "Developer Vaibhav Mojidra",
        width: 500,
        height: 600,
        maximizable: false,
        icon: `${__dirname}/assets/icons/Icon_256x256.png`,
        maxWidth: 550,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    userGuideWindow.loadFile('./app/html/userguide.html')
    userGuideWindow.on('closed', () => userGuideWindow = null)
}

const getFolderPath = async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    })
    if (canceled) {
        return ""
    } else {
        return filePaths[0]
    }
}


const getAllDirFiles = (e, dirPath) => {
    files = fs.readdirSync(dirPath)

    files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item))

    files = files.filter(item => item != ".DS_Store")
    files = files.filter(item => (!item.toLowerCase().endsWith(".pdf") && !item.toLowerCase().endsWith(".png") && !item.toLowerCase().endsWith(".jpg") && !item.toLowerCase().endsWith(".jpeg") && !item.toLowerCase().endsWith(".gif") && !item.toLowerCase().endsWith(".mp4") && !item.toLowerCase().endsWith(".mov") && !item.toLowerCase().endsWith(".svg")))

    files.forEach(file => {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllDirFiles(e, dirPath + "/" + file)
        } else {
            arrayOfFiles.push({
                fileName: file,
                fullPath: dirPath + "/" + file,
                numberOfLines: 0
            })
        }
    })

    return arrayOfFiles
}

const getLineCountOfFile = async (e, filePath) => {
    try {
        let rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            crlfDelay: Infinity
        })
        let lineno = 0
        rl.on('line', (line) => {
            if (line.trim() != "") {
                lineno++
            }
        })
        await events.once(rl, 'close')
        return lineno
    } catch (err) { }
}

const menu = [
    ...(isMac ? [
        {
            label: app.name,
            submenu: [
                {
                    label: 'About',
                    accelerator: 'CommandOrControl+Shift+A',
                    click: createAboutWindow
                },
                {
                    label: 'Developer',
                    accelerator: 'CommandOrControl+Shift+D',
                    click: createDeveloperWindow
                },
                {
                    label: 'User Guide',
                    accelerator: 'CommandOrControl+Shift+U',
                    click: createUserGuideWindow
                },
                {
                    label: 'Quit',
                    accelerator: 'CommandOrControl+Alt+Q',
                    click: () => app.quit()
                },
            ]
        }
    ] : []),
    {
        label: 'Actions',
        submenu: [
            {
                label: 'Select Project Folder',
                accelerator: 'CmdOrCtrl+O',
                click: () => jsClientFunctions.selectProjectFolder()
            },
            {
                label: 'Scan',
                accelerator: 'CmdOrCtrl+S',
                click: () => jsClientFunctions.calculate()
            },
            {
                label: 'Copy Result',
                accelerator: 'CmdOrCtrl+C',
                click: () => jsClientFunctions.copyResult()
            },
            {
                label: 'Switch Mode',
                accelerator: 'CmdOrCtrl+M',
                click: () => jsClientFunctions.darkModeSwitch()
            },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => app.quit()
            },
        ]
    },
    {
        label: 'Info',
        submenu: [
            {
                label: 'About',
                accelerator: 'CmdOrCtrl+A',
                click: createAboutWindow
            },
            {
                label: 'Developer',
                accelerator: 'CmdOrCtrl+D',
                click: createDeveloperWindow
            },
            {
                label: 'User Guide',
                accelerator: 'CmdOrCtrl+U',
                click: createUserGuideWindow
            },
        ]
    }
]
app.on('before-quit', () => session.defaultSession.clearCache())
app.on('ready', initializeApp)