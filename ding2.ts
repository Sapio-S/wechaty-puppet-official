// JavaScript source code
/**
 * Wechaty - WeChat Bot SDK for Personal Account, Powered by TypeScript, Docker, and 💖
 *  - https://github.com/chatie/wechaty
 */
const {
    Wechaty,
    ScanStatus,
    log,
} = require('wechaty')

import { PuppetWork } from './puppet-work'

let puppetwork = new PuppetWork({})

function onScan (qrcode, status) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status)
  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin(user) {
    log.info('StarterBot', '%s login', user)
}

function onLogout(user) {
    log.info('StarterBot', '%s logout', user)
}

async function onMessage(msg) {
    log.info('StarterBot', msg.toString())
}

const bot = new Wechaty({
    name: 'ding-dong-bot',
    /**
     * Specify a puppet for a specific protocol (Web/Pad/Mac/Windows, etc).
     *
     * You can use the following providers:
     *  - wechaty-puppet-hostie
     *  - wechaty-puppet-puppeteer
     *  - wechaty-puppet-padplus
     *  - wechaty-puppet-macpro
     *  - etc.
     *
     * Learn more about Wechaty Puppet Providers at:
     *  https://github.com/wechaty/wechaty-puppet/wiki/Directory
     */
    puppet: puppetwork,
    // Set as above, or set using environment variable WECHATY_PUPPET
})

//bot.on('scan',    onScan)
bot.on('login', onLogin)
//bot.on('logout', onLogout)
bot.on('message', onMessage)

bot.start()
    .then(() => log.info('StarterBot', 'Starter Bot Started.'))
    .catch(e => log.error('StarterBot', e))