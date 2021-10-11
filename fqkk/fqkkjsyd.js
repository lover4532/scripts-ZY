/*

#仅支持圈x


#使用说明：
阅读一篇文章(最好阅读两篇,自己取舍)，返回后立即关闭页面


[task_local]
#番茄看看
30 9-22 * * * fqkkjsyd.js, tag=番茄看看,


[rewrite_local]
#番茄看看
^http://m.*./fast_reada/do_read?/* url script-request-header fqkkjsyd.js


boxjs: https://ghproxy.com/https://raw.githubusercontent.com/zzsnn/Scripts/master/Task/sunert.boxjscopy.json


[MITM]
hostname = m.*.top


*/


const $ = new Env('番茄看看阅读');
let status;
status = (status = ($.getval("fqkkstatus") || "1") ) > 1 ? `${status}` : ""; // 账号扩展字符
const fqkkurlArr = [], fqkkhdArr = [],fqkkcount = ''
let fqkkurl = $.getdata('fqkkurl')
let fqkkhd = $.getdata('fqkkhd')


!(async () => {
  if (typeof $request !== "undefined") {
       await fqkkck()
} 
 else {fqkkurlArr.push($.getdata('fqkkurl'))
    fqkkhdArr.push($.getdata('fqkkhd'))
    let fqkkcount = ($.getval('fqkkcount') || '1');
  for (let i = 2; i <= fqkkcount; i++) {
    fqkkurlArr.push($.getdata(`fqkkurl${i}`))
    fqkkhdArr.push($.getdata(`fqkkhd${i}`))
  }console.log(
            `\n\n=============================================== 脚本执行 - 北京时间(UTC+8)：${new Date(
                new Date().getTime() +
                new Date().getTimezoneOffset() * 60 * 1000 +
                8 * 60 * 60 * 1000
            ).toLocaleString()} ===============================================\n`);
    console.log(`------------- 共${fqkkhdArr.length}个账号-------------\n`)

      for (let i = 0; i < fqkkhdArr.length; i++) {
        if (fqkkhdArr[i]) {
         
          fqkkurl = fqkkurlArr[i];
          fqkkhd = fqkkhdArr[i];
          $.index = i + 1;
          console.log(`\n开始【番茄看看阅读${$.index}】`)
          await fqkkxx();

          //await showmsg();
          

  }
}}

})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())




//数据获取
function fqkkck() {
   if ($request.url.indexOf("fast_reada/do_read?for=&zs=&pageshow") > -1) {

  const fqkkurl = $request.url
  if(fqkkurl)     $.setdata(fqkkurl,`fqkkurl${status}`)
    $.log(fqkkurl)

  const fqkkhd = JSON.stringify($request.headers)
        if(fqkkhd)    $.setdata(fqkkhd,`fqkkhd${status}`)
$.log(fqkkhd)

  //const fqkkbody = $request.body
        //if(fqkkbody)//$.setdata(fqkkbody,`fqkkbody${status}`)
//$.log(fqkkbody)

   $.msg($.name,"",'番茄看看阅读'+`${status}` +'数据获取成功！')
  }
}




//账户信息
function fqkkxx(timeout = 0) {
  return new Promise((resolve) => {
id = fqkkurl.match(/http:\/\/(.*?)\//)[1]

let url = {
        url : `http://${id}/reada/finishTask`,
        headers : JSON.parse(fqkkhd),
        body : `readLastKey=`
}
      $.post(url, async (error, response, data) => {

        try {
    const result = JSON.parse(data)

        if(result.code== 800){
              console.log(`\n🌝账号信息\n今日已阅读: ` + result.data.infoView.num +`\n今日金币:` + result.data.infoView.score +`\n待阅读次数:` + result.data.infoView.rest +`\n阅读状态:` + result.data.infoView.msg)

        if(result.data.infoView.num <= 1){
              $.msg(`${$.name}: 账号${$.index}`, '', `今日手动阅读小于二次,跳过该账号。`)
}

     status=result.data.infoView.status
              if(status==4){
                  $.msg(`${$.name}: 账号${$.index}`, '', `🚫【阅读状态】: ${result.data.infoView.msg}`)
              }
              if(status==3){
                  await fqkkyd()
              }
              if(status==2){
                  $.msg(`${$.name}: 账号${$.index}`, '', `🚫【阅读状态】: ${result.data.infoView.msg}`)
              }
              
              if(status==1){
                  if(data.indexOf('下一批')>-1){
                  $.msg(`${$.name}: 账号${$.index}`, '', `🚫【阅读状态】: ${result.data.infoView.msg}`)
                  }else{
                    await fqkkyd()
                  }
                  
              //}

} //else {
//await $.wait(1000);
 //await fqkkyd();

//}
        
} else {
       console.log(`【${$.index}获取信息失败】: ${result.msg}`)

}
   
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    },timeout)
  })
}


//阅读信息请求
function fqkkyd() {
  return new Promise((resolve) => {
id = fqkkurl.match(/http:\/\/(.*?)\//)[1]

let url = {
        url : `http://${id}/fast_reada/do_read?for=&zs=&pageshow&r=`,
        headers : JSON.parse(fqkkhd),
        body : ``,
}
      $.get(url, async (error, response, data) => {

        try {
    const result = JSON.parse(data)

         if(result){
              console.log('\n【获取任务成功】\n🌝【获取jkey】: ' + result.jkey + '\n🌝【获取任务链接】: ' + result.url + `\n` + `\n🌝【账号${$.index}】等待6秒后提交开始阅读`)
              await $.wait(6000);

         if (result.url == '/fast_reada') {
              $.msg(`${$.name}: 账号${$.index}`, '', `🚫已达到阅读限制，请下小时再来`)
}
  else {
    //await $.wait(7000);
    await fqkktj();

}
        
} else {
       console.log(`🚫【${$.index}任务获取失败】: ${result.msg}`)

       //console.log('\n番茄看看任务获取失败  '+result.msg)
}
   
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    })
  })
}



//阅读任务提交
function fqkktj() {
  return new Promise((resolve) => {

let url = {
        url : fqkkurl,

        headers : JSON.parse(fqkkhd),
       
}
      $.get(url, async (error, response, data) => {

       try {
        const result = JSON.parse(data)

        if(result){

        console.log('\n【提交任务】: ' + result.url + '\n【获得奖励】: ' + result.success_msg + `\n🌝【账号${$.index}】等待3秒后提交本次阅读领取奖励`)

        if (result.url == '/fast_reada') {
              await fqkkxx()
}

else {
        await $.wait(3000);
        await fqkktj();
}

} else {
       console.log(`【${$.index}提交失败】: ${result.msg}`)
}
   
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    })
  })
}

function showmsg() {

     $.msg($.name,$.index,$.desc)

}


function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
