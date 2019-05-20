const electron = require('electron');
const path = require('path');

const { app, BrowserWindow } = require('electron')

// The globally accessible object with shared app state.
global.sharedObject = { argv: process.argv }

// Defaults.
global.sharedObject.viewMode = 'pano';
global.sharedObject.imagePath = 'img/view/';

// Parse args.
process.argv.forEach(function(arg) {
  if (arg.startsWith('-p:'))
  {
    global.sharedObject.imagePath = arg.slice(3);
  }
  else if (arg.startsWith('-m:'))
  {
    global.sharedObject.viewMode = arg.slice(3);
  }
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;


function createWindow () 
{
  // Create the browser window...
  win = new BrowserWindow({ 
    width: 800, 
    height: 600, 
    icon: path.join(__dirname, 'img/favicon.png'), 
    webPreferences: {
      nodeIntegration: true
    } 
  });

  // ... and load the *.html of the app.
  if (global.sharedObject.viewMode == 'img')
  {
    // https://stackoverflow.com/questions/12539918/get-the-width-and-height-of-an-image-in-node-js
    // https://github.com/image-size/image-size

    var sizeOf = require('image-size');
    var dimensions = sizeOf(global.sharedObject.imagePath);
    global.sharedObject.imageRatio = dimensions.width / dimensions.height;

    win.loadFile(path.join(__dirname, 'img.html'));
  }
  else
  {
    win.loadFile(path.join(__dirname, 'pano.html'));
  }
  
  // Emitted when the window is closed.
  win.on('closed', () => 
  {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  });
}

// When the app is ready...
app.on('ready', createWindow)


// Quit when all windows are closed.
app.on('window-all-closed', () => 
{
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') 
    {
        app.quit()
    }
});
  
app.on('activate', () => 
{
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) 
    {
      createWindow()
    }
});
