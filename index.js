const {
	default: makeWASocket,
	useSingleFileAuthState,
	DisconnectReason,
	getContentType
} = require('@adiwajshing/baileys')
const fs = require('fs')
const P = require('pino')
const qrcode = require('qrcode-terminal')
const moment = require('moment-timezone')
const chalk = require('chalk')
const { getBuffer, fetchJson, fetchText, getRandom, getGroupAdmins, runtime, sleep, makeid } = require("./lib/myfunc");
const { reSize, generateProfilePicture } = require('./lib/myfunc')


const { state, saveState } = useSingleFileAuthState('./session.json')

const prefix = '.'
const ownerNumber = ['5493865402608']

const connectToWA = () => {
	const conn = makeWASocket({
		logger: P({ level: 'silent' }),
		printQRInTerminal: true,
		auth: state,
	})
	
	conn.ev.on('connection.update', (update) => {
		const { connection, lastDisconnect } = update
		if (connection === 'close') {
			if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
				connectToWA()
			}
		} else if (connection === 'open') {
			console.log('Bot conectado')
		}
	})
	
	conn.ev.on('creds.update', saveState)
	
	conn.ev.on('messages.upsert', async(mek) => {
		try {
			mek = mek.messages[0]
			if (!mek.message) return
			
			mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
			if (mek.key && mek.key.remoteJid === 'status@broadcast') return
			const type = getContentType(mek.message)
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			
			const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
			const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
			
			const isCmd = body.startsWith(prefix)
			const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
			
			const args = body.trim().split(/ +/).slice(1)
			const q = args.join(' ')
			const isGroup = from.endsWith('@g.us')
			const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
			const senderNumber = sender.split('@')[0]
			const botNumber = conn.user.id.split(':')[0]
			const pushname = mek.pushName || 'Sin Nombre'
			
			const isMe = botNumber.includes(senderNumber)
			const isOwner = ownerNumber.includes(senderNumber) || isMe
			
			const reply = async(teks) => {
				await conn.sendMessage(from, { text: teks }, { quoted: mek })
			}

// Le faltaba esto para el log XD 
const thumb = fs.readFileSync(`./media/thumb.jpg`)
const icon = await reSize(thumb, 300, 300)
const groupMetadata = isGroup ? await conn.groupMetadata(from) : null
const groupName = groupMetadata?.subject || ''
const time = moment().tz('America/Buenos_Aires').format('HH:mm:ss')
const groupMembers = isGroup ? groupMetadata.participants : ''
//const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''


     // Aqui esta el log pendeja 
     const color = (text, color) => {
	return !color ? chalk.green(text) : chalk.keyword(color)(text)
}
   
	if (!isGroup && !isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ PV ]', 'aqua'), color(body.slice(0, 50), 'white'), 'de', color(senderNumber, 'yellow'))
	if (isGroup && !isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[  GRUPO  ]', 'aqua'), color(body.slice(0, 50), 'white'), 'de', color(senderNumber, 'yellow'), 'para', color(groupName, 'yellow'))
	if (!isGroup && isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ CCOMANDO ]', 'aqua'), color(body, 'white'), 'from', color(senderNumber, 'yellow'))
	if (isGroup && isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ COMANDO ]', 'aqua'), color(body, 'white'), 'from', color(senderNumber, 'yellow'), 'para', color(groupName, 'yellow'))

		
			switch (command) {


case 'menu':{
const butlocNye = [
{buttonId: `${prefix}hidetag hola`, buttonText: {displayText: 'Tagme'}, type: 1},
]
const buttonLocnya = {
location: { jpegThumbnail: thumb },
caption: `.hidetag`,
mentions : [sender],
footer: `Sasuke-Bot`,
buttons: butlocNye,
headerType: "LOCATION"
}
conn.sendMessage(from, buttonLocnya)
}
break

case 'attp':		
try {
if (args.length < 1) return reply(`*Ej: ${prefix}attp Sasuke`)
url = await getBuffer(`https://api.brizaloka-api.tk/ttp/attp2?apikey=brizaloka&text=${encodeURI(q)}`)
await conn.sendMessage(from, {sticker: url}, {quoted: mek})
} catch {
reply('ERROR')
}
break	


case 'hidetag':
//if (!isGroup) return reply(mess.OnlyGrup)
//if (!isGroupAdmins && !isOwner) return sticAdmin(from)
let mem = [];
groupMembers.map( i => mem.push(i.id) )
conn.sendMessage(from, { text: q ? q : '', mentions: mem })
break

			}
			
		} catch (e) {
			const isError = String(e)
			
			console.log(isError)
		}

/*let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`[ BOT_LOG ] Se actualizó '${__filename}'`))
	delete require.cache[file]
	require(file)
})*/

	})
	

}

connectToWA()
