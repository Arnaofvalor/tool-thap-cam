const login = require('./fca-unofficial');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const appState = JSON.parse(fs.readFileSync('appstate.json', 'utf8'));

const directoryPath = path.join(__dirname, 'lyrics');
const files = fs.readdirSync(directoryPath)
  .filter(file => file.endsWith('.txt'))
  .sort((a, b) => {
    const numA = parseInt(a.split('.')[0], 10);
    const numB = parseInt(b.split('.')[0], 10);
    return numA - numB;
  });

let currentFileIndex = 0;
let messageCount = 0;
let api;

function spamlyrics() {
  function processFile(filePath, threadID) {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');

    function sendMessages() {
      if (messageCount < lines.length) {
        const message = lines[messageCount].trim();
        if (message) {
          api.sendMessage(message, threadID, (err) => {
            if (err) return console.error(err);

            console.log(`Đã gửi tin nhắn số ${messageCount + 1} từ ${path.basename(filePath)} đến nhóm ${threadID}`);
          });
        }

        messageCount++;

        setTimeout(sendMessages, 1000);
      } else {
        messageCount = 0;
        currentFileIndex++;

        if (currentFileIndex < files.length) {
          console.log(`Chuyển sang tệp tin ${files[currentFileIndex]}`);
          processFile(path.join(directoryPath, files[currentFileIndex]), threadID);
        } else {
          console.log("Hoàn thành việc gửi tất cả tin nhắn từ các tệp tin.");
        }
      }
    }

    sendMessages();
  }

  login({ appState }, (err, fcaApi) => {
    if (err) return console.error(err);
    api = fcaApi;

    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState(), null, 2));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    function askMode() {
      rl.question('Chọn chế độ (1 - Gửi theo stt từng file trong thư mục "lyrics", 2 - Gửi từng dòng từ một file cụ thể)\nLựa chọn: ', (mode) => {
        rl.question('Nhập ID nhóm: ', (groupID) => {
          if (mode === '1') {
            processFile(path.join(directoryPath, files[currentFileIndex]), groupID);
          } else if (mode === '2') {
            console.log("Các tệp tin hiện có trong thư mục 'lyrics':");
            files.forEach((file, index) => {
              console.log(`${index + 1}. ${file}`);
            });
            rl.question('Nhập tên file (bao gồm cả .txt): ', (fileName) => {
              const filePath = path.join(directoryPath, fileName);
              if (fs.existsSync(filePath)) {
                processFile(filePath, groupID);
              } else {
                console.log('File không tồn tại.');
              }
              rl.close();
            });
          } else {
            console.log('Lựa chọn không hợp lệ. Vui lòng chọn lại.');
            askMode();
          }
        });
      });
    }

    askMode();
  });
}

module.exports = spamlyrics;
