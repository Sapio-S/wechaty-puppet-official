import {
    MessagePayload, 
	MessageType,
    Puppet,
    PuppetOptions,
    ImageType,
    MiniProgramPayload,
    UrlLinkPayload,
    FileBox,
	EventMessagePayload,
	ContactPayload,
	ContactGender,
	ContactType,
	RoomPayload,
} from 'wechaty-puppet'

import ffi = require('ffi')

var libSDK = ffi.Library('./demo.dll', {
	'getchat': [ 'string', ['int', 'int', "string", "int"]],
	'initial': ['void', []],
	'destroy': ['void', []],
	'getMedia': ['string', ['int','string', "string"]],
})

export type PuppetWorkOptions = PuppetOptions

class PuppetWork extends Puppet {
    
	// fake login
	id = "on"
	//private loopTimer?: NodeJS.Timer
	seq = 6779
	msgNum = 0
	freq = 100 // 100ms 进行一次拉取
	/* protected readonly cacheMessagePayload        : QuickLru<string, MessagePayload>
	this.cacheMessagePayload        = new QuickLru<string, MessagePayload>(lruOptions(500))
	 */
	
    constructor(
        public options: PuppetWorkOptions = {},
    ) {
        super(options)
        console.log("puppetWork", "constructor()")
    }

    async start(): Promise<void> {
		console.log('Puppet', 'start()')

		if (this.state.on()) {
			console.log('Puppet', 'start() is called on a ON puppet. await ready(on) and return.')
			await this.state.ready('on')
			return
		}

		this.state.on('pending')

		libSDK.initial()

		this.state.on(true)
		
		const eventMessagePayload: EventMessagePayload = {messageId: this.msgNum.toString()} 
		this.emit('message', eventMessagePayload)
    }
	
	private loadmessage(){
		const eventMessagePayload: EventMessagePayload = {
			messageId: "0",
		}
		this.emit('message', eventMessagePayload)
	}
	
    async stop(): Promise<void> {
        console.log('Puppet', 'stop()')
		
		//clearInterval(this.interval)
		
		if (this.state.off()) {
			console.log('Puppet', 'stop() is called on a OFF puppet. await ready(off) and return.')
			await this.state.ready('off')
			return
		}

		this.state.off('pending')
		libSDK.destroy()

		if (this.logonoff()) {
			await this.logout()
		}

		this.state.off(true)
    }
	
