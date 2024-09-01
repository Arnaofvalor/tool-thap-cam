const readline = require('readline');
const spamemoji = require('./spamemoji');
const spamlyrics = require('./spambaihat');
const spamanhyeuem = require('./anhyeuem')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function chooseAction() {
    console.log('Chọn một tùy chọn:');
    console.log('1: Spam Emoji');
    console.log('2: Spam Lyrics');
    console.log('3: Spam Anh yêu em:))');


    rl.question('Nhập số tùy chọn của bạn: ', (choice) => {
        switch (choice) {
            case '1':
                spamemoji();
                rl.close()
                break;
            case '2':
                spamlyrics(); 
                rl.close()
                break;
            case '3':
                spamanhyeuem();
                rl.close()
                break;
            default:
                console.log('Lựa chọn không hợp lệ. Vui lòng chọn 1 hoặc 2.');
                chooseAction(); 
                break;
        } 
    });
}

chooseAction();
