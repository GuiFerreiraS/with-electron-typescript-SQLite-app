const { ipcRenderer } = global;

export default function sendAsync(message: any) {
  return new Promise<any>((resolve) => {
    ipcRenderer.once("asynchronous-reply", (arg) => {
      console.log({ arg });
      resolve(arg);
    });
    ipcRenderer.sendMessage("asynchronous-message", message);
  });
}
