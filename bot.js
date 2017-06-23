/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 Botkit Basic Template for Heroku
 Author: okajax (https://github.com/okajax)
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//=========================================================
// Botの準備
//=========================================================
'use strict';

if (!process.env.token) {
	console.log('Error: Specify token in environment');
	process.exit(1);
}

var Botkit = require('botkit');
var os = require('os');
var CronJob = require('cron').CronJob;
const http = require('http');
const moment = require('moment-timezone');

var controller = Botkit.slackbot({
	debug: true,
});

//=========================================================
// 起こしてくれるよ
//=========================================================

var bot = controller.spawn({
	token: process.env.token
}).startRTM(function(err, bot, payload) {
	// 初期処理
	if(err) {
		throw new Error('Could not connect to Slack');
	}
	new CronJob({
		cronTime: '00 30 06 * * 1-5',
		onTick: function() {
			bot.say({
				channel: 'talk',
				text: 'おい！起きろ！\n…元気がないようだな\n納豆はどうだ？健康にいいぞ'
			});
		},
		start: true,
		timeZone: 'Asia/Tokyo'
	});
});


//=========================================================
// 天気を教えてくれるよ
//=========================================================

// 大阪
new CronJob({
	cronTime: '00 00 18 * * *',
	onTick: function() {
		http.get("http://api.openweathermap.org/data/2.5/forecast/daily?id=1853909&appid=addd6c5c7f4fcbfcefb9693c77b10eb6", (response) => {
			let body = '';
			response.setEncoding('utf8').on('data', (chunk) => {  body += chunk;  });
			response.on('end', () => {
				let current = JSON.parse(body);
				if(current.list[1].weather[0].main == "Rain") {
					let text =
					'明日の大阪市は、' + replaceWeather(current.list[1].weather[0].main) + 'だ。\n' +
					`<http://openweathermap.org/img/w/${current.list[1].weather[0].icon.replace('n', 'd')}.png?${moment().unix()}| > ` +
					'```' +
					'平均気温：' + Math.round(current.list[1].temp.day - 273.15) + '℃\n' +
					'最高気温：' + Math.round(current.list[1].temp.max - 273.15) + '℃\n' +
					'最低気温：' + Math.round(current.list[1].temp.min - 273.15) + '℃\n' +
					'湿度：' + current.list[1].humidity + '%\n' +
					'```';
					bot.say({
						channel: 'talk',
						text: text
					});
				}
			});
		});
	},
	start: true,
	timeZone: 'Asia/Tokyo'
});

// 牛久
new CronJob({
	cronTime: '00 00 20 * * *',
	onTick: function() {
		http.get("http://api.openweathermap.org/data/2.5/forecast/daily?id=2110629&appid=addd6c5c7f4fcbfcefb9693c77b10eb6", (response) => {
			let body = '';
			response.setEncoding('utf8').on('data', (chunk) => {  body += chunk;  });
			response.on('end', () => {
				let current = JSON.parse(body);
				if(current.list[1].weather[0].main == "Rain") {
					let text =
					'明日の牛久市は、' + replaceWeather(current.list[1].weather[0].main) + 'だ。\n' +
					`<http://openweathermap.org/img/w/${current.list[1].weather[0].icon.replace('n', 'd')}.png?${moment().unix()}| > ` +
					'```' +
					'平均気温：' + Math.round(current.list[1].temp.day - 273.15) + '℃\n' +
					'最高気温：' + Math.round(current.list[1].temp.max - 273.15) + '℃\n' +
					'最低気温：' + Math.round(current.list[1].temp.min - 273.15) + '℃\n' +
					'湿度：' + current.list[1].humidity + '%\n' +
					'```';
					bot.say({
						channel: 'talk',
						text: text
					});
				}
			});
		});
	},
	start: true,
	timeZone: 'Asia/Tokyo'
});

// 大阪
controller.hears(["大阪(.*)天気"],["direct_message","direct_mention","mention"],function(bot,message) {
	http.get("http://api.openweathermap.org/data/2.5/weather?id=1853909&appid=addd6c5c7f4fcbfcefb9693c77b10eb6", (response) => {
		let body = '';
		response.setEncoding('utf8').on('data', (chunk) => {  body += chunk;  });
		response.on('end', () => {
			let current = JSON.parse(body);
			let text =
			`今の大阪市は` + replaceWeather(current.weather[0].main) + `だ。` +
			`<http://openweathermap.org/img/w/${current.weather[0].icon.replace('n', 'd')}.png?${moment().unix()}| > ` +
			'```' +
			'平均気温：' + Math.round(current.main.temp - 273.15) + '℃\n' +
			'最高気温：' + Math.round(current.main.temp_max - 273.15) + '℃\n' +
			'最低気温：' + Math.round(current.main.temp_min - 273.15) + '℃\n' +
			'湿度：' + current.main.humidity + '%\n' +
			'```';
			bot.replyWithTyping(message, text);
		});
	});
});

// 牛久
controller.hears(["牛久(.*)天気"],["direct_message","direct_mention","mention"],function(bot,message) {
	http.get("http://api.openweathermap.org/data/2.5/weather?id=2110629&appid=addd6c5c7f4fcbfcefb9693c77b10eb6", (response) => {
		let body = '';
		response.setEncoding('utf8').on('data', (chunk) => {  body += chunk;  });
		response.on('end', () => {
			let current = JSON.parse(body);
			let text =
			`今の牛久市は` + replaceWeather(current.weather[0].main) + `だ。` +
			`<http://openweathermap.org/img/w/${current.weather[0].icon.replace('n', 'd')}.png?${moment().unix()}| > ` +
			'```' +
			'平均気温：' + Math.round(current.main.temp - 273.15) + '℃\n' +
			'最高気温：' + Math.round(current.main.temp_max - 273.15) + '℃\n' +
			'最低気温：' + Math.round(current.main.temp_min - 273.15) + '℃\n' +
			'湿度：' + current.main.humidity + '%\n' +
			'```';
			bot.replyWithTyping(message, text);
		});
	});
});

function replaceWeather(target) {
	const replaced = target
	.replace(/clear sky/, "快晴")
	.replace(/few clouds/, "晴れ")
	.replace(/scattered clouds/, "曇り")
	.replace(/Clouds/, "曇り")
	.replace(/broken clouds/, "曇り")
	.replace(/shower rain/, "小雨")
	.replace(/Rain/, "雨")
	.replace(/thunderstorm/, "雷雨")
	.replace(/snow/, "雪")
	.replace(/mist/, "霧")
	console.log(replaced);
	return replaced;
}


//=========================================================
// つーかー的なやつだよ
//=========================================================

controller.hears(["波動拳"],["direct_message","direct_mention","mention"],function(bot,message) {
  bot.replyWithTyping(message, '昇竜拳！');
});

controller.hears(["昇竜拳"],["direct_message","direct_mention","mention"],function(bot,message) {
  bot.replyWithTyping(message, '竜巻旋風脚！');
});

controller.hears(["アレックス フレーム表"],["direct_message","direct_mention","mention"],function(bot,message) {
  bot.replyWithTyping(message, 'https://docs.google.com/spreadsheets/d/1e8Ott5IfoyXaOcaGQfEW4gxbylA89mF9SB2An2M3gFY/edit#gid=1371017080');
});

controller.hears(['付き合って'], 'direct_message,direct_mention,mention,ambient',function(bot,message) {
  bot.replyWithTyping(message, 'お前の楽しみと俺の楽しみは違うようだ。悪いが付き合ってはやれない。');
});

//=========================================================
// 基本的な受け答え
//=========================================================

// 以下がBotkitの基本形です。
// controller.hears()で、マッチした単語に応じて処理を実行します。

// 第一引数 ['ほげ','ふが'] の部分には、マッチさせたい単語を入れます。正規表現も使えます。
// 第二引数 'direct_message,direct_mention' の部分には、反応するパターンを入れます。

//  [反応パターン一覧]
//    direct_message: ダイレクトメッセージに反応します
//    direct_mention: 先頭に@付きで発言されたメッセージに反応します
//    mention: @付きで言及されたメッセージに反応します
//    ambient: どんなメッセージタイプにも反応します

// controller.hears(['挨拶', 'こんにちは', 'Bot', 'あなた', '誰', 'だれ', '自己紹介'], 'direct_message,direct_mention,mention', function (bot, message) {

//     // bot.reply()で、botに発言をさせます。
//     bot.reply(message, 'こんにちは！私は *Botkit製のBot* です！ \n _いろんな事ができますよ！_ :smiley:');

// });



//=========================================================
// 質問形式の会話
//=========================================================

// controller.hears(['ラーメン'], 'direct_message,direct_mention,mention', function (bot, message) {

//     bot.reply(message, ':ramen:いいですよね:grin:');

//     // 会話を開始します。
//     bot.startConversation(message, function (err, convo) {

//         // convo.ask() で質問をします。
//         convo.ask('おおお！私が何味が好きか当ててみてください！', [
//             {
//                 pattern: '醤油', // マッチさせる単語
//                 callback: function (response, convo) {

//                     // ▼ マッチした時の処理 ▼

//                     convo.say('正解！:ok_woman:\n醤油！これぞ王道！:+1:'); // convo.say()で発言をします。
//                     convo.next(); // convo.next()で、会話を次に進めます。通常は、会話が終了します。
//                 }
//             },
//             {
//                 pattern: '味噌',
//                 callback: function (response, convo) {
//                     convo.say('正解！:ok_woman:\n寒いと味噌たべたくなります！:+1:');
//                     convo.next();
//                 }
//             },
//             {
//                 default: true,
//                 callback: function (response, convo) {

//                     // ▼ どのパターンにもマッチしない時の処理 ▼

//                     convo.say('うーん、おしいです！:no_good:');
//                     convo.repeat(); // convo.repeat()で、質問を繰り返します。
//                     convo.next(); // 会話を次に進めます。この場合、最初の質問にも戻ります。
//                 }
//             }
//         ]);

//     })

// });



//=========================================================
// 絵文字リアクション
//=========================================================

// controller.hears(['ハイタッチ'], 'direct_message,direct_mention,mention,ambient', function (bot, message) {

//     bot.reply(message, 'ハイタッチ！');

//     // 絵文字リアクションを追加
//     bot.api.reactions.add({
//         timestamp: message.ts,
//         channel: message.channel,
//         name: 'raising_hand', // ここで絵文字名を指定します (例 : smilely, muscle など)
//     }, function (err, res) {
//         if (err) {
//             bot.botkit.log('Failed to add emoji reaction :(', err); // エラーが出たとき用の出力
//         }
//     });

// });



//=========================================================
// 名前を覚える(データを保存する)
//=========================================================

// Botが、シャットダウン/再起動するまでの間、データを保持する事ができます。

// 保存、取得、削除、すべて削除 の4つの操作ができます。

//  [例]
//    controller.storage.users.save({id: message.user, foo:'bar'}, function(err) { ... });
//    controller.storage.users.get(id, function(err, user_data) {...});
//    controller.storage.users.delete(id, function(err) {...});
//    controller.storage.users.all(function(err, all_user_data) {...});


// Botkitは、「ユーザー」「チャンネル」「チーム」ごとにデータを保持できます。
// それぞれ、下記のように呼び出せます。

//  [例]
//    controller.storage.users.***
//    controller.storage.channels.***
//    controller.storage.teams.***


// controller.hears(['(.*)って呼んで'], 'direct_message,direct_mention,mention', function (bot, message) {


//     // 「◯◯って呼んで」の、◯◯の部分を取り出します。
//     // message.match[1] には、hearsの正規表現にマッチした単語が入っています。

//     var name_from_msg = message.match[1];


//     // まず、controller.storage.users.getで、ユーザーデータを取得します。

//     // message.userには、ユーザーIDが入っています。
//     // ユーザーデータは、ユーザーIDと紐付けていますので、第一引数には、必ずmessage.userを入れます。

//     controller.storage.users.get(message.user, function (err, user_info) {

//         // ▼ データ取得後の処理 ▼

//         // ユーザーデータが存在しているかどうか調べる
//         // ※第二引数で指定した変数(ここでは'user_info')に、ユーザーデータが入っています。
//         if (!user_info) {

//             // ▼ ユーザーデータがなかった場合の処理 ▼

//             // ユーザーidとユーザー名 のオブジェクトを、user_infoとして作成します。
//             user_info = {
//                 id: message.user,
//                 name: name_from_msg
//             };

//         }

//         // user_infoを保存します。
//         controller.storage.users.save(user_info, function (err, id) {

//             // ▼ 保存完了後の処理▼

//             bot.reply(message, 'あなたのお名前は *' + user_info.name + '* さんですね！覚えました！');

//         });

//     });

// });



//=========================================================
// どれにも当てはまらなかった場合の返答
//=========================================================

// controller.hears()には優先順位があり、上のものから優先にマッチします。
// すべてにマッチするhears()を、一番最後に記述すれば、
// 「当てはまらなかった場合の返答」を作成できます。

// controller.hears(['(.*)'], 'direct_message,direct_mention,mention', function (bot, message) {


//     // ユーザーデータを取得
//     controller.storage.users.get(message.user, function (err, user_info) {

//         if (user_info && user_info.name) {

//             // ▼ ユーザーデータが保存されていたときの処理 ▼

//             bot.reply(message, 'こんにちは *' + user_info.name + '* さん！ :grin:');

//         } else {

//             // ▼ ユーザーデータが保存されていなかった場合の処理 ▼

//             bot.reply(message, 'はじめまして！\n`「◯◯って呼んで」`って話しかけると、名前を覚えますよ!');

//         }
//     });
// });