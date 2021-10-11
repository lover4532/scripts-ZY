## 小米运动
## 环境变量说明
## MI_USER: 账号      仅支持手机号，多账号用 # 分隔
## MI_PWD: 密码       多账号用 # 分隔，且与账号一一对应
## STEP: 步数         空或不填则为 18000-25000 之间随机，自定义示例: 18763 或 19000-24000
## PMODE: 推送模式 || PKEY: 具体推送格式填写（不带 [TG: ]，请用具体的值代替)
## wx                [Server 酱: skey]
## nwx               [新 Server 酱: skey]
## tg                [TG: tg_bot_token@user_id]
## qwx               [企业微信: touser,corpid,corpsecret,agentid 其中 touser 可填 @all，agenid 不填默认为 1000002]
## pp                [PushPlus: push_plus_token]
## off               [关闭推送]

export MI_USER="账号"
export MI_PWD="密码"
export STEP="10000-16000"
export PMODE="qwx"
export PKEY="touser,corpid,corpsecret,agentid"