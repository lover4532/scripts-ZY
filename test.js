require('dotenv').config()
var appname = process.env.APP_NAME

require(`./${appname}/${appname}.js`)