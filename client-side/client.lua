vRP = Proxy.getInterface("vRP")
-----------------------------------------------------------------------------------------------------------------------------------------
-- CONNECTION
-----------------------------------------------------------------------------------------------------------------------------------------
cRP = {}
Tunnel.bindInterface("tc_medic",cRP)
vSERVER = Tunnel.getInterface("tc_medic")
-----------------------------------------------------------------------------------------------------------------------------------------
-- ABRIR/FECHAR PAINEL
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterNetEvent("laudos:openPanel")
AddEventHandler("laudos:openPanel", function(permiss)
    local ped = PlayerPedId()
    SetNuiFocus(true, true)
    SendNuiMessage(json.encode({ action = "open", permiss = permiss }))
end)

RegisterNUICallback("closePanel", function(data, cb)
    SetNuiFocus(false, false)
    cb("ok")
end)
-----------------------------------------------------------------------------------------------------------------------------------------
-- ENVIAR DADOS DO PLAYER PARA A NUI
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterNetEvent("laudos:sendPlayerData")
AddEventHandler("laudos:sendPlayerData", function(user_id, identity)
    SendNuiMessage(json.encode({ 
        action = "updateTable", 
        id = user_id, 
        name = identity["name"], 
        lastName = identity["name2"]
    }))
end)
-----------------------------------------------------------------------------------------------------------------------------------------
-- CHECAR OS DADOS DA EMISSÃO DO LAUDO
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterNUICallback("laudo:sendDataServer", function(data, cb)
    local dados = data.dados

    TriggerServerEvent('laudo:receiveDataServer', dados)
    cb({ status = "ok" })
end)
-----------------------------------------------------------------------------------------------------------------------------------------
-- CHECAR OS DADOS DA EMISSÃO DO LAUDO
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterNetEvent("laudo:sendCheckData")
AddEventHandler("laudo:sendCheckData", function(checkData) 
    print(checkData)
    SendNuiMessage(json.encode({
        checkDataNUI = checkData
    }))
end)
-----------------------------------------------------------------------------------------------------------------------------------------
-- ENVIO DOS LAUDOS EM ANALISE PARA A NUI
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterNetEvent("laudo:receiveAllPending")
AddEventHandler("laudo:receiveAllPending", function(result)
    SendNUIMessage({
        action = "renderLaudos",
        result = result,
        permiss = "Paramedic"
    })
end)
-----------------------------------------------------------------------------------------------------------------------------------------
-- APROVAR E RECUSAR LAUDO ENVIAR PARA SERVER
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterNUICallback("aprovarLaudo", function(data, cb)
    local register_id = data.register_id
    print(register_id)
    TriggerServerEvent("laudo:aprovarLaudo", register_id)
    cb({})
end)

RegisterNUICallback("recusarLaudo", function(data, cb)
    local register_id = data.register_id
    TriggerServerEvent("laudo:recusarLaudo", register_id)
    cb({})
end)

RegisterNetEvent("laudo:receiveMyLaudos")
AddEventHandler("laudo:receiveMyLaudos", function(result)
    SendNUIMessage({
        action = "renderMyLaudos",
        result2 = result,
        permiss = "Paramedic"
    })
end)

RegisterNUICallback("buscarPorPassaporte", function(data, cb)
    local user_id = tonumber(data.user_id)
    TriggerServerEvent("tcwz:buscarPassaporteServer", user_id)
    cb("ok")
end)

RegisterNetEvent("tcwz:renderPassaporte")
AddEventHandler("tcwz:renderPassaporte", function(result)
    SendNUIMessage({
        action = "renderPassaporte",
        result3 = result
    })
end)
