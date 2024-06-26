    AUDIO_DATA: process.env.AUDIO_DATA === undefined ? '𝘔𝘈𝘟𝘖-𝘟𝘌𝘙;𝘔𝘈𝘟𝘖-𝘔𝘋;https://i.imgur.com/cbYHXsx.jpeg' : process.env.AUDIO_DATA,
    STICKER_DATA: process.env.STICKER_DATA === undefined ? '𝘔𝘈𝘟𝘖-𝘟𝘌𝘙;𝘔𝘈𝘟𝘖-𝘔𝘋' : process.env.STICKER_DATA,
    ERROR_MESSAGE: toBool(process.env.ERROR_MESSAGE), 
    SONG_THUMBNAIL: toBool(process.env.SONG_THUMBNAIL),
    WARN: process.env.WARN || '4',
    HEROKU: {
        HEROKU: process.env.HEROKU === undefined ? false : convertToBool(process.env.HEROKU),
  188 changes: 95 additions & 93 deletions188  
plugins/youtube.js
@@ -17,6 +17,20 @@ const yts = require("yt-search")
const config = require('../config');
const Lang = getString('scrapers');
const fs = require('fs');

const send = async (message, file, id) => {
	if (config.SONG_THUMBNAIL == true) {
		await sendwithLinkpreview(message.client, message, file, 'https://www.youtube.com/watch?v=' + id)
	} else {
		await message.client.sendMessage(message.chat, {
			audio: file,
			mimetype: 'audio/mpeg'
		}, {
			quoted: message.data
		})
	}
}

Function({
	pattern: 'song ?(.*)',
	fromMe: isPublic,
@@ -33,22 +47,10 @@ Function({
		} catch (error) {
			media = await getJson(apiUrl + 'api/yta/' + ytId[1])
		}
		if (media.filesize >= 10000) return await message.client.sendMessage(message.chat, {
			audio: {
				url: media.dl_link
			},
			mimetype: 'audio/mpeg'
		}, {
			quoted: message.data
		})
		if (media.filesize >= 10000) return await send(message, await getBuffer(media.dl_link), ytId[1])
		let thumb = await getBuffer(media.thumb)
		let writer = await addAudioMetaData(await getBuffer(media.dl_link), thumb, media.title, `${config.BOT_INFO.split(";")[0]}`, 'Hermit Official')
		await message.client.sendMessage(message.chat, {
			audio: writer,
			mimetype: 'audio/mpeg'
		}, {
			quoted: message.data
		})
		await send(message, writer, ytId[1])
		return;
	}
	let search = await yts(match)
@@ -186,94 +188,94 @@ Function({
	type: 'download'
}, async (message, match, client) => {
	try {
	match = match || message.reply_message.text
	if (!match) return message.reply('_Need url or video name!_\n*Example: .ytv url/video name*')
	if (isUrl(match) && match.includes('youtu')) {
		const ytId = ytIdRegex.exec(match)
		var quality = match.match('\\{([a-z0-9]+)\\}')
		if (quality) {
			quality = quality[1]
		match = match || message.reply_message.text
		if (!match) return message.reply('_Need url or video name!_\n*Example: .ytv url/video name*')
		if (isUrl(match) && match.includes('youtu')) {
			const ytId = ytIdRegex.exec(match)
			var quality = match.match('\\{([a-z0-9]+)\\}')
			if (quality) {
				quality = quality[1]
			}
			const resol = quality || '360p'
			let result
			try {
				result = await yt('https://youtu.be/' + ytId[1], resol, 'mp4', resol.endsWith('p') ? resol.replace(/p/g, '') : resol, 'en412')
			} catch (error) {
				result = await getJson(apiUrl + 'api/ytv/' + ytId[1] + '?quality=' + resol)
			}
			if (result.filesize > 100000) {
				const url = await getJson('https://tinyurl.com/api-create.php?url=' + result.dl_link)
				return await message.reply('*Failed to Download*\n_File size is more is than 100MB_\nClick this url to download manually : ' + url)
			}
			if (quality) {
				return await message.client.sendMessage(message.jid, {
					video: await getBuffer(result.dl_link),
					caption: result.title
				}, {
					quoted: message.data
				})
			}
			const sections = [{
				title: result.title,
				rows: [{
						title: '1080p',
						description: result.list['1080p'] || 'Not Available',
						rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {1080p}`
					},
					{
						title: '720p',
						description: result.list['720p'] || 'Not Available',
						rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {720p}`
					},
					{
						title: '480p',
						description: result.list['480p'] || 'Not Available',
						rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {480p}`
					},
					{
						title: '360p',
						description: result.list['360p'] || 'Not Available',
						rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {360p}`
					},
					{
						title: '240p',
						description: result.list['240p'] || 'Not Available',
						rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {240p}`
					},
					{
						title: '144p',
						description: result.list['144p'] || 'Not Available',
						rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {144p}`
					}
				]
			}]
			const listMessage = {
				text: 'Select The Quality Below',
				title: result.title,
				buttonText: 'Select Quality',
				sections: sections
			}
			return await message.client.sendMessage(message.jid, listMessage);
		}
		const resol = quality || '360p'
		const search = await yts(match)
		if (search.all.length < 1) return await message.reply('_Not Found_');
		let result
		try {
			result = await yt('https://youtu.be/' + ytId[1], resol, 'mp4', resol.endsWith('p') ? resol.replace(/p/g, '') : resol, 'en412')
			result = await yt('https://youtu.be/' + search.videos[0].videoId, '360p', 'mp4', '360', 'en412')
		} catch (error) {
			result = await getJson(apiUrl + 'api/ytv/' + ytId[1] + '?quality=' + resol)
			result = await getJson(apiUrl + 'api/ytv/' + search.videos[0].videoId)
		}
		if (result.filesize > 100000) {
			const url = await getJson('https://tinyurl.com/api-create.php?url=' + result.dl_link)
			return await message.reply('*Failed to Download*\n_File size is more is than 100MB_\nClick this url to download manually : ' + url)
		}
		if (quality) {
			return await message.client.sendMessage(message.jid, {
				video: await getBuffer(result.dl_link),
				caption: result.title
			}, {
				quoted: message.data
			})
		}
		const sections = [{
			title: result.title,
			rows: [{
					title: '1080p',
					description: result.list['1080p'] || 'Not Available',
					rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {1080p}`
				},
				{
					title: '720p',
					description: result.list['720p'] || 'Not Available',
					rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {720p}`
				},
				{
					title: '480p',
					description: result.list['480p'] || 'Not Available',
					rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {480p}`
				},
				{
					title: '360p',
					description: result.list['360p'] || 'Not Available',
					rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {360p}`
				},
				{
					title: '240p',
					description: result.list['240p'] || 'Not Available',
					rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {240p}`
				},
				{
					title: '144p',
					description: result.list['144p'] || 'Not Available',
					rowId: `${prefix}ytv https://youtu.be/${ytId[1]} {144p}`
				}
			]
		}]
		const listMessage = {
			text: 'Select The Quality Below',
			title: result.title,
			buttonText: 'Select Quality',
			sections: sections
		}
		return await message.client.sendMessage(message.jid, listMessage);
	}
	const search = await yts(match)
	if (search.all.length < 1) return await message.reply('_Not Found_');
	let result
	try {
		result = await yt('https://youtu.be/' + search.videos[0].videoId, '360p', 'mp4', '360', 'en412')
	} catch (error) {
		result = await getJson(apiUrl + 'api/ytv/' + search.videos[0].videoId)
	}
	if (result.filesize > 100000) {
		const url = await getJson('https://tinyurl.com/api-create.php?url=' + result.dl_link)
		return await message.reply('*Failed to Download*\n_File size is more is than 100MB_\nClick this url to download manually : ' + url)
	}
	return await message.client.sendMessage(message.jid, {
		video: await getBuffer(result.dl_link),
		caption: result.title
	}, {
		quoted: message.data
	})
		return await message.client.sendMessage(message.jid, {
			video: await getBuffer(result.dl_link),
			caption: result.title
		}, {
			quoted: message.data
		})
	} catch (error) {
	await message.send('*Failed to download*\n_try .video cmd_')
		await message.send('*Failed to download*\n_try .video cmd_')
	}
});
