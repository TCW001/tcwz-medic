vRPC = Tunnel.getInterface("vRP")
vRP = Proxy.getInterface("vRP")
-----------------------------------------------------------------------------------------------------------------------------------------
-- CONNECTION
-----------------------------------------------------------------------------------------------------------------------------------------
cRP = {}
Tunnel.bindInterface("tc_medic",cRP)
vCLIENT = Tunnel.getInterface("tc_medic")
-----------------------------------------------------------------------------------------------------------------------------------------
-- COMANDO PARA ABRIR PAINEL (envia alguns dados do Player para a NUI)
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterCommand("laudos", function (source)
    local user_id = vRP.getUserId(source)
    local identity = vRP.userIdentity(user_id)
    
    if user_id then
        TriggerClientEvent("laudos:sendPlayerData", source, user_id, identity)

        if vRP.hasGroup(user_id, "Paramedic") then
            TriggerClientEvent("laudos:openPanel", source, "Paramedic")
            getLaudos(user_id)
        elseif vRP.hasGroup(user_id, "Police") then
            TriggerClientEvent("laudos:openPanel", source, "Police")
        else
            TriggerClientEvent("laudos:openPanel", source, false)
        end
    end
end)
-----------------------------------------------------------------------------------------------------------------------------------------
-- CHECAR DADOS DA EMISSÃO DE LAUDO + SAVE SQL
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterNetEvent('laudo:receiveDataServer')
AddEventHandler('laudo:receiveDataServer', function(dados)
    local user_id = vRP.getUserId(source)
    local idRegistro = gerarIDUnico()

    -- Imprimir os dados recebidos + ID do registro
    print("========== NOVO REGISTRO ==========")
    print("ID do Registro: " .. idRegistro)
    print("Tipo de Exame: " .. dados.tipoExame)
    print("Nome: " .. dados.nome)
    print("Sobrenome: " .. dados.sobrenome)
    print("Idade: " .. dados.idade)
    print("RG: " .. dados.rg)
    print("Contato: " .. dados.contato)
    print("Profissão: " .. dados.profissao)
    print("Avaliação: " .. dados.avaliacao)
    print("Resultado: " .. dados.resultado)
    print("Data: " .. dados.data)
    print("CCM: " .. dados.ccm)

    if checkUserSource(dados.rg,dados.nome,dados.sobrenome,dados.contato) then
        TriggerClientEvent("laudo:sendCheckData", user_id, "correto")
        -- Inserir no banco de dados
        exports.oxmysql:execute([[
            INSERT INTO tcwz_medic (
                user_id, register_id, medic_id, type, name, name2, age, contact, job, date, desc_result, result
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        ]], {
            dados.rg,
            idRegistro,
            user_id,
            dados.tipoExame,
            dados.nome,
            dados.sobrenome,
            dados.idade,
            dados.contato,
            dados.profissao,
            dados.data,
            dados.avaliacao,
            dados.resultado
        }, function(affectedRows)
            print("Registro inserido com sucesso. Linhas afetadas:", affectedRows)
        end)
    else
        TriggerClientEvent("laudo:sendCheckData", user_id, "incorreto")
    end
end)
-----------------------------------------------------------------------------------------------------------------------------------------
-- APROVAÇÃO/REPROVAÇÃO DO LAUDO
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterServerEvent("laudo:aprovarLaudo")
AddEventHandler("laudo:aprovarLaudo", function(register_id)
    exports.oxmysql:execute("UPDATE tcwz_medic SET status = 'Aprovado' WHERE register_id = @register_id", {
        ['@register_id'] = register_id
    })
end)

RegisterServerEvent("laudo:recusarLaudo")
AddEventHandler("laudo:recusarLaudo", function(register_id)
    exports.oxmysql:execute("DELETE FROM tcwz_medic WHERE register_id = @register_id", {
        ['@register_id'] = register_id
    })
end)
-----------------------------------------------------------------------------------------------------------------------------------------
-- PEGAR DADOS DO SQL PARA ENVIAR PARA LAUDO EM ANALISE
-----------------------------------------------------------------------------------------------------------------------------------------
function getLaudos(target_id)
    local sourceP = vRP.userSource(target_id)
    exports.oxmysql:execute("SELECT * FROM tcwz_medic WHERE status = 'Em Analise'", {}, function(result)
        if result and #result > 0 then
            TriggerClientEvent("laudo:receiveAllPending", sourceP, result)
        else
            TriggerClientEvent("laudo:receiveAllPending", sourceP, {})
        end
    end)

    exports.oxmysql:execute("SELECT * FROM tcwz_medic WHERE status = 'Aprovado' AND user_id = @user_id", {
        ['@user_id'] = target_id
    }, function(result)
        if result and #result > 0 then
            TriggerClientEvent("laudo:receiveMyLaudos", sourceP, result)
        else
            TriggerClientEvent("laudo:receiveMyLaudos", sourceP, {})
        end
    end)
end
-----------------------------------------------------------------------------------------------------------------------------------------
-- CHECAR ID 
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterServerEvent("tcwz:buscarPassaporteServer")
AddEventHandler("tcwz:buscarPassaporteServer", function(user_id)
    local source = source
    exports.oxmysql:execute('SELECT * FROM tcwz_medic WHERE user_id = @user_id AND status = "Aprovado"', {
        ['@user_id'] = user_id
    }, function(result)

        TriggerClientEvent("tcwz:renderPassaporte", source, result)
    end)
end)
-----------------------------------------------------------------------------------------------------------------------------------------
-- CHECAR DADOS RECEBIDOS (tenho que ter certeza que alguns dados estão corretos antes de enviar para o SQL)
-----------------------------------------------------------------------------------------------------------------------------------------
function checkUserSource(target_id, name, name2, phone)
    local checkUser = vRP.userSource(target_id)
    local identityUser = vRP.userIdentity(target_id)

    if checkUser and identityUser then
        if identityUser["name"] == name and identityUser["name2"] == name2 and identityUser["phone"] == phone then
            print(target_id, name, name2, phone)
            return true
        else
            print("informações incorretas")
            return false
        end
    else
        print("Usuário não encontrado ou identidade inválida")
        return false
    end
end
-----------------------------------------------------------------------------------------------------------------------------------------
-- GERAR ID DE REGISTRO (tenho que ter certeza que aquele laudo é aquele laudo)
-----------------------------------------------------------------------------------------------------------------------------------------
local registrosUsados = {} -- Tabela temporária pra simular banco e evitar duplicações

-- Função para gerar um ID único no formato xxx-xxx
function gerarIDUnico()
    local caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    local function gerarParte()
        local parte = ''
        for i = 1, 3 do
            local index = math.random(1, #caracteres)
            parte = parte .. caracteres:sub(index, index)
        end
        return parte
    end

    local id
    repeat
        id = gerarParte() .. '-' .. gerarParte()
    until not registrosUsados[id]

    registrosUsados[id] = true
    return id
end