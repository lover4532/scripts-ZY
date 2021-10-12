'use strict';

const axios = require('axios');
const { resolve } = require('path');
const dsjCookie = require('./dsjCOOKIE')
const $ = new Env('电视家提现');
const notify = $.isNode() ? require('./sendNotify') : '';

let defaultHeader = {
    'systemSdkVersion': 29,
    'User-Agent': 'android%2Fclient',
    'hwBrand': 'HONOR',
    'appVerName': '2.9.3-beta3',
    'hwDevice': 'HWBKL',
    'language': 'zh_CN_%23Hans',
    'uuid': '25cfdedc03562423e177d610d601f7bc',
    'platform': '10',
    'hwModel': 'BKL-AL20',
    'generation': 'com.dianshijia.tvlive',
    'hwHardware': 'kirin970',
    'Connection': 'close',
    'routermac': '047970789cdf',
    'appVerCode': '353',
    'areaCode': '440300',
    'cuuid': '325c08175f8e5b2419d2e415b812a516',
    'appid': '0990028e54b2329f2dfb4e5aeea6d625',
    'marketChannelName': 'default_oy',
    'Host': 'pay.gaoqingdianshi.com',
    'Accept-Encoding': 'gzip'
};

const TxMap = {
    5: "tx00031",
    10: "tx000041",
    20: "tx0030",
    25: "tx00025",
    30: "tx00005",
    50: "tx00006",
    100: "tx0100"
};

const defaultTx = 5;
// var main = async function bingfatixian() {
//     await Promise.all(accounts.map((account) => {
//         return tixian(account)
//     }));
// }

(function main() {
    // await new Promise((resolve) => { console.log(42); });
    const accounts = dsjCookie.datas.filter(x => x.val !== '');
    console.log(`一共${accounts.length}个账号！`);

    var queryTask = []
    accounts.forEach(account => {
        account.txCode = TxMap[defaultTx]
        queryTask.push(queryCash(account))
    })
    var totalMessage = ""
    //58秒查询资金情况
    var queryMessage = ''
    var queryPromise = Promise.all(queryTask).then(results => {
        queryMessage = results.join('\n')
        console.log(queryMessage)
        return Promise.resolve();
    })

    var txPromise = new Promise((resolve) => {
        //58秒运行，59秒开始进入抢购，每次抢购间隔200毫秒
        setTimeout(() => {
            resolve()
        }, 1000);
    }).then(() => {
        console.log(`开始进入抢，时间：${new Date()}`)
        var allTasks = []
        accounts.forEach(account => {
            allTasks.push(tixian(account))
        })
        return Promise.all(allTasks).then((results) => {
            var endTime = new Date()
            endTime.getHours();
            console.log(`结束抢，时间：${new Date()}`)
            var resultMessage = '\n抢提现的结果:'
            console.log(`\n抢提现的结果:`)
            for (let index = 0; index < accounts.length; index++) {
                const account = accounts[index];
                const result = results[index];
                if (account.disable) {
                    resultMessage = `${resultMessage} \n${account.desc}没有进行提现，${account.hadTx ? "今天已经提现了" : "可能额度不够哦。"}`
                    console.log(`\n${account.desc}没有进行提现，${account.hadTx ? "今天已经提现了" : "可能额度不够哦。"}`)
                } else {
                    account.isSucess = result;
                    resultMessage = resultMessage + `\n${account.desc}提现￥${account.txAmount}}${result ? "成功" : "失败"}`
                    console.log(`\n${account.desc}提现￥${account.txAmount}${result ? "成功" : "失败"}`)
                }
            }

            if ($.isNode()) {
                totalMessage = queryMessage + resultMessage;
            }
            return Promise.resolve()
        })
    })

    Promise.all([queryPromise, txPromise]).then(() => {
        //最后一波也没抢到，则随机提现
        var endTime = new Date()
        if (endTime.getHours() >= 20) {
            var failAccounts = accounts.filter(x => !x.hadTx && !x.isSucess);
            if (failAccounts.length > 0) {
                console.log("\n 对失败账号随机提现！")
                totalMessage = totalMessage + "\n随即提现："
                var rantTxPromise = []
                var rantTxAccounts = []
                failAccounts.forEach(account => {
                    if (typeof account.randTx === 'string' && account.randTx === "") {
                        rantTxAccounts.push(account)
                        rantTxPromise.push(tixian(account, true))
                    }
                    else {
                        totalMessage = totalMessage + `\n 账号${account.desc}随机提现没有设置！`
                        console.log(`\n 账号${account.desc}随机提现没有设置！`)
                    }
                });
                Promise.all(rantTxPromise).then(results => {
                    for (let index = 0; index < rantTxAccounts.length; index++) {
                        const failAccount = rantTxAccounts[index];
                        const rantReulst = results[index]
                        if (rantReulst)
                            totalMessage = `\n账号${failAccount.desc}随机提现￥${failAccount.txAmount}`
                        else
                            totalMessage = `\n账号${failAccount.desc}随机提现失败`
                    }
                    notify.sendNotify(`电视家提现资格抢购`, totalMessage);

                })
            } else
                notify.sendNotify(`电视家提现资格抢购`, totalMessage);
        }
        else
            notify.sendNotify(`电视家提现资格抢购`, totalMessage);
    })



    // await Promise.all(accounts.map((account) => {
    //     // return tixian(account)
    //     return new Promise(resolve => { tixian(account) })
    // }));
})();