	protected async messageRawPayload(messageId: string): Promise<any> {
		console.log("puppetWork", "messageRawPayload()")
		return messageId
    }
	
/* 	protected messagePayloadCache (messageId: string): undefined | MessagePayload {
		if (!messageId) {
			throw new Error('no id')
		}
		const cachedPayload = this.cacheMessagePayload.get(messageId)
		if (cachedPayload) {
      // log.silly('Puppet', 'messagePayloadCache(%s) cache HIT', messageId)
		} else {
			log.silly('Puppet', 'messagePayloadCache(%s) cache MISS', messageId)
		}
	return cachedPayload
	}
	 */
    public async messageRawPayloadParser(rawPayload: MessagePayload): Promise<MessagePayload> {
		console.log("puppetWork", "messageRawPayloadParser()")
		
		var message = libSDK.getchat(0, 1, "text.txt", this.seq)
		this.seq = this.seq + 1// need amendment
		console.log(message)
		for(var i = 0; i < 5; i++){
			try {
				var content = JSON.parse(message)
				if(content.action == 
				"switch"){
					var payload : MessagePayload = {
						id: content.msgid, 
						timestamp: content.time, 
						type: MessageType.Text, 
						fromId: content.user, 
						toId: "x", 
						//roomId: content.roomid,
						text: "Switch"} 
						
					this.msgNum += 1
					setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
					return payload
				}
				// TODO 可以重构为switch语句
				else if(content.msgtype == "markdown"){
					if(content.tolist.length() > 1){
						var payload : MessagePayload = {
					id: content.msgid, 
					timestamp: content.msgtime, 
					type: MessageType.Text, 
					fromId: content.from, 
					//toId: content.tolist[0], 
					roomId: content.roomid,
					text: content.info.content} 
					}
					var payload : MessagePayload = {
					id: content.msgid, 
					timestamp: content.msgtime, 
					type: MessageType.Text, 
					fromId: content.from, 
					toId: content.tolist[0], 
					//roomId: content.roomid,
					text: content.info.content} 
					this.msgNum += 1
					setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
				
					return payload
				}
				else if(content.msgtype == "text"){
					var payload : MessagePayload = {
						id: content.msgid, 
						timestamp: content.msgtime, 
						type: MessageType.Text, 
						fromId: content.from, 
						toId: content.tolist[0], 
						//roomId: content.roomid,
						text: content.text.content} 
					this.msgNum += 1
					setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
				
					return payload
				}
				else if(content.msgtype == "card"){
					var payload : MessagePayload = {
						id: content.msgid, 
						timestamp: content.msgtime, 
						type: MessageType.Text, 
						fromId: content.from, 
						toId: content.tolist[0], 
						//roomId: content.roomid,
						text: "card. corpname: "+content.card.corpname+" ; userid: "+content.card.userid} 
					this.msgNum += 1
					setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
					return payload
				}
				else if(content.msgtype == "revoke"){
					var payload : MessagePayload = {
						id: content.msgid, 
						timestamp: content.msgtime, 
						type: MessageType.Text, 
						fromId: content.from, 
						toId: content.tolist[0], 
						//roomId: content.roomid,
						text: "revoke a message. The origianl message id is"+content.pre_msgid} 
					this.msgNum += 1
					setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
					return payload
				}
				else if(content.msgtype == "location"){
					var payload : MessagePayload = {
						id: content.msgid, 
						timestamp: content.msgtime, 
						type: MessageType.Text, 
						fromId: content.from, 
						toId: content.tolist[0], 
						//roomId: content.roomid,
						text: "location: "+content.location.address} 
					this.msgNum += 1
					setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
				
					return payload
				}
				else if(content.msgtype == "link"){
					var payload : MessagePayload = {
						id: content.msgid, 
						timestamp: content.msgtime, 
						type: MessageType.Text, 
						fromId: content.from, 
						toId: content.tolist[0], 
						//roomId: content.roomid,
						text: "link. title: "+content.link.title+" description: "+content.link.description} 
					this.msgNum += 1
					setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
					return payload
				}
				else if(content.msgtype == "weapp"){
					var payload : MessagePayload = {
						id: content.msgid, 
						timestamp: content.msgtime, 
						type: MessageType.Text, 
						fromId: content.from, 
						toId: content.tolist[0], 
						//roomId: content.roomid,
						text: "小程序。 title: "+content.weapp.title+" description: "+content.weapp.description} 
					this.msgNum += 1
					setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
					return payload
				}
				else if(content.msgtype == "chatrecord"){
					var payload : MessagePayload = {
						id: content.msgid, 
						timestamp: content.msgtime, 
						type: MessageType.Text, 
						fromId: content.from, 
						toId: content.tolist[0], 
						//roomId: content.roomid,
						text: "聊天记录。 title: "+content.chatrecord.title+" items: "+content.chatrecord.description} 
					this.msgNum += 1
					setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
					return payload
				}
				else if(content.msgtype.indexOf("ChatRecord") != -1){//会话记录消息item？
					var payload : MessagePayload = {
						id: content.msgid, 
						timestamp: content.msgtime, 
						type: MessageType.Text, 
						fromId: content.from, 
						toId: content.tolist[0], 
						//roomId: content.roomid,
						text: "聊天记录item, 待办"} 
					this.msgNum += 1
					setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
					return payload
				}
				else if(content.msgtype == "todo"){//会话记录消息item？
					var payload : MessagePayload = {
						id: content.msgid, 
						timestamp: content.msgtime, 
						type: MessageType.Text, 
						fromId: content.from, 
						toId: content.tolist[0], 
						//roomId: content.roomid,
						text: "待办. title: "+content.todo.title+" content: "+content.todo.content} 
					this.msgNum += 1
					setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
					return payload
				}
				else if(content.msgtype == "markdown"){
					var payload : MessagePayload = {
						id: content.msgid, 
						timestamp: content.msgtime, 
						type: MessageType.Text, 
						fromId: content.from, 
						toId: content.tolist[0], 
						//roomId: content.roomid,
						text: "markdown. content: "+content.markdown.content} 
					this.msgNum += 1
					setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
					return payload
				}
				else if(content.msgtype == "image"){
					var payload : MessagePayload = {
						id: content.msgid, 
						timestamp: content.msgtime, 
						type: MessageType.Image, 
						fromId: content.from, 
						toId: content.tolist[0], 
						//roomId: content.roomid,
						text: "image"} 
					this.msgNum += 1
					var sdkfileid = content.image.sdkfileid
					var ret = libSDK.getMedia(content.image.filesize, sdkfileid, "media/image/"+content.msgid.toString()+".jpg");
					setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
					return payload
				}
				else if(content.msgtype == "voice"){
					var payload : MessagePayload = {
						id: content.msgid, 
						timestamp: content.msgtime, 
						type: MessageType.Audio, 
						fromId: content.from, 
						toId: content.tolist[0], 
						//roomId: content.roomid,
						text: "voice "+content.voice.play_length} 
					this.msgNum += 1
					var ret = libSDK.getMedia(content.voice.voice_size,content.voice.sdkfileid, "media/voice/"+content.msgid.toString()+".amr");
					setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
					return payload
				}
				else if(content.msgtype == "video"){
					var payload : MessagePayload = {
						id: content.msgid, 
						timestamp: content.msgtime, 
						type: MessageType.Video, 
						fromId: content.from, 
						toId: content.tolist[0], 
						//roomId: content.roomid,
						text: "video "+content.video.play_length} 
					this.msgNum += 1
					var ret = libSDK.getMedia(content.video.filesize,content.video.sdkfileid, "media/video/"+content.msgid.toString()+".mp4");
					setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
					return payload
				}
				else if(content.msgtype == "emotion"){
					var payload : MessagePayload = {
						id: content.msgid, 
						timestamp: content.msgtime, 
						type: MessageType.Emoticon, 
						fromId: content.from, 
						toId: content.tolist[0], 
						//roomId: content.roomid,
						text: "emotion "+content.emotion.width+"*"+content.emotion.height} 
					this.msgNum += 1
					if(content.type == 1){
						var ret = libSDK.getMedia(content.emotion.imagesize,content.emotion.sdkfileid, "media/emotion/"+content.msgid.toString()+".gif");
					}
					else{
						var ret = libSDK.getMedia(content.emotion.imagesize,content.emotion.sdkfileid, "media/emotion/"+content.msgid.toString()+".png");
					}
					setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
					return payload
				}
				else if(content.msgtype == "file"){
					var payload : MessagePayload = {
						id: content.msgid, 
						timestamp: content.msgtime, 
						type: MessageType.Attachment, 
						fromId: content.from, 
						toId: content.tolist[0], 
						//roomId: content.roomid,
						text: "emotion "+content.file.filename} 
					this.msgNum += 1
					var ret = libSDK.getMedia(content.file.filesize,content.file.sdkfileid, "media/file/"+content.msgid.toString()+"."+content.file.fileext);
					setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
					return payload
				}
				else{
					var payload : MessagePayload = {
						id: content.msgid, 
						timestamp: content.msgtime, 
						type: MessageType.Text, 
						fromId: content.from, 
						toId: content.tolist[0], 
						//roomId: content.roomid,
						text: "ErrorMessage"+content.pre_msgid} 
					this.msgNum += 1
					setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
					return payload
				}
			}
			catch(e) {
				message = libSDK.getchat(i+1, 0, "text.txt") // 重新获取缓存的字符串
			}
		}
		// 应该是没有最新消息了
		setTimeout(() => this.emit('message', {messageId: this.msgNum.toString()}), this.freq)
		//throw new Error("Failed to get valid message after 5 trials! pls retry.")
		
    }
	
