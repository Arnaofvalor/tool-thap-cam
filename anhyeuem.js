const login = require('./fca-unofficial');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const appState = JSON.parse(fs.readFileSync('appstate.json', 'utf8'));

let api;

function main() {
  function sendLoveMessages(recipientID, index) {
    if (index > 1000) {
      // Gửi tin nhắn cuối cùng khi đạt 1000 tin nhắn
      api.sendMessage('anh yêu em vãi lồn', recipientID, (err) => {
        if (err) {
          console.error('Lỗi khi gửi tin nhắn:', err);
          return;
        }

        console.log('Đã gửi tin nhắn cuối cùng và dừng lại.');
      });
      return;
    }

    const message = `anh yêu em tập ${index}`;
    api.sendMessage(message, recipientID, (err) => {
      if (err) {
        console.error('Lỗi khi gửi tin nhắn:', err);
        return;
      }

      console.log(`Đã gửi tin nhắn số ${index} đến người nhận ${recipientID}`);

      setTimeout(() => {
        sendLoveMessages(recipientID, index + 1);
      }, 1000);
    });
  }

  login({ appState }, (err, fcaApi) => {
    if (err) {
      console.error('Lỗi khi đăng nhập:', err);
      return;
    }
    api = fcaApi;

    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState(), null, 2));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Nhập ID người nhận: ', (recipientID) => {
      sendLoveMessages(recipientID, 1);
      rl.close();
    });
  });
}

module.exports = main;
