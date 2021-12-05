const telegramBot = require('node-telegram-bot-api')
const Controllers = require("./controllers")
const { TOKEN, OPTIONS } = require("./config")
const postgres = require("./modules/postgress")
const axios = require("axios");
const fetch = require("node-fetch")




const bot = new telegramBot(TOKEN, OPTIONS)

async function main(){
    const psql = await postgres()

    await bot.on('text', async (message) => {
        await Controllers.MessageController(message, bot, psql)
        console.log(message)

    })
    await bot.on('location', async (message) => {
        await Controllers.LocationController(message, bot, psql)
    })

    var bookPages = 5;

    function getPagination( current, maxpage ) {
        var keys = [];
        if (current>1) keys.push({ text: `«1`, callback_data: '1' });
        if (current>2) keys.push({ text: `‹${current-1}`, callback_data: (current-1).toString() });
        keys.push({ text: `-${current}-`, callback_data: current.toString() });
        if (current<maxpage-1) keys.push({ text: `${current+1}›`, callback_data: (current+1).toString() })
        if (current<maxpage) keys.push({ text: `${maxpage}»`, callback_data: maxpage.toString() });

        return {
            reply_markup: JSON.stringify({
                inline_keyboard: [ keys ]
            })
        };
    }

    await bot.onText(/\/book/, function(msg) {
        bot.sendMessage(msg.chat.id, 'Page: 5', getPagination(25,bookPages));
    });

    await bot.on('callback_query', function (message) {
        var msg = message.message;
        var editOptions = Object.assign({}, getPagination(parseInt(message.data), bookPages), { chat_id: msg.chat.id, message_id: msg.message_id});
        bot.editMessageText('Page: ' + message.data, editOptions);
    });

}main()