	protected async contactRawPayload(contactId: string): Promise<any> {
		console.log("puppetWork", "contactRawPayload()")
		return contactId
    }
	
    protected async contactRawPayloadParser(rawPayload: any): Promise<ContactPayload> {
		console.log("puppetWork", "contactRawPayloadParser()")
		console.log(rawPayload)
		let contactType = ContactType.Unknown
 		const payload: ContactPayload = {
			alias     : "",
			avatar    : "",
			city      : "",
			gender    : ContactGender.Unknown,
			id        : "",
			name      : "unknown",
			province  : "",
			signature : "",
			type      : contactType,
			weixin    : "",
		} 
		return payload
    }
	
	protected async roomRawPayload(roomId: string): Promise<any> {
		console.log("puppetWork", "roomRawPayload()")
        return roomId
    }
	
    protected async roomRawPayloadParser(rawPayload: any): Promise<RoomPayload> {
		console.log("puppetWork", "roomRawPayloadParser()")
		//console.log(rawPayload)
		const payload: RoomPayload = {
			id:  "",
			avatar:"",
			topic:"",
			memberIdList:[],
			adminIdList:[],
		}
		return payload
        //throw new Error("roomRawPayloadParser Method not implemented.")
    }
	 
	public async login(): Promise<void> {
		console.log("puppetWork", "login()")
		this.id = "on"
        //throw new Error("logout Method not implemented.")
    }
	
