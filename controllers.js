const fetch = require("node-fetch")
module.exports = class Controllers {
    static async MessageController(message, bot, psql){
        const chat_id = message.chat.id
        const user_id = message.from.id
        const text = message.text

        console.log(psql);
        const user = await psql.users.findOne({
            where: {
                chat_id
            }
        })
        if(!user){
            await psql.users.create({
                chat_id: chat_id,
            })
            await bot.sendMessage(
                chat_id,
                `Assalomu Alaykum ${message.from.first_name}\nBu bot orqali siz qidirgan mahsultingiz sizga eng yaqin qaysi do'konda bor ekanligini bilib olishingiz mumkin!\n\nIltimos mahsulot qidirish uchun 🔍 Qidirish tugmasini bosing!.`, {
                    "reply_markup": {
                        "one_time_keyboard": true,
                        "resize_keyboard": true,
                        "keyboard": [[{
                            text: "🔍 Qidirish"
                        }]]
                    }
                })

            await psql.users.update({
                step: 2
            },{ where: {
                chat_id: chat_id
            }})
        }else{
            if(text && user.step === 3){
                bot.sendMessage(chat_id, "<b>Location jo'nating!</b>", {
                    "parse_mode": "HTML",
                    "reply_markup": {
                        "one_time_keyboard": true,
                        "resize_keyboard": true,
                        "keyboard": [[{
                            text: "📍 Locationni jo'natish",
                            request_location: true
                        }]]
                    }
                })
                await psql.users.update({
                    product_name: message.text,
                    step: 4
                },{ where: {
                        chat_id: chat_id
                }})

                return;
            }


            if (text === '/start'){
                await bot.sendMessage(chat_id,
                    `Mahsulot qidirish uchun <b>🔍 Qidirish</b> tugmasini bosing!`, {
                        parse_mode: "HTML",
                        "reply_markup": {
                            "one_time_keyboard": true,
                            "resize_keyboard": true,
                            "keyboard": [[{
                                text: "🔍 Qidirish"
                            }]]
                        }
                    })
                await psql.users.update({
                    step: 2
                },{ where: {
                        chat_id: chat_id
                }})

            }
            if (text === '🔍 Qidirish' && user.step === 2){
                await bot.sendMessage(chat_id,
                    `Mahsulot nomini kiriting!`)
                await psql.users.update({
                    step: 3
                },{ where: {
                        chat_id: chat_id
                    }})
            }
            if(text === '/help'){
                bot.sendMessage(chat_id, "Bu bot orqali siz qidirayotgan mahsulotingiz sizga eng yaqin qaysi do'konda bor ekanligini topib beruvchi bot\n\n<b>Yordam:</b> @Pixermanager\n<b>Dasturchilar:</b> @pixer_uz", {
                    parse_mode: "HTMl"
                })
            }
        }

    }

    static async LocationController(message, bot, psql) {
        const chat_id = message.chat.id
        const user_id = message.from.id
        const text = message.text

        const user = await psql.users.findOne({
            where: {
                chat_id
            }
        })

        if(message && user.step === 4){
            let myMessage = await bot.sendMessage(chat_id, "Kuting...")

            await psql.users.update({
                long: message.location.longitude,
                lat: message.location.latitude,
            },{
                where: {
                    chat_id: chat_id
                }
            })



            setTimeout(async () => {
                await bot.deleteMessage(chat_id, myMessage.message_id)
                await psql.users.update({
                    step: 2,
                },{
                    where: {
                        chat_id: chat_id
                    }
                })

                let requestOptions = {
                    method: 'GET',
                    redirect: 'follow'
                };
                await fetch(`http://192.168.100.8:4040/api/products/search?name=${user.product_name}&long=${user.long}&lat=${user.lat}&page=0&size=10`, requestOptions)
                    .then(response => response.json())
                    .then(result => {

                        let text = `Javoblar:`

                        if(!result?.data?.products.length){
                            text = "Bunday mahsulot topilmadi\n<b>Misol:</b> cola"
                        }else{
                            for (let item of result?.data?.products) {
                                text += `\n\n🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻\n\n<b>Mahsulot nomi:</b> ${item.product_name}\n<b>Do'kon:</b> ${item.category.branch.branch_name}\n<b>Narxi:</b> ${item.product_price} so'm\n<b>Masofa:</b> ${item.distance}\n\n<a href="https://www.google.ru/maps?q=41.301500,69.2100&ll=${item.category.branch.branch_latitude},${item.category.branch.branch_longitude}&z=17">🗺 Kartada</a>`
                            }
                        }

                        bot.sendMessage(chat_id, text, {
                            "parse_mode": "HTML",
                            "reply_markup": {
                                "one_time_keyboard": true,
                                "resize_keyboard": true,
                                "keyboard": [[{
                                    text: "🔍 Qidirish"
                                }]]
                            }
                        })




                        }
                    )
                    .catch(error => console.log('error', error))

            }, 1000)


        }
    }
}
