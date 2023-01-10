"use strict";

const { modul } = require('../module');

const { axios, baileys, chalk, fs, human, Jimp, moment, util } = modul;

//const jimp = require("jimp")

exports.serialize = (conn, mek) => {

    /** if (mek.message["ephemeralMessage"]){

        mek.message = mek.message.ephemeralMessage.message

        mek.ephemeralMessage = true

        

    }else{

      mek.ephemeralMessage = false

    } */

    mek.isGroup = mek.key.remoteJid.endsWith('@g.us')

    try{

        const berak = Object.keys(mek.message)[0]

        mek.type = berak

    } catch {

        mek.type = null

    }

    try{

        const context = mek.message[mek.type].contextInfo.quotedMessage

        if(context["ephemeralMessage"]){

            mek.quotedmek = context.ephemeralMessage.message

        }else{

            mek.quotedmek = context

        }

        mek.isQuotedmek = true

        mek.quotedmek.sender = mek.message[mek.type].contextInfo.participant

        mek.quotedmek.fromMe = mek.quotedmek.sender === conn.user.id.split(':')[0]+'@s.whatsapp.net' ? true : false

        mek.quotedmek.type = Object.keys(mek.quotedmek)[0]

        let ane = mek.quotedmek

        mek.quotedmek.chats = (ane.type === 'conversation' && ane.conversation) ? ane.conversation : (ane.type == 'imageMessage') && ane.imageMessage.caption ? ane.imageMessage.caption : (ane.type == 'documentMessage') && ane.documentMessage.caption ? ane.documentMessage.caption : (ane.type == 'videoMessage') && ane.videoMessage.caption ? ane.videoMessage.caption : (ane.type == 'extendedTextMessage') && ane.extendedTextMessage.text ? ane.extendedTextMessage.text : (ane.type == 'buttonsMessage') && ane.buttonsMessage.contentText ? ane.buttonsMessage.contentText : ""

        mek.quotedmek.id = mek.message[mek.type].contextInfo.stanzaId

    }catch{

        mek.quotedmek = null

        mek.isQuotedmek = false

    }

    try{

        const mention = mek.message[mek.type].contextInfo.mentionedJid

        mek.mentioned = mention

    }catch{

        mek.mentioned = []

    }

    

    if (mek.isGroup){

        mek.sender = mek.participant

    }else{

        mek.sender = mek.key.remoteJid

    }

    if (mek.key.fromMe){

        mek.sender = conn.user.id.split(':')[0]+'@s.whatsapp.net'

    }

    mek.from = mek.key.remoteJid

    mek.now = mek.messageTimestamp

    mek.fromMe = mek.key.fromMe

    return mek

}

exports.getRandom = (ext) => {

    return `${Math.floor(Math.random() * 10000)}${ext}`

}

exports.getBuffer = async (url, options) => {

	try {		options ? options : {}

		const res = await axios({

			method: "get",

			url,

			headers: {

				'DNT': 1,

				'Upgrade-Insecure-Request': 1

			},

			...options,

			responseType: 'arraybuffer'

		})

		return res.data

	} catch (e) {

		console.log(`Error : ${e}`)

	}

}

exports.generateProfilePicturee = async (buffer) => {

	const jimp = await Jimp.read(buffer)

	const min = Jimp.getWidth()

	const max = Jimp.getHeight()

	const cropped = Jimp.crop(0, 0, min, max)

	return {

		img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),

		preview: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG)

	}

}

exports.generateProfilePicture = async(buffer) => {

const jimp_1 = await Jimp.read(buffer);

const resz = jimp_1.getWidth() > jimp_1.getHeight() ? jimp_1.resize(550, Jimp.AUTO) : jimp_1.resize(Jimp.AUTO, 650)

const jimp_2 = await Jimp.read(await resz.getBufferAsync(Jimp.MIME_JPEG));

return {

img: await resz.getBufferAsync(Jimp.MIME_JPEG)

}

}

exports.reSize = (buffer, ukur1, ukur2) => {

    return new Promise(async(resolve, reject) => {

        var baper = await Jimp.read(buffer);

        var ab = await baper.resize(ukur1, ukur2).getBufferAsync(Jimp.MIME_JPEG)

        resolve(ab)

    })

}

exports.fetchJson = (url, options) => new Promise(async(resolve, reject) => {

    fetch(url, options)

        .then(response => response.json())

        .then(json => {

            resolve(json)

        })

        .catch((err) => {

            reject(err)

        })

})

exports.fetchText = (url, options) => new Promise(async(resolve, reject) => {

    fetch(url, options)

        .then(response => response.text())

        .then(text => {

            resolve(text)

        })

        .catch((err) => {

            reject(err)

        })

})

exports.getGroupAdmins = function(participants){

    let admins = []

	for (let i of participants) {

		i.admin !== null ? admins.push(i.id) : ''

	}

	return admins

}

exports.runtime = function(seconds) {

	seconds = Number(seconds);

	var d = Math.floor(seconds / (3600 * 24));

	var h = Math.floor(seconds % (3600 * 24) / 3600);

	var m = Math.floor(seconds % 3600 / 60);

	var s = Math.floor(seconds % 60);

	var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " hari, ") : "";

	var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " jam, ") : "";

	var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " menit, ") : "";

	var sDisplay = s > 0 ? s + (s == 1 ? " second" : " detik") : "";

	return dDisplay + hDisplay + mDisplay + sDisplay;

}

exports.removeEmojis = (string) => {

	var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

	return string.replace(regex, '');

}

exports.calculate_age = (dob) => { // new Date("month/date/year")

    var diff_ms = Date.now() - dob.getTime();

	var age_dt = new Date(diff_ms);

	return Math.abs(age_dt.getUTCFullYear() - 1970);

}

exports.sleep = async (ms) => {

    return new Promise(resolve => setTimeout(resolve, ms));

}

exports.url = (url) => {

return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'))

}

exports.makeid = (length) => {

    let result = '';

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {

        result += characters.charAt(Math.floor(Math.random() *

            charactersLength));

    }

    return result;

}