    public async logout(): Promise<void> {
		console.log("puppetWork", "logout()")
		this.id = ""
        //throw new Error("logout Method not implemented.")
    }
	
    ding(data?: string): void {
        throw new Error(" ding Method not implemented.")
    }
	
    contactSelfName(name: string): Promise<void> {
        throw new Error("contactSelfName Method not implemented.")
    }
    contactSelfQRCode(): Promise<string> {
        throw new Error("Method not implemented.")
    }
    contactSelfSignature(signature: string): Promise<void> {
        throw new Error("contactSelfSignature Method not implemented.")
    }
    tagContactAdd(tagId: string, contactId: string): Promise<void> {
        throw new Error("Method not implemented.")
    }
    tagContactDelete(tagId: string): Promise<void> {
        throw new Error("Method not implemented.")
    }
    tagContactList(tagId: string, contactId: string): Promise<string[]>;
    tagContactList(): Promise<string[]>
    tagContactList(contactId?: any): Promise<string[]> | null {
        throw new Error("tagContactList Method not implemented.")
    }
    tagContactRemove(tagId: string, contactId: string): Promise<void> {
        throw new Error("tagContactRemove Method not implemented.")
    }
    contactAlias(contactId: string): Promise<string>
    contactAlias(contactId: string, alias: string): Promise<void>
    contactAlias(contactId: any, alias?: any): Promise<void> | Promise<string> {
        throw new Error("contactAlias Method not implemented.")
    }
    contactAvatar(contactId: string): Promise<FileBox>
    contactAvatar(contactId: string, file: FileBox): Promise<void>
    contactAvatar(contactId: any, file?: any): Promise<FileBox> | Promise<void> {
        throw new Error("contactAvatar Method not implemented.")
    }
    contactList(): Promise<string[]> {
        throw new Error("contactList Method not implemented.")
    }

