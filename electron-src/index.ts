// Native
import { join } from "path";
import { format } from "url";
import sqlite3 from "sqlite3";

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, "preload.js"),
    },
  });

  const url = isDev
    ? "http://localhost:8000/"
    : format({
        pathname: join(__dirname, "../renderer/out/index.html"),
        protocol: "file:",
        slashes: true,
      });

  mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

const db = new sqlite3.Database("./test.db", (err) => {
  if (err) console.error("Database opening error: ", err);
});

db.serialize(() => {
  db.run("CREATE TABLE if not exists names (name TEXT)");

  const stmt = db.prepare("INSERT INTO names VALUES (?)");
  for (let i = 0; i < 10; i += 1) {
    stmt.run(`Name ${i}`);
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM names", (_err, row) => {
    console.log(`${row.id}: ${row.info}`);
  });
});

ipcMain.on("asynchronous-message", (event: IpcMainEvent, arg) => {
  const sql = arg;
  db.all(sql, (err, rows) => {
    event.reply("asynchronous-reply", (err && err.message) || rows);
  });
});
