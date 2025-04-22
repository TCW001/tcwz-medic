---------------------------------------------------------------------
-- FRAMEWORK
---------------------------------------------------------------------
vRPC = Tunnel.getInterface("vRP")
vRP = Proxy.getInterface("vRP")
---------------------------------------------------------------------
-- CONEXAO
---------------------------------------------------------------------
cRP = {}
Tunnel.bindInterface("tc_medic", cRP)
vCLIENT = Tunnel.getInterface("tc_medic")
-- Sources com permissão de painel (medico e diretor) apos restart RESETA!
local service = {}
local function contains(tbl, val)
    for _, v in pairs(tbl) do
        if v == val then return true end
    end
    return false
end
---------------------------------------------------------------------
-- ABRIR PAINEL
---------------------------------------------------------------------
RegisterCommand("cuspainel", function(source)
    local user_id = vRP.getUserId(source)
    local identity = vRP.userIdentity(user_id)
    if not user_id then return end

    local role = false
    if vRP.hasGroup(user_id, "Hospital") then
        if vRP.hasGroup(user_id, "Diretor") then
            print("ID:", user_id, "Diretor")
            role = "Diretor"
        elseif vRP.hasGroup(user_id, "Medico") then
            print("ID:", user_id, "Medico")
            role = "Medico"
        end
    elseif vRP.hasGroup(user_id, "Police") then
        print("ID:", user_id, "Policia")
        role = "Policia"
    else 
        print("ID:", user_id, "Cidadão")
        role = false
    end

    if role == "Medico" or role == "Diretor" then
        if not contains(service, source) then table.insert(service, source) end
    else
        for i, s in ipairs(service) do
            if s == source then
                table.remove(service, i)
                print("[REMOVIDO] ID", user_id, "removido da lista de serviço.")
                break
            end
        end
    end

    TriggerClientEvent("tcwz_medic:openSystem", source, user_id, identity, role)
    getLaudos(user_id)
end)
---------------------------------------------------------------------
-- SOLICITAR CONSULTA
---------------------------------------------------------------------
RegisterServerEvent("tcwz_medic:sendConsultaToServer")
AddEventHandler("tcwz_medic:sendConsultaToServer", function(data)
    local src = source
    local user_id = vRP.getUserId(src)
    local identity = vRP.userIdentity(user_id)
    if not user_id then return end

    local consultaInfo = {
        user_id = user_id,
        name = identity.name,
        name2 = identity.name2,
        phone = identity.phone,
        type = data.type,
        date = data.date,
        time = data.time,
        desc = data.desc
    }

    for i = #service, 1, -1 do
        local target = service[i]
        local t_user = vRP.getUserId(target)

        if not t_user then
            print("[REMOVIDO] Source inválido:", target)
        elseif vRP.hasGroup(t_user, "Paramedic") or vRP.hasGroup(t_user, "Admin") then
            print("[OK] Enviando consulta para:", t_user)
            TriggerClientEvent("tcwz_medic:receiveConsultaPedido", target, consultaInfo)
        else
            print("[REMOVIDO] ID", t_user, "sem permissão.")
        end
    end
end)
---------------------------------------------------------------------
-- ENVIAR STATUS DE CONSULTA
---------------------------------------------------------------------
RegisterServerEvent("tcwz_medic:sendToClientConsultaStatus")
AddEventHandler("tcwz_medic:sendToClientConsultaStatus", function(data)
    local target_id = data.passaporte
    local target_source = vRP.userSource(target_id)
    if target_source then
        TriggerClientEvent("tcwz_medic:sendStatusConsulta", target_source, data.acao, data.tipo, data.date)
    end
end)
---------------------------------------------------------------------
-- RECEBER LAUDO
---------------------------------------------------------------------
RegisterServerEvent("tcwz_medic:checkLaudo")
AddEventHandler("tcwz_medic:checkLaudo", function(data)
    local src = source
    local user_id = vRP.getUserId(src)
    if not user_id then return end

    gerarIDUnico(function(idRegistro)
        if not idRegistro then
            print("Erro ao gerar ID único.")
            return
        end

        if checkUserSource(data.id, data.nome, data.sobrenome, data.contato) then
            local tabela, campos, valores

            if data.tipo == "psicotecnico" then
                tabela = "tcwz_medic-psicotecnico"
                campos = [[
                    user_id, register_id, medic_id, type, name, name2, age, contact, job, date, desc_result, result
                ]]
                valores = { data.id, idRegistro, user_id, data.tipo, data.nome, data.sobrenome, data.idade, data.contato, data.profissao, data.date, data.avaliacao, data.resultado }

            elseif data.tipo == "autorizacao" then
                tabela = "tcwz_medic-mascara"
                campos = [[
                    user_id, register_id, medic_id, type, name, name2, age, contact, diagnostico, caracteristicas, identificacao, parecer, date
                ]]
                valores = { data.id, idRegistro, user_id, data.tipo, data.nome, data.sobrenome, data.idade, data.contato, data.diagnostico, data.caracteristicas, data.identificacao, data.parecer, data.date }
            end

            exports.oxmysql:execute(("INSERT INTO `%s` (%s) VALUES (%s)"):format(
                tabela, campos, string.rep("?, ", #valores):sub(1, -3)
            ), valores, function(affectedRows)
                print("Registro inserido. Linhas afetadas:", affectedRows)
                TriggerClientEvent("tcwz_medic:checkDataLaudo", src, data.tipo)
            end)
        else
            print("⚠️ Dados do usuário incorretos!")
            TriggerClientEvent("tcwz_medic:checkDataLaudo", src, "incorreto")
        end
    end)
end)
---------------------------------------------------------------------
-- CHECAR ID
---------------------------------------------------------------------
RegisterServerEvent("tcwz_medic:checkIDserver")
AddEventHandler("tcwz_medic:checkIDserver", function(target_id)
    local src = source -- quem disparou (ex: médico)
    local identity = vRP.userIdentity(target_id)
    local totalLaudos, tabelas, checkCount = {}, { "tcwz_medic-mascara", "tcwz_medic-psicotecnico" }, 0

    for _, tabela in ipairs(tabelas) do
        exports.oxmysql:execute("SELECT * FROM `" .. tabela .. "` WHERE user_id = ? AND status = 'Aprovado'", { target_id }, function(result)
            for _, row in ipairs(result or {}) do
                table.insert(totalLaudos, row)
            end

            checkCount = checkCount + 1
            if checkCount == #tabelas then
                TriggerClientEvent("tcwz_medic:sendCheckID", src, target_id, identity, totalLaudos)
            end
        end)
    end
end)
---------------------------------------------------------------------
-- REVOGAR/Aprovar LAUDOS SQL
---------------------------------------------------------------------
RegisterServerEvent("tcwz_medic:revogarLaudoSQL")
AddEventHandler("tcwz_medic:revogarLaudoSQL", function(data)
    local target_id = data.laudo.user_id
    local register_id = data.laudo.register_id
    local tabelas = { "tcwz_medic-mascara", "tcwz_medic-psicotecnico" }
    print(data.laudo.register_id)
    if not register_id then return end
    for _, tabela in ipairs(tabelas) do
        exports.oxmysql:execute("DELETE FROM `" .. tabela .. "` WHERE register_id = ?", { register_id })
    end
    Citizen.Wait(1000)
    getLaudos(target_id)
end)

RegisterServerEvent("tcwz_medic:aprovarLaudoSQL")
AddEventHandler("tcwz_medic:aprovarLaudoSQL", function(data)
    local target_id = data.laudo.user_id
    local register_id = data.laudo.register_id
    local tabelas = { "tcwz_medic-mascara", "tcwz_medic-psicotecnico" }
    print(data.laudo.register_id)
    if not register_id then return end
    for _, tabela in ipairs(tabelas) do
        exports.oxmysql:execute("UPDATE `" .. tabela .. "` SET status = 'Aprovado' WHERE register_id = ?", { register_id })
    end
    Citizen.Wait(1000)
    getLaudos(target_id)
end)
---------------------------------------------------------------------
-- ENVIAR TESTE PARA ID CORRETO
---------------------------------------------------------------------
RegisterServerEvent("tcwz_medic:sendTestIDServer")
AddEventHandler("tcwz_medic:sendTestIDServer", function(target_id)
    local medic_id = vRP.getUserId(source)
    local medic_identity = vRP.userIdentity(medic_id)
    local target_src = vRP.userSource(target_id)
    local target_id = vRP.getUserId(target_src)
    if not target_id then return end

    TriggerClientEvent("tcwz_medic:sendTestPSI", target_src, medic_id, medic_identity)
end)

RegisterServerEvent("tcwz_medic:sendTestServer")
AddEventHandler("tcwz_medic:sendTestServer", function(target_id, responses)
    local test_id = vRP.getUserId(source)
    local test_identity = vRP.userIdentity(test_id)
    local target_src = vRP.userSource(target_id)
    local target_id = vRP.getUserId(target_src)
    if not test_id then return end
    
    TriggerClientEvent("tcwz_medic:sendTestMedic", target_src, test_id, test_identity, responses)
end)
---------------------------------------------------------------------
-- BUSCAR E ENVIAR LAUDOS
---------------------------------------------------------------------
function getLaudos(target_id)
    local sourceP = vRP.userSource(target_id)
    if not target_id or not sourceP then return end

    local tabelas = { "tcwz_medic-mascara", "tcwz_medic-psicotecnico" }
    local aprovados, analises = {}, {}
    local doneAprovados, doneAnalise = 0, 0

    for _, tabela in ipairs(tabelas) do
        exports.oxmysql:execute("SELECT * FROM `" .. tabela .. "` WHERE status = 'Aprovado' AND user_id = @user_id", {
            ['@user_id'] = target_id
        }, function(result)
            for _, row in ipairs(result or {}) do table.insert(aprovados, row) end
            doneAprovados = doneAprovados + 1
            if doneAprovados == #tabelas then
                TriggerClientEvent("tcwz_medic:sendLaudosAprovados", sourceP, aprovados)
            end
        end)

        exports.oxmysql:execute("SELECT * FROM `" .. tabela .. "` WHERE status = 'Em Analise'", {}, function(result)
            for _, row in ipairs(result or {}) do table.insert(analises, row) end
            doneAnalise = doneAnalise + 1
            if doneAnalise == #tabelas then
                for i = #service, 1, -1 do
                    local src = service[i]
                    local nuser_id = vRP.getUserId(src)
                    if nuser_id and vRP.hasGroup(nuser_id, "Admin") then
                        TriggerClientEvent("tcwz_medic:sendLaudosAnalise", src, analises)
                    end
                end
            end
        end)
    end
end
---------------------------------------------------------------------
-- VALIDAR IDENTIDADE
---------------------------------------------------------------------
function checkUserSource(target_id, name, name2, phone)
    local identity = vRP.userIdentity(target_id)
    return identity and identity.name == name and identity.name2 == name2 and identity.phone == phone
end
---------------------------------------------------------------------
-- GERAR ID UNICO XXX-XXX busca no SQL se ja existe um ID igual aquele, se sim entao gera outro
---------------------------------------------------------------------
function gerarIDUnico(callback)
    local caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    local tabelas = { "tcwz_medic-mascara", "tcwz_medic-psicotecnico" }  -- Tabelas para verificação

    local registrosUsados = {}  -- Para registrar IDs gerados (em memória)

    -- Função para gerar uma parte do ID (3 caracteres)
    local function gerarParte()
        local parte = ''
        for i = 1, 3 do
            local index = math.random(1, #caracteres)
            parte = parte .. caracteres:sub(index, index)
        end
        return parte
    end

    -- Função para verificar se o ID já existe nas tabelas SQL
    local function checarTodasTabelas(id, index, done)
        if index > #tabelas then
            done(true)  -- Se o ID for único em todas as tabelas, chama o callback com 'true'
            return
        end

        exports.oxmysql:scalar('SELECT register_id FROM `' .. tabelas[index] .. '` WHERE register_id = ?', { id }, function(resultado)
            if resultado then
                done(false)  -- Se o ID já existe em qualquer tabela, retorna 'false'
            else
                checarTodasTabelas(id, index + 1, done)  -- Verifica a próxima tabela
            end
        end)
    end

    -- Função para tentar gerar um ID único
    local function tentar(tentativa)
        local id = gerarParte() .. '-' .. gerarParte()  -- Formato xxx-xxx
        -- Checa se o ID gerado é único no banco de dados e em memória
        checarTodasTabelas(id, 1, function(unico)
            if unico then
                if not registrosUsados[id] then  -- Verifica se o ID é único também em memória
                    registrosUsados[id] = true  -- Marca o ID como usado
                    callback(id)  -- Se o ID for único, chama o callback com o ID gerado
                else
                    tentar(tentativa + 1)  -- Se o ID foi usado em memória, tenta novamente
                end
            elseif tentativa < 10 then
                tentar(tentativa + 1)  -- Tenta novamente se o ID não for único
            else
                print("Falha ao gerar ID após 10 tentativas") 
                callback(nil)  -- Se falhar após 10 tentativas, chama o callback com nil
            end
        end)
    end

    -- Inicia a tentativa de gerar o ID
    tentar(1)
end