    friendshipAccept(friendshipId: string): Promise<void> {
        throw new Error("Method not implemented.")
    }
    friendshipAdd(contactId: string, hello?: string): Promise<void> {
        throw new Error("Method not implemented.")
    }
    friendshipSearchPhone(phone: string): Promise<string> {
        throw new Error("Method not implemented.")
    }
    friendshipSearchWeixin(weixin: string): Promise<string> {
        throw new Error("Method not implemented.")
    }
    protected friendshipRawPayload(friendshipId: string): Promise<any> {
        throw new Error("friendshipRawPayload Method not implemented.")
    }
    protected friendshipRawPayloadParser(rawPayload: any): Promise<import("wechaty-puppet").FriendshipPayload> {
        throw new Error("friendshipRawPayloadParser Method not implemented.")
    }
    messageContact(messageId: string): Promise<string> {
        throw new Error("message contact Method not implemented.")
    }
    messageFile(messageId: string): Promise<FileBox> {
        throw new Error("messageFile Method not implemented.")
    }
    messageImage(messageId: string, imageType: ImageType): Promise<FileBox> {
        throw new Error("Method not implemented.")
    }
    messageMiniProgram(messageId: string): Promise<MiniProgramPayload> {
        throw new Error("Method not implemented.")
    }
    messageUrl(messageId: string): Promise<UrlLinkPayload> {
        throw new Error("Method not implemented.")
    }
    messageSendContact(conversationId: string, contactId: string): Promise<string | void> {
        throw new Error("messageSendContact Method not implemented.")
    }
    messageSendFile(conversationId: string, file: FileBox): Promise<string | void> {
        throw new Error("Method not implemented.")
    }
    messageSendMiniProgram(conversationId: string, miniProgramPayload: MiniProgramPayload): Promise<string | void> {
        throw new Error("Method not implemented.")
    }
    messageSendText(conversationId: string, text: string, mentionIdList?: string[]): Promise<string | void> {
        throw new Error("messageSendText Method not implemented.")
    }
    messageSendUrl(conversationId: string, urlLinkPayload: UrlLinkPayload): Promise<string | void> {
        throw new Error("Method not implemented.")
    }
    messageRecall(messageId: string): Promise<boolean> {
        throw new Error(" messageRecall messageRecall Method not implemented.")
    }

    roomInvitationAccept(roomInvitationId: string): Promise<void> {
        throw new Error("Method not implemented.")
    }
    protected roomInvitationRawPayload(roomInvitationId: string): Promise<any> {
        throw new Error("Method not implemented.")
    }
    protected roomInvitationRawPayloadParser(rawPayload: any): Promise<import("wechaty-puppet").RoomInvitationPayload> {
        throw new Error("Method not implemented.")
    }
    roomAdd(roomId: string, contactId: string): Promise<void> {
        throw new Error("Method not implemented.")
    }
    roomAvatar(roomId: string): Promise<FileBox> {
        throw new Error("Method not implemented.")
    }
    roomCreate(contactIdList: string[], topic?: string): Promise<string> {
        throw new Error("Method not implemented.")
    }
    roomDel(roomId: string, contactId: string): Promise<void> {
        throw new Error("Method not implemented.")
    }
    roomList(): Promise<string[]> {
        throw new Error("Method not implemented.")
    }
    roomQRCode(roomId: string): Promise<string> {
        throw new Error("Method not implemented.")
    }
    roomQuit(roomId: string): Promise<void> {
        throw new Error("Method not implemented.")
    }
    roomTopic(roomId: string): Promise<string>
    roomTopic(roomId: string, topic: string): Promise<void>
    roomTopic(roomId: any, topic?: any): Promise<string> | Promise<void> {
        throw new Error("roomTopic Method not implemented.")
    }
    
    roomAnnounce(roomId: string): Promise<string>
    roomAnnounce(roomId: string, text: string): Promise<void>
    roomAnnounce(roomId: any, text?: any): Promise<string> | Promise<void> {
        throw new Error("Method not implemented.")
    }
    roomMemberList(roomId: string): Promise<string[]> {
        throw new Error("Method not implemented.")
    }
    protected roomMemberRawPayload(roomId: string, contactId: string): Promise<any> {
        throw new Error("roomMemberRawPayload Method not implemented.")
    }
    protected roomMemberRawPayloadParser(rawPayload: any): Promise<import("wechaty-puppet").RoomMemberPayload> {
        throw new Error("roomMemberRawPayloadParser Method not implemented.")
    }

}

export { PuppetWork }
export default PuppetWork
