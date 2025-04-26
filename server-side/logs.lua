function enviarLogLaudo(status, register_id, tipo, id, target_id)
    local webhookURL = "https://discord.com/api/webhooks/1364976209947005021/2gIaGB3eDO_LdemBwYSorlr2WbM4TvHbuBURFjQFI4i0WdBhRWoGNI5cnHW2PVjRcLJZ"

    local mensagem = string.format(
        "**%s**\n```RE\n[AUTOR ID]: %s\n[LAUDO ID]: %s\n[REGISTRO ID]: %s\n[LAUDO TIPO]: %s\n```", -- deixar mensagem BONITN kk
        status,
        tostring(id),
        tostring(target_id),
        tostring(register_id),
        tostring(tipo)
    )

    PerformHttpRequest(webhookURL, function(err, text, headers)
        if err ~= 200 and err ~= 204 then return end-- resumindo se der erro retorna
        
    end, "POST", json.encode({
        username = "TCWz FiveM | tcwz-medic",
        content = mensagem
    }), {
        ["Content-Type"] = "application/json"
    })
end