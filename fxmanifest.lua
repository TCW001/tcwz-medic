fx_version 'cerulean'
game 'gta5'

ui_page 'web-side/index1.html'

shared_scripts {
	"@vrp/lib/utils.lua",
	"@vrp/lib/Tunnel.lua",
	"@vrp/lib/Proxy.lua",
}

server_scripts {
    "@vrp/lib/utils.lua",
    'server-side/server1.lua'
}

client_scripts {
    "@vrp/lib/utils.lua",
    'client-side/client1.lua'
}

files {
    'web-side/index1.html',
    'web-side/style1.css',
    'web-side/uiHandler.js',
    'web-side/clientCOMM.js',
    'web-side/images/*.png',
    'web-side/images/*.svg'
}