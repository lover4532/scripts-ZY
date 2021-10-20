021-10-19 --AngelEver
 软件app名称：多看点(目前只写了一部分，一天1-2元，后续会抓紧写)
脚本地址：https://raw.githubusercontent.com/AngelEver/AutoCodeRepository/main/AngelEver_Water_dkd.js
 青龙面板：
 dkdck可以进去app点“我的”，找请求下的body
 dkdheader大部分请求都有的header
 多账号@分隔
 example:
 export dkdck='params=fTDrU1pt2u2nNuvL2xxxxx%2F%0A@params=fTDrU1pt2u2nNuvL2m0xxxxxE%2BgD%2F%0A'
 export dkdheaders='eyJvcyI6Ik9uZVBsdXMixxxxx6IuWkmueci@eyJvcyI6Ik9uZVBsdXMixxxxx6IuWkmueci'
 拉脚本新增任务命令(每天一次，持续更新，时间不限)：ql raw https://raw.githubusercontent.com/AngelEver/AutoCodeRepository/main/AngelEver_Water_dkd.js
 
 v2p:
  1.暂时不支持自动抓包，需要手动抓上面的两个key，很简单！
  2.抓好存一下然后添加一下task就可以执行了。
  3.多账号@分隔
  
  脚本执行定时全都一致，一小时一次或者两小时一次

  dkdck：
  抓包的url(大多数包都有这个body) ，举个例子
  https://dkd-api.dysdk.com/video/red_countdown
  找到的body不会太长，大概长度在70-80个字符左右，如果body里面带有斜杠/，请去  http://www.jsons.cn/urlencode/  网站进行一下 UrlEncode编码

  dkdheader：
  抓包的url(大多数包都有这个header) ，举个例子
  https://dkd-api.dysdk.com/video/red_countdown，点进去请求头headerInfo的值复制出来即可，一般是ey开头