fx_version 'cerulean'
game 'gta5'

ui_page 'web-side/index.html'

shared_scripts {
	"@vrp/lib/utils.lua",
	"@vrp/lib/Tunnel.lua",
	"@vrp/lib/Proxy.lua",
}

server_scripts {
    "@vrp/lib/utils.lua",
    "server-side/logs.lua",
    'server-side/server.lua'
}

client_scripts {
    "@vrp/lib/utils.lua",
    'client-side/client.lua'
}

files {
    'web-side/index.html',
    'web-side/style.css',
    'web-side/uiHandler.js',
    'web-side/clientCOMM.js',
    'web-side/images/*.png',
    'web-side/images/*.svg',
    'web-side/fonts/*.ttf'
}