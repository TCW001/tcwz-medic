---------------------------------------------------------------------
-- FRAMEWORK
---------------------------------------------------------------------
local vRP = Proxy.getInterface("vRP")
local cRP = {}
---------------------------------------------------------------------
-- CONEXÃO
---------------------------------------------------------------------
Tunnel.bindInterface("tc_medic", cRP)
local vSERVER = Tunnel.getInterface("tc_medic")
---------------------------------------------------------------------
-- ABRIR / FECHAR PAINEL
---------------------------------------------------------------------
RegisterNetEvent("tcwz_medic:openSystem")
AddEventHandler("tcwz_medic:openSystem", function(user_id, identity, permission)
    local ped = PlayerPedId()
    if not IsPedInAnyVehicle(ped) and GetEntityHealth(ped) > 0 then
        vRP.removeObjects()
        vRP.createObjects("amb@code_human_in_bus_passenger_idles@female@tablet@base", "base", "prop_cs_tablet", 50, 28422)
        SetNuiFocus(true, true)
        SendNUIMessage({
            action = "openPanel",
            id = user_id,
            name = identity["name"],
            name2 = identity["name2"],
            phone = identity["phone"],
            permission = permission or false
        })
        print(permission)
    end
end)

RegisterNUICallback("tcwz_medic:closeSystem", function(_, cb)
    SetNuiFocus(false, false)
    vRP.removeObjects()
    cb("ok")
end)
---------------------------------------------------------------------
-- LAUDOS
---------------------------------------------------------------------
RegisterNetEvent("tcwz_medic:sendLaudosAprovados")
AddEventHandler("tcwz_medic:sendLaudosAprovados", function(myLaudos)
    SendNUIMessage({ action = "receiveLaudosAprovados", myLaudos = myLaudos })
end)

RegisterNetEvent("tcwz_medic:sendLaudosAnalise")
AddEventHandler("tcwz_medic:sendLaudosAnalise", function(analiseLaudos)
    SendNUIMessage({ action = "receiveLaudosAnalise", analiseLaudos = analiseLaudos })
end)

RegisterNUICallback("tcwz_medic:aprovarLaudo", function(data, cb)
    TriggerServerEvent("tcwz_medic:aprovarLaudoSQL", data)
    cb("ok")
end)

RegisterNUICallback("tcwz_medic:revogarLaudo", function(data, cb)
    print(data.laudo.register_id, data.laudo.user_id)
    TriggerServerEvent("tcwz_medic:revogarLaudoSQL", data)
    cb("ok")
end)
---------------------------------------------------------------------
-- CONSULTA
---------------------------------------------------------------------
RegisterNUICallback("tcwz_medic:submitConsulta", function(data, cb)
    TriggerServerEvent("tcwz_medic:sendConsultaToServer", data)
    cb("ok")
end)

RegisterNetEvent("tcwz_medic:receiveConsultaPedido")
AddEventHandler("tcwz_medic:receiveConsultaPedido", function(consultaInfo)
    SendNUIMessage({ action = "newConsulta", consultaInfo = consultaInfo })
end)

RegisterNUICallback("tcwz_medic:statusConsulta", function(data, cb)
    TriggerServerEvent("tcwz_medic:sendToClientConsultaStatus", data)
    cb("ok")
end)

RegisterNetEvent("tcwz_medic:sendStatusConsulta")
AddEventHandler("tcwz_medic:sendStatusConsulta", function(status, tipo, date)
    SendNUIMessage({ action = "statusConsulta", status = status, tipo = tipo, date = date })
end)
---------------------------------------------------------------------
-- LAUDO: ENVIAR PARA CHECAR
---------------------------------------------------------------------
RegisterNUICallback("tcwz_medic:enviarLaudo", function(data, cb)
    if data.tipo == "psicotecnico" or data.tipo == "autorizacao" then
        TriggerServerEvent("tcwz_medic:checkLaudo", data)
    end
    cb("ok")
end)

RegisterNetEvent("tcwz_medic:checkDataLaudo")
AddEventHandler("tcwz_medic:checkDataLaudo", function(laudoData)
    SendNUIMessage({ laudoData = laudoData })
end)
---------------------------------------------------------------------
-- CHECAR LAUDOS DE OUTRO ID
---------------------------------------------------------------------
RegisterNUICallback("tcwz_medic:checkID", function(id, cb)
    TriggerServerEvent("tcwz_medic:checkIDserver", id)
    cb("ok")
end)

RegisterNetEvent("tcwz_medic:sendCheckID")
AddEventHandler("tcwz_medic:sendCheckID", function(id, identity, laudos)
    SendNUIMessage({ action = "resultCheckID", id = id, identity = identity, laudos = laudos })
end)
---------------------------------------------------------------------
-- ENVIAR O TESTE PARA ID CORRETO
---------------------------------------------------------------------
RegisterNUICallback("tcwz_medic:sendTestID", function(target_id, cb)
    TriggerServerEvent("tcwz_medic:sendTestIDServer", target_id)
    cb("ok")
end)

RegisterNetEvent("tcwz_medic:sendTestPSI")
AddEventHandler("tcwz_medic:sendTestPSI", function(medic_id, medic_identity)
    SendNUIMessage({ action = "testePSI", id = medic_id, medic_identity = medic_identity })
end)
-- RECEBER O TESTE QUE O PACIENTE FEZ E ENVIAR PARA O MEDICO!
RegisterNUICallback("tcwz_medic:sendTestMedic", function(data, cb)
    print("ID do médico:", data.id)
    
    print("Respostas:")
    for i, resposta in ipairs(data.responses) do
        print(i, resposta)
    end
    TriggerServerEvent("tcwz_medic:sendTestServer", data.id, data.responses)
    cb("ok")
end)

RegisterNetEvent("tcwz_medic:sendTestMedic")
AddEventHandler("tcwz_medic:sendTestMedic", function(test_id, test_identity, responses)
    SendNUIMessage({ action = "testeToMedic", id = test_id, test_identity =  test_identity, responses = responses })
end)