async function tixian(account, isrant = false) {
    if (typeof account.disable === 'boolean' && account.disable) {
        return false
    }

    var qiangouparas = []
    if (isrant)
        qiangouparas.push(account.randTx)
    else
        qiangouparas = account[account.txCode];
    account.count = qiangouparas.length
    const headers = getHeader(account)
    var isSucess = false
    var currentIndex = 0
    let promise = new Promise((resolve, reject) => {
        //每200毫秒执行一次
        account.intervalId = setInterval(async () => {
            if (account.hadTx)
                resolve(false)
            if (currentIndex + 1 <= account.count) {
                const para = qiangouparas[currentIndex]
                currentIndex++
                const url = `http://pay.gaoqingdianshi.com/api/v2/cash/withdrawal?${para}`
                var result = await axios.get(url, { headers })
                if (result.data.errCode == 0) {
                    account.txAmount = result.data.data.prise / 100
                    console.log(`\n账号${account.desc}提现￥${account.txAmount}成功！`)
                    isSucess = true;
                }
                else
                    console.log(`\n账号${account.desc}提现￥${account.txAmount ? account.txAmount : defaultTx}：-${result.data.msg}！`)

                if (currentIndex >= account.count || isSucess)
                    resolve(isSucess)
            }
        }, 200);
    }).finally(() => {
        clearInterval(account.intervalId)
    })

    return promise;
    // return Promise.resolve(isSucess);
}
/**
 * 查询金额
 * @param {string} authorizationVal 
 * @returns void
 */
async function queryCash(account) {
    const headers = getHeader(account)
    const url = `http://pay.gaoqingdianshi.com/api/cash/info`
    var result = await axios.get(url, { headers })
    var resultMessage = '';
    if (result.data.errCode == 0) {
        var isWithdrawalToday = result.data.data.isWithdrawalToday
        //额度
        var withdrawalQuota = Number.parseInt(result.data.data.withdrawalQuota) / 100
        //金币
        var amount = Number.parseInt(result.data.data.amount) / 100

        var noSettingTX = "";
        var candrawalQuota = 0;
        //今天已经提现
        if (isWithdrawalToday) {
            account.disable = true
            account.hadTx = true;
        }
        else {
            //额度，金币未达到要求5元
            if (withdrawalQuota < 5) {
                account.disable = true
            }
            else {
                var calResult = calcTXCode(account, withdrawalQuota);

                account.txCode = calResult.txStepCode
                noSettingTX = calResult.warningUnConfigStep

                account.txAmount = calResult.candrawalQuota
                candrawalQuota = calResult.candrawalQuota;
                if (candrawalQuota == 0)
                    account.disable = true
            }
        }
        resultMessage = `账号${account.desc},今天${isWithdrawalToday ? '已经提现' : '还没有提现'}\n总金币：${amount}\n提现额度：￥${withdrawalQuota}\n今天可提：￥${candrawalQuota}${noSettingTX.length > 0 ? "\n警告：没有设置提现Body" + noSettingTX : ""}\n`
    }
    else
        resultMessage = `账号${account.desc}获取资金信息失败！但依旧会执行抢购`
    return resultMessage
}

function getHeader(account) {
    var accountCK = account.val.split('&');
    const headers = { ...defaultHeader, ...{ authorization: accountCK[1], userid: accountCK[0] }, ...account.headerEx }
    return headers;
}
function calcTXCode(account, withdrawalQuota) {
    var txSteps = Object.keys(TxMap).map(x => Number.parseInt(x))
    var canTxSteps = txSteps.filter(x => withdrawalQuota >= x).sort((a, b) => b - a)

    var warningUnConfigStep = ""
    for (let index = 0; index < canTxSteps.length; index++) {
        const txStepCode = TxMap[canTxSteps[index]];
        if (typeof account[txStepCode] !== 'undefined') {
            return { warningUnConfigStep: warningUnConfigStep, txStepCode: txStepCode, candrawalQuota: canTxSteps[index] }
        }
        else if (index == 0)
            warningUnConfigStep = txStepCode
    }
    return { warningUnConfigStep: warningUnConfigStep, candrawalQuota: 0 }
}
// (async () => {
//     try {
//         await bingfatixian();
//     } catch (e) {
//         // Deal with the fact the chain failed
//     }
// })();

// prettier-ignore
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }