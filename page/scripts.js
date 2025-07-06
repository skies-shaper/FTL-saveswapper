let savesList = []
document.getElementById("fetchNew").addEventListener("click", ()=>{
    document.getElementById("saveName").style.visibility = "visible"
    document.getElementById("submit").style.visibility = "visible"
    document.getElementById("saveName").focus()
})
document.getElementById("submit").addEventListener("click", ()=>{
    getNewSave()
})
document.getElementById("saveName").addEventListener("keyup", (e)=>{
    if(e.key == "Enter"){
         getNewSave()
    }
})
function getNewSave(){
    let sanitizedVal = document.getElementById("saveName").value.replaceAll(/(\W+)/gi, '-')
    if(savesList.indexOf(sanitizedVal)  < 0 ){
        document.getElementById("saveName").style.visibility = "hidden"
        document.getElementById("submit").style.visibility = "hidden"
        window.electronAPI.fireFetchNew(sanitizedVal)       
    }
    else {
        displayAlert("Each save needs a unique name!", false)
    }
}
function displayAlert(alert, isgood){
    document.getElementById("notification").style.visibility = "visible"
    document.getElementById("notification").innerHTML = alert
    if(isgood){
        document.getElementById("notification").style.backgroundColor = "lightgreen"
    }
    else{
        document.getElementById("notification").style.backgroundColor = "rgb(248, 166, 166)"
    }
    setTimeout(()=>{
        document.getElementById("notification").style.visibility = "hidden"
    }, 500)
}

function generateSavesList(){
    window.electronAPI.getSavesList()
}
window.electronAPI.onReceivedSaves((value) =>{
    savesList = JSON.parse(value)
    let str = ""
    for(let i = 0; i < savesList.length; i++){
        str += `<div style="width: 100%;">
                <button style="float: left; width: 60%; margin-left: 2%;" onclick="loadInSave('${savesList[i]}')">${savesList[i]}</button>
                <button style="float: left; margin-left: 2%; margin-right: 0px;" onclick = "refreshSave('${savesList[i]}')">update</button>
                <button style="float: left; margin-left: 2%; margin-right: 0px;" onclick = "deleteSave('${savesList[i]}')">remove</button>
                </div>`
    }
    document.getElementById("savesList").innerHTML = str
})

function refreshSave(id){
    window.electronAPI.refreshSave(id)
}

function deleteSave(id){
    window.electronAPI.deleteSave(id)

}

window.electronAPI.onGetMessage((msg) =>{
    displayAlert(msg,true)
})

window.electronAPI.onLoadedIn(() =>{
    displayAlert("Successfully swapped your save file!",true)
})
generateSavesList()

function loadInSave(id){
    console.log(id)
    window.electronAPI.loadSave(id, document.getElementById("cb").checked)
}

function changeFTLLocation(){
    window.electronAPI.getFTLLocation()
}
window.electronAPI.onGotFTLLocation((val)=>{
    document.getElementById("ftlloc").innerHTML = val
    document.getElementById("cb").checked = true
})

window.electronAPI.reloadFTLlocation()