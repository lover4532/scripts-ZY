/*
 * @Author: chengquan
 * @Date: 2020-08-05 15:28:57
 * @LastEditTime: 2020-12-02 15:16:04
 * @Description: 爱奇艺每日签到和会员抽奖
 * @FilePath: \iqy_checkin\iqiyi.js
 */
const axios = require('axios');
const notify = require("./sendNotify");
/**
 * 这里的cookie需要在app端 个人中心处抓包 在url里搜authcookie
 * 不是请求头里的cookie
 * 例子：e6Um38snn9zAGBdrEkMgqWLsm3RO97pfAhwJi84ypALsm3qM0JfHGlvXm3le5***********
 * 新增消息通知 在config中配置key(server酱和bark)
 */
/**
 * @type string
 */
aqycookie = process.env.aqyCookies;
/**
 * @type string[]
 */
var cookies = aqycookie.split("@");
//移除集合中的空字符
cookies = cookies.filter(Boolean)

sign();

function sign() {
  let tasks = [];
  let platform;
  cookies.forEach(async (cookie) => {
    const headers = { Cookie: cookie };
    platform = getPlatform(cookie)
    if (!platform) { return; }
    await checkin(cookie, platform);
    await lottery(cookie);
    const res = await getTasks(cookie);
    const daily = { data: { data: { tasks: {} } }, ...res };
    tasks = [...daily.data.data.tasks.daily] || [];
    if (!tasks.length) {
      console.log("获取任务失败");
      return;
    }
    completeTasks(cookie, tasks);
    getReward(cookie, tasks);
  })
}

async function getPlatform(cookie) {
  const url = 'https://static.iqiyi.com/js/qiyiV2/20200212173428/common/common.js';
  const res = await axios.get(url, { headers: { Cookie: cookie } });
  const platform = /platform:\"(.*?)\"/.exec(res.data);
  return platform;
}

/**
 * 抽奖
 * @param {*} cookie 
 */
function lottery(cookie) {
  const url = `https://cards.iqiyi.com/views_category/3.0/vip_home?secure_p=iPhone&scrn_scale=0&dev_os=0&ouid=0&layout_v=6&psp_cki=${cookie}&page_st=suggest&app_k=8e48946f144759d86a50075555fd5862&dev_ua=iPhone8%2C2&net_sts=1&cupid_uid=0&xas=1&init_type=6&app_v=11.4.5&idfa=0&app_t=0&platform_id=0&layout_name=0&req_sn=0&api_v=0&psp_status=0&psp_uid=451953037415627&qyid=0&secure_v=0&req_times=0`;
  const headers = {
    'sign': '7fd8aadd90f4cfc99a858a4b087bcc3a',
    't': '479112291'
  };
  return axios.get(url, { headers })
    .then(res => {
      let data;
      try {
        data = JSON.stringify(res.data);
      } catch (error) {
      }
      if (data.match(/\"text\":\"\d.+?到期\"/)) {
        const end = data.match(/\"text\":\"(\d.+?到期)\"/)[1];
        console.log(end);
      }
      const promises = new Array(3).fill('').map(() => {
        return axios.get(`https://iface2.iqiyi.com/aggregate/3.0/lottery_activity?app_k=0&app_v=0&platform_id=0&dev_os=0&dev_ua=0&net_sts=0&qyid=0&psp_uid=0&psp_cki=${cookie}&psp_status=0&secure_p=0&secure_v=0&req_sn=0`);
      });
      Promise.all(promises).then(async (res) => {
        for (let i = 0; i < res.length; i++) {
          const kv = res[i].data ? res[i].data.kv : "";
          const awardName = res[i].data ? res[i].data.awardName : "";
          if (kv && kv.msg && kv.msg.indexOf("异常") !== -1) {
            var date = new Date();
            if (date.getHours() <= 10)
              await notify.sendNotify('爱奇艺', '爱奇艺抽奖cookie失效');
            return;
          }
          console.log(awardName || kv);
        }
      });
    })
}

function checkin(cookie, platform) {
  const url = `https://tc.vip.iqiyi.com/taskCenter/task/userSign?P00001=${cookie}&platform=${platform[1]}&lang=zh_CN&app_lm=cn&deviceID=pcw-pc&version=v2`;
  const headers = { Cookie: cookie };
  return axios.get(url, { headers })
    .then(res => {
      if (res.data.code == 'VIP_EXPIRED')
        console.log("用户VIP已经过期！")
      else
        console.log("今日签到成长值：" + res.data.data.todayGrowth)
    }).catch(error => console.log('caught', error))
}

/**
 * 获取日常任务
 * @param {*} cookie 
 */
function getTasks(cookie) {
  const headers = { Cookie: cookie };
  const url = "https://tc.vip.iqiyi.com/taskCenter/task/queryUserTask?P00001=" + cookie;
  return axios.get(url, { headers })
}


function completeTasks(cookie, tasks) {
  const Promises = tasks.map(task => {
    const url = `https://tc.vip.iqiyi.com/taskCenter/task/joinTask?P00001=${cookie}&taskCode=${task.taskCode}&platform=bb136ff4276771f3&lang=zh_CN`;
    return axios.get(url);
  })
  Promise.all(Promises).then(res => {
    res.forEach(r => {
      console.log(r.data);
    })
  })
}

function getReward(cookie, tasks) {
  const Promises = tasks.map(task => {
    const url = `https://tc.vip.iqiyi.com/taskCenter/task/getTaskRewards?P00001=${cookie}&taskCode=${task.taskCode}&platform=bb136ff4276771f3&lang=zh_CN`;
    return axios.get(url);
  })
  Promise.all(Promises).then(res => {
    res.forEach((r, i) => {
      console.log(tasks[i].name + ":" + tasks[i].taskReward.task_reward_growth + "成长值");
    })
  })
}