const login = require('./fca-unofficial');
const fs = require('fs');
const readline = require('readline');

const appState = JSON.parse(fs.readFileSync('appstate.json', 'utf8'));
const content = fs.readFileSync('lyrics/emojis.txt', 'utf8').trim();
const characters = Array.from(content);

function spamemoji() {
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    login({ appState }, (err, api) => {
        if (err) return console.error(err);

        fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState(), null, 2));

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Nhập ID nhóm: ', (groupID) => {
            function sendMessagesToGroup(threadID) {
                const shuffledContent = shuffleArray([...characters]).join('');

                api.sendMessage(shuffledContent, threadID, (err) => {
                    if (err) return console.error(err);

                    console.log(`Đã gửi tin nhắn: ${shuffledContent} đến nhóm ${threadID}`);
                });

                setTimeout(() => {
                    sendMessagesToGroup(threadID);
                }, 1000); 
            }

            sendMessagesToGroup(groupID);

            });

        rl.on('close', () => process.exit(0));
    });
}

module.exports = spamemoji;
