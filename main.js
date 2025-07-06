const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const proc = require('node:child_process');
const process = require("node:process")
const fs = require("node:fs")
const { dialog } = require('electron')

let FTLlocation = ""

const createWindow = () => {
    const win = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            
        }
    })
    win.setResizable(false)
    win.show()
    win.loadFile('page/index.html')
}

app.whenReady().then(() => {
    createWindow()
    FTLlocation = ""+fs.readFileSync("appData.file")

    ipcMain.on("fetchNew",(e, fileName)=>{
        console.log("fetch new file!")
        fs.writeFileSync(`savefiles/${fileName}.sav`,"helo")
        fs.copyFileSync(process.env.HOME+"/Library/Application Support/FasterThanLight/continue.sav",`savefiles/${fileName}.sav`)
        
        let savelist = []
        fs.readdirSync("./savefiles").forEach((file) =>{
            savelist.push(file.substring(0,file.indexOf(".")))
        })
        BrowserWindow.fromWebContents(e.sender).webContents.send("savelist", JSON.stringify(savelist))
    })

    ipcMain.on("reload", (e, fileName) =>{
        fs.copyFileSync(process.env.HOME+"/Library/Application Support/FasterThanLight/continue.sav",`savefiles/${fileName}.sav`)
        BrowserWindow.fromWebContents(e.sender).webContents.send("message", `reloaded ${fileName}!`)

    })
    
    ipcMain.on("remove", (e, fileName) =>{
        fs.rmSync(`savefiles/${fileName}.sav`)
        let savelist = []
        fs.readdirSync("./savefiles").forEach((file) =>{
            savelist.push(file.substring(0,file.indexOf(".")))
        })
        BrowserWindow.fromWebContents(e.sender).webContents.send("savelist", JSON.stringify(savelist))
    })

    ipcMain.on("getSaves", (event)=>{
        let savelist = []
        fs.readdirSync("./savefiles").forEach((file) =>{
            savelist.push(file.substring(0,file.indexOf(".")))
        })
        BrowserWindow.fromWebContents(event.sender).webContents.send("savelist", JSON.stringify(savelist))
    })
    ipcMain.on("loadSave",(e,filename, runApp)=>{
        console.log(runApp)
        console.log(filename)
        fs.copyFileSync(`savefiles/${filename}.sav`, process.env.HOME+"/Library/Application Support/FasterThanLight/continue.sav")
        BrowserWindow.fromWebContents(e.sender).webContents.send("loadedIn")
        if(runApp){
            proc.exec("open "+FTLlocation)
        }
    })
    ipcMain.on("getFTLloc", (event)=>{
        FTLlocation = dialog.showOpenDialogSync({title : "Choose your FTL.app file", properties : ["openFile"]})[0]
        fs.writeFileSync("appData.file",FTLlocation)
        BrowserWindow.fromWebContents(event.sender).webContents.send("locdetected", FTLlocation)
    })

    ipcMain.on("reloadFTLloc", (event)=>{
        BrowserWindow.fromWebContents(event.sender).webContents.send("locdetected", FTLlocation)
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on("ready", ()=>{
})

app.on('window-all-closed', () => {    
    app.quit()
})