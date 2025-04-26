//---------------------------------------------------//
// VARIAVEIS GLOBAIS (PLAYER DATA)                   //
//---------------------------------------------------//
let id = "";
let nome = "";
let sobrenome = "";
let telefone = "";
let permissao = "";
let laudosAprovados = [];
let laudosAnalise = [];
let laudosTID = [];
//---------------------------------------------------//
// RECEBER MENSAGENS DO CLIENT.LUA                   //
//---------------------------------------------------//
window.addEventListener('message', function(event) {
    id = event.data.id;
    nome = event.data.name;
    sobrenome = event.data.name2;
    telefone = event.data.phone;
    console.log(permissao);
    if (event.data.action === "openPanel") {
        document.body.style.display = 'flex';
        document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
        document.getElementById('info').classList.add('active');
        const resultadoCheck = document.getElementById('resultado-check');
        if (resultadoCheck) {
            resultadoCheck.innerHTML = ''; // Limpa o conteúdo
        }

        // PERMISSAO DO PLAYER NO PAINEL
        if (id && nome && sobrenome && telefone) {
            permissao = event.data.permission;
            document.querySelectorAll('.id').forEach(el => el.innerText = id);
            document.querySelectorAll('.name').forEach(el => el.innerText = nome + " " + sobrenome);
            document.querySelectorAll('.phone').forEach(el => el.innerText = telefone);
            // Verifica se existe permissao
            if (permissao === "Medico" || permissao === "Diretor" || permissao === "Policia") {
                document.getElementById('permission').innerText = permissao;
            } else {
                document.getElementById('permission').innerText = 'Cidadão';
            }
        
            // Ajusta a exibição com base na permissão
            switch (permissao) {
                case "Diretor":
                    document.getElementById('Medic').style.display = 'flex';
                    document.getElementById('Medic2').style.display = 'flex';
                    document.getElementById('Medic3').style.display = 'flex';
                    document.getElementById('Diretor').style.display = 'flex';
                    document.getElementById('Police').style.display = 'flex';
                    break;
                case "Medico":
                    document.getElementById('Medic').style.display = 'flex';
                    document.getElementById('Medic2').style.display = 'flex';
                    document.getElementById('Medic3').style.display = 'flex';
                    document.getElementById('Police').style.display = 'flex';
                    document.getElementById('Diretor').style.display = 'none';
                    break;
                case "Policia":
                    document.getElementById('Police').style.display = 'flex';
                    document.getElementById('Medic').style.display = 'none';
                    document.getElementById('Medic2').style.display = 'none';
                    document.getElementById('Medic3').style.display = 'none';
                    document.getElementById('Diretor').style.display = 'none';
                    break;
                default:
                    // Esconde todos os elementos de permissão
                    document.getElementById('Medic').style.display = 'none';
                    document.getElementById('Medic2').style.display = 'none';
                    document.getElementById('Medic3').style.display = 'none';
                    document.getElementById('Diretor').style.display = 'none';
                    document.getElementById('Police').style.display = 'none';
            }
        }
    }
    // RECEBER LAUDOS PARA O ID CORRETO
    // Função para construir a tabela com laudos
    // Ao clicar no botão "Ver Documento", mostramos o conteúdo de 'ver-laudo'
    // Evento para o botão "Ver Documento"
    if (event.data.action === "receiveLaudosAprovados") {
        laudosAprovados = event.data.myLaudos || [];
        console.log(laudosAprovados.length);
        document.querySelectorAll('.qLaudos').forEach(el => el.innerText = laudosAprovados.length);
        document.querySelectorAll('.aLaudos').forEach(el => el.innerText = laudosAnalise.length);
    
        if (laudosAprovados.length > 0) {
            const myLaudosDiv = document.getElementById('my-laudos');
            myLaudosDiv.innerHTML = ''; // Limpa o conteúdo anterior
        
            const h2 = document.createElement('h2');
            h2.textContent = 'Meus Laudos';
        
            const h3 = document.createElement('h3');
            h3.innerHTML = `Você tem <span class="qLaudos">${laudosAprovados.length}</span> Laudos.`;
        
            myLaudosDiv.appendChild(h2);
            myLaudosDiv.appendChild(h3);
        
            const tabela = document.createElement('table');
            tabela.style.width = '100%';
            tabela.style.borderCollapse = 'collapse';
        
            const thead = document.createElement('thead');
            const cabecalho = document.createElement('tr');
        
            const th1 = document.createElement('th');
            th1.textContent = 'ID';
            const th2 = document.createElement('th');
            th2.textContent = 'Registro';
            const th3 = document.createElement('th');
            th3.textContent = 'Status';
            const th4 = document.createElement('th');
            th4.textContent = 'Tipo';
            const th5 = document.createElement('th');
            th5.textContent = 'Data de Emissão';
            const th6 = document.createElement('th');
            th6.textContent = 'Ação';
        
            cabecalho.appendChild(th1);
            cabecalho.appendChild(th2);
            cabecalho.appendChild(th3);
            cabecalho.appendChild(th4);
            cabecalho.appendChild(th5);
            cabecalho.appendChild(th6);
            thead.appendChild(cabecalho);
            tabela.appendChild(thead);
        
            const tbody = document.createElement('tbody');
        
            laudosAprovados.forEach(laudo => {
                const tr = document.createElement('tr');
                const td1 = document.createElement('td');
                td1.textContent = laudo.user_id;
                const td2 = document.createElement('td');
                td2.textContent = laudo.register_id;
                const td3 = document.createElement('td');
                td3.textContent = laudo.status;
                const td4 = document.createElement('td');
                td4.textContent = laudo.type;
                const td5 = document.createElement('td');
                td5.textContent = laudo.date;
                const td6 = document.createElement('td');
                const btnVerDocumento = document.createElement('button');
                btnVerDocumento.textContent = 'Ver Documento';
                btnVerDocumento.classList.add('btn-ver-laudo');
                btnVerDocumento.style.padding = '5px 10px';
                btnVerDocumento.style.backgroundColor = '#007BFF';
                btnVerDocumento.style.borderRadius = '5px';
                btnVerDocumento.style.fontSize = '14px';
                btnVerDocumento.addEventListener('click', function() {
                    showContent('ver-laudo', btnVerDocumento); // Passando o botão como argumento para a função
        
                    const register_id = laudo.register_id; // Pega o register_id do laudo atual
                    verLaudo(register_id); // Chama a função para exibir o laudo
                });
        
                td6.appendChild(btnVerDocumento);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);
                tr.appendChild(td6);
                tbody.appendChild(tr);
            });
        
            tabela.appendChild(tbody);
            myLaudosDiv.appendChild(tabela);
        } else {
            // Se não houver laudos, exibe uma mensagem informando
            const myLaudosDiv = document.getElementById('my-laudos');
            myLaudosDiv.innerHTML = ''; // Limpa o conteúdo anterior
            const h2 = document.createElement('h2');
            h2.textContent = 'Meus Laudos';
        
            const h3 = document.createElement('h3');
            h3.innerHTML = 'Você não tem laudos aprovados.';
        
            myLaudosDiv.appendChild(h2);
            myLaudosDiv.appendChild(h3);
        }               
    }

    if (event.data.action === "receiveLaudosAnalise") {
        laudosAnalise = event.data.analiseLaudos || [];
        console.log("laudos:", event.data.analiseLaudos.length);
        atualizarLaudosAnalise();
    }

    if (event.data.action === "newConsulta") {
        console.log("Nova consulta recebida:", event.data.consultaInfo);
    
        const div = document.createElement("div");
        div.classList.add("consulta-pedido");
    
        div.innerHTML = `
            <div class="info-row">
                <div><strong>Nome:</strong> ${event.data.consultaInfo.name + " " + event.data.consultaInfo.name2}</div>
                <div><strong>Passaporte:</strong> ${event.data.consultaInfo.user_id}</div>
                <div><strong>Telefone:</strong> ${event.data.consultaInfo.phone}</div>
            </div>
            <div class="info-row">
                <div><strong>Tipo:</strong> ${event.data.consultaInfo.type}</div>
                <div><strong>Data:</strong> ${event.data.consultaInfo.date}</div>
                <div><strong>Hora:</strong> ${event.data.consultaInfo.time}</div>
            </div>
            <strong>Descrição:</strong> <div class="descricao-box">${event.data.consultaInfo.desc}</div>
            <div class="botoes">
                <button class="btn btn-aceitar">Aceitar</button>
                <button class="btn btn-recusar">Recusar</button>
                <button class="btn btn-reagendar">Reagendar</button>
            </div>
        `;
    
        document.getElementById("p-consulta").appendChild(div);
    
        // Agora que o conteúdo foi inserido, adicionamos os eventos aos botões.
        const btnAceitar = div.querySelector(".btn-aceitar");
        const btnRecusar = div.querySelector(".btn-recusar");
        const btnReagendar = div.querySelector(".btn-reagendar");
    
        // Adicionando evento ao botão "Aceitar"
        btnAceitar.addEventListener("click", function() {
            const passaporte = event.data.consultaInfo.user_id;  // Pegando o passaporte
            const tipo = event.data.consultaInfo.type;
            const date = event.data.consultaInfo.date;
            const acao = "Aprovado";  // Ação do botão "Aceitar"
    
            // Enviar as informações para o client.lua ou server
            enviarParaClient(passaporte, acao, tipo, date);
            showNotification('success', 'Consulta Aprovada!')
        });
    
        // Adicionando evento ao botão "Recusar"
        btnRecusar.addEventListener("click", function() {
            const passaporte = event.data.consultaInfo.user_id;  // Pegando o passaporte
            const tipo = event.data.consultaInfo.type;
            const date = event.data.consultaInfo.date;
            const acao = "Recusado";  // Ação do botão "Recusar"
    
            // Enviar as informações para o client.lua ou server
            enviarParaClient(passaporte, acao, tipo, date);
            showNotification('error', 'Consulta Recusada!')
        });
    
        // Adicionando evento ao botão "Reagendar"
        btnReagendar.addEventListener("click", function() {
            const passaporte = event.data.consultaInfo.user_id;  // Pegando o passaporte
            const tipo = event.data.consultaInfo.type;
            const date = event.data.consultaInfo.date;
            const acao = "Marque outra Consulta";  // Ação do botão "Reagendar"
    
            // Enviar as informações para o client.lua ou server
            enviarParaClient(passaporte, acao, tipo, date);
            showNotification('warning', 'Consulta Reagendada!')
        });
    }

    if (event.data.laudoData === "psicotecnico") {
        showNotification('success', 'Laudo enviado para análise.');
        document.querySelector(".paciente-nome").value = "";
        document.querySelector(".paciente-sobrenome").value = "";
        document.querySelector(".paciente-id").value = "";
        document.querySelector(".paciente-contato").value = "";
        document.getElementById("idade").value = "";
        document.getElementById("profissao").value = "";
        document.getElementById("avaliacao").value = "";
        document.getElementById("resultado").value = "";
        document.querySelector(".date").value = "";
        document.querySelector(".assinaturam").value = "";
    } else if(event.data.laudoData === "autorizacao") {
        showNotification('success', 'Laudo enviado para análise.');
        document.querySelector(".paciente-nome").value = "";
        document.querySelector(".paciente-sobrenome").value = "";
        document.querySelector(".paciente-id").value = "";
        document.querySelector(".paciente-contato").value = "";
        document.getElementById("aut-idade").value = "";
        document.getElementById("aut-diagnostico").value = "";
        document.getElementById("aut-caracteristicas").value = "";
        document.getElementById("aut-identificacao").value = "";
        document.getElementById("aut-parecer").value = "";
        document.querySelector(".date").value = "";
        document.querySelector(".assinaturam").value = "";
    } else if(event.data.laudoData === "psicologico") {
        showNotification('success', 'Laudo enviado para análise.');
        document.querySelector(".paciente-nome").value = "";
        document.querySelector(".paciente-sobrenome").value = "";
        document.querySelector(".paciente-id").value = "";
        document.querySelector(".paciente-contato").value = "";
        document.getElementById("psi-idade").value = "";
        document.getElementById("psi-hist_clinico").value = "";
        document.getElementById("psi-avaliacao").value = "";
        document.getElementById("psi-recom_tratamento").value = "";
        document.getElementById("psi-parecer").value = "";
        document.querySelector(".date").value = "";
        document.querySelector(".assinaturam").value = "";
    } else if (event.data.laudoData === "incorreto") {
        showNotification('warning', 'Algumas informações estão incorretas.');
        document.querySelector(".paciente-nome").value = "";
        document.querySelector(".paciente-sobrenome").value = "";
        document.querySelector(".paciente-id").value = "";
        document.querySelector(".paciente-contato").value = "";
    }

    if (event.data.action === "resultCheckID") {
        laudosTID = event.data.laudos || [];
        console.log("check id", laudosTID);
        const resultDiv = document.getElementById('resultado-check');
        resultDiv.innerHTML = ''; // Limpa o conteúdo anterior
    
        // Caso não haja identidade no passaporte
        if (!event.data.identity || event.data.identity.length === 0) {
            resultDiv.appendChild(criarElemento('p', 'Este passaporte não Existe.'));
            showNotification('error', 'Passaporte inválido.');
            return;
        }
    
        // Cria e exibe informações básicas (nome, passaporte, telefone)
        const info = document.createElement("div");
        info.innerHTML = `
            <h2>Resultado da Busca</h2>
            <h3>Nome: <span>${event.data.identity?.name || "Desconhecido"} ${event.data.identity?.name2 || ""}</span></h3>
            <h3>Passaporte: <span>${event.data.id || "N/A"}</span></h3>
            <h3>Telefone: <span>${event.data.identity?.phone || "N/A"}</span></h3>
        `;
        resultDiv.appendChild(info);
    
        // Se não houver laudos, exibe mensagem de erro e para a execução
        if (laudosTID.length === 0) {
            resultDiv.appendChild(criarElemento('p', 'Este Passaporte não contém Laudos.'));
            showNotification('info', 'Este Passaporte não contém Laudos.');
            return;
        }
    
        // Notificação de sucesso
        showNotification('success', 'Busca realizada.');
    
        // Criação da tabela
        const tabela = document.createElement("table");
        tabela.style.width = "100%";
        tabela.style.marginTop = "15px";
    
        const thead = tabela.createTHead();
        const row = thead.insertRow();
        const headers = ["ID", "Registro", "Status", "Tipo", "Data", "Documento"];
        if (permissao === "Diretor") headers.push("Ação");
    
        headers.forEach(texto => {
            const th = document.createElement("th");
            th.textContent = texto;
            row.appendChild(th);
        });
    
        const tbody = tabela.createTBody();
        laudosTID.forEach(laudo => {
            const tr = tbody.insertRow();
    
            // Popula a linha com os dados do laudo
            ["user_id", "register_id", "status", "type", "date"].forEach(field => {
                tr.insertCell().textContent = laudo[field];
                console.log(laudo.type);
            });
    
            // Coluna "Documento"
            const tdDocumento = tr.insertCell();
            const btnVerDocumento = criarBotao('Ver Documento', '#007BFF', () => {
                showContent('ver-laudo', btnVerDocumento);
                verLaudo(laudo.register_id);
            });
            tdDocumento.appendChild(btnVerDocumento);
    
            // Ação de revogar (apenas se for Diretor)
            if (permissao === "Diretor") {
                const tdAcao = tr.insertCell();
                const btnRevogar = criarBotao('Revogar Laudo', '#dc3545', () => {
                    fetch(`https://${GetParentResourceName()}/tcwz_medic:revogarLaudo`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            laudo: {
                                register_id: laudo.register_id,
                                user_id: laudo.user_id,
                                type: laudo.type
                            }
                        })
                    }).then(() => {
                        showNotification('error', 'Laudo Revogado.');
                        tr.remove();
                    }).catch(err => console.error("Erro ao revogar laudo:", err));
                });
                tdAcao.appendChild(btnRevogar);
            }
    
            // Adiciona a linha à tabela
            tbody.appendChild(tr);
        });
    
        resultDiv.appendChild(tabela);
    }          

    if (event.data.action === "statusConsulta") {
        console.log(event.data.status);
        console.log(event.data.tipo);
        console.log(event.data.date);
        const msConsultaDiv = document.getElementById('ms-consulta');
    
        let tabela = msConsultaDiv.querySelector("table");
        let tbody;
    
        // Se a tabela ainda não existe, criamos ela
        if (!tabela) {
            const h2 = document.createElement("h2");
            h2.textContent = "Minhas Solicitações de Consulta";
            msConsultaDiv.appendChild(h2);
    
            tabela = document.createElement("table");
            tabela.style.width = "100%";
            tabela.style.marginTop = "15px";
            tabela.style.borderCollapse = "collapse";
    
            const thead = tabela.createTHead();
            const row = thead.insertRow();
            ["Status", "Tipo", "Data"].forEach(titulo => {
                const th = document.createElement("th");
                th.textContent = titulo;
                row.appendChild(th);
            });
    
            tbody = tabela.createTBody(); // Criamos o corpo da tabela
            tabela.appendChild(tbody);
            msConsultaDiv.appendChild(tabela);
        } else {
            // Se a tabela já existe, só pegamos o tbody
            tbody = tabela.querySelector("tbody");
        }
    
        // Adiciona a nova linha
        const tr = tbody.insertRow();
        tr.insertCell().textContent = event.data.status;
        tr.insertCell().textContent = event.data.tipo;
        tr.insertCell().textContent = event.data.date;
    }

    if (event.data.action === "testePSI") {
        const id = event.data.id;
        document.getElementById('t-Teste').style.display = 'flex';
        document.querySelector('#t-Teste .id').innerHTML = id;

        const medic_identity = event.data.medic_identity;
        document.querySelector('#my-test .medic-name').innerHTML = medic_identity?.name + " " + medic_identity?.name2;
        document.querySelector('#my-test .medic-id').innerHTML = event.data.id;
        document.querySelector('#my-test .medic-phone').innerHTML = medic_identity?.phone;
    }

    if (event.data.action === "testeToMedic") {
        const container = document.getElementById("questions");
        container.style.display = "flex";
        const test_identity = event.data.test_identity;
        const test_id = event.data.id;
        console.log(test_id);
        container.innerHTML = ""; // Limpa antes
    
        // Bloco de informações do avaliado
        const infoBloco = document.createElement("div");
        infoBloco.innerHTML = `
            <h3>Informações do Avaliado</h3>
            <p><strong>Nome:</strong> ${test_identity?.name || ''} ${test_identity?.name2 || ''}</p>
            <p><strong>Passaporte:</strong> ${test_id || ''}</p>
            <p><strong>Telefone:</strong> ${test_identity?.phone || ''}</p>
            <button type="button" class="btn-apagar">Apagar</button>
        `;
        container.appendChild(infoBloco);
    
        // Bloco de perguntas/respostas com layout flex
        const perguntasContainer = document.createElement("div");
        perguntasContainer.style.display = "flex";
        perguntasContainer.style.flexWrap = "wrap";
        perguntasContainer.style.gap = "20px";
    
        for (let i = 0; i < 10; i++) {
            const resposta = event.data.responses[i];
            const bloco = document.createElement("div");
            bloco.style.width = "45%"; // para aparecer 2 por linha
            bloco.innerHTML = `
                <p><strong>Pergunta ${i + 1}:</strong><br>R: ${resposta || 'Sem resposta'}</p>
            `;
            perguntasContainer.appendChild(bloco);
        }
    
        container.appendChild(perguntasContainer);
        infoBloco.querySelector(".btn-apagar").addEventListener("click", () => {
            container.innerHTML = "";
            container.style.display = "none";
            showNotification('info', 'Você apagou o Teste.');
        });
    }

    if (event.data.action === "delPedido") {
        const div = document.querySelector('.consulta-pedido');
        console.log(event.data.action);
        if (div) {
            div.remove();
        }
    }
});
//---------------------------------------------------//
// FECHAR PAINEL                                     //
//---------------------------------------------------//
function closePanel() {
    fetch(`https://${GetParentResourceName()}/tcwz_medic:closeSystem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    }).then(resp => resp.json()).then(resp => {
        document.body.style.display = 'none';
    });
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePanel();
    }
});
//---------------------------------------------------//
// SOLICITAR CONSULTA                                //
//---------------------------------------------------//
document.querySelector("#s-consulta form").addEventListener("submit", (e) => {
    e.preventDefault();

    const form = e.target; // Pega o formulário
    const data = {
        type: document.getElementById("typeConsulta").value,
        date: document.getElementById("data").value,
        time: document.getElementById("time").value,
        desc: document.getElementById("desc").value.trim()
    };

    if (data.date && data.time && data.desc) {
        fetch(`https://${GetParentResourceName()}/tcwz_medic:submitConsulta`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        form.reset();
    } else {
        showNotification('warning', 'Preencha Todos os Campos!');
    }
})
//---------------------------------------------------//
// TYPE LAUDO                                        //
//---------------------------------------------------//
function handleLaudoChange(tipo) {
    const container = document.getElementById('laudo-container');
    container.innerHTML = '';

    const camposComuns = `
        <div class="linha">
            <label>Nome:</label>
            <div class="input-box"><input type="text" class="paciente-nome" placeholder="Nome"></div>
            <div class="input-box"><input type="text" class="paciente-sobrenome" placeholder="Sobrenome"></div>
        </div>

        <div class="linha">
            <div class="input-box">
                <label>Passaporte:</label>
                <input type="text" class="paciente-id" placeholder="Ex: 111">
            </div>
            <div class="input-box">
                <label>Contato:</label>
                <input type="text" class="paciente-contato" placeholder="xxx-xxx">
            </div>
        </div>
    `;

    const campoDataAssinatura = `
        <label for="data">Data da Avaliação:</label>
        <input type="text" id="data" class="date" placeholder="DD/MM/AAAA" maxlength="10">
        <label for="assinatura">Assinatura:</label>
        <input type="text" class="assinaturam" placeholder="Primeiro e Último Nome">
        <p class="assinatura">ASSINATURA MÉDICO(A) RESPONSÁVEL</p>
    `;

    const botoes = `
        <div class="botoes-final">
            <button class="btn-enviar" id="btn-enviar">Enviar para Análise</button>
            <button class="btn-cancelar" id="btn-cancelar">Cancelar</button>
        </div>
    `;

    let conteudoExtra = '';
    let titulo = '';

    switch (tipo) {
        case 'psicotecnico':
            titulo = 'Laudo Psicotécnico';
            conteudoExtra = `
                <div class="linha">
                    <div class="input-box"><label>Idade:</label><input type="text" id="idade"></div>
                    <div class="input-box"><label>Profissão:</label><input type="text" id="profissao"></div>
                </div>
                <label>Avaliação Psicológica:</label>
                <textarea id="avaliacao"></textarea>
                <label>Resultado:</label>
                <input type="text" id="resultado">
                <p class="assinatura">A PRESENTE AVALIAÇÃO É INTRANSFERÍVEL...</p>
            `;
            break;

        case 'autorizacao':
            titulo = 'Autorização para Uso de Máscara';
            conteudoExtra = `
                <div class="linha">
                    <div class="input-box"><label>Idade:</label><input type="text" id="aut-idade"></div>
                </div>
                <label>Diagnóstico:</label><textarea id="aut-diagnostico"></textarea>
                <label>Características:</label><textarea id="aut-caracteristicas"></textarea>
                <label>Identificação da Máscara:</label><input type="text" id="aut-identificacao">
                <label>Parecer Clínico:</label><textarea id="aut-parecer"></textarea>
                <p class="assinatura">O mesmo está ciente de que...</p>
            `;
            break;

        case 'psicologico':
            titulo = 'Laudo Psicológico';
            conteudoExtra = `
                <div class="linha">
                    <div class="input-box"><label>Idade:</label><input type="text" id="psi-idade"></div>
                </div>
                <label>Histórico Clínico:</label><textarea id="psi-hist_clinico"></textarea>
                <label>Avaliação Psicológica:</label><textarea id="psi-avaliacao"></textarea>
                <label>Recomendação e Tratamento:</label><input type="text" id="psi-recom_tratamento">
                <label>Parecer Clínico:</label><textarea id="psi-parecer"></textarea>
            `;
            break;

        case 'vistoria':
            titulo = 'Formulário de Vistoria';
            conteudoExtra = `<p>... Aqui entra o conteúdo dessa opção ...</p>`;
            break;
    }

    container.innerHTML = `
        <div class="laudo-documento">
            <h2>${titulo}</h2>
            ${tipo !== 'vistoria' ? camposComuns + conteudoExtra + campoDataAssinatura + botoes : conteudoExtra}
        </div>
    `;

    setTimeout(() => {
        document.getElementById("btn-enviar").addEventListener("click", () => {
            const base = {
                tipo,
                nome: document.querySelector(".paciente-nome").value,
                sobrenome: document.querySelector(".paciente-sobrenome").value,
                id: document.querySelector(".paciente-id").value,
                contato: document.querySelector(".paciente-contato").value,
                date: document.querySelector(".date").value,
            };

            let extra = {};

            switch (tipo) {
                case 'psicotecnico':
                    extra = {
                        idade: document.getElementById("idade").value,
                        profissao: document.getElementById("profissao").value,
                        avaliacao: document.getElementById("avaliacao").value,
                        resultado: document.getElementById("resultado").value,
                    };
                    break;
                case 'autorizacao':
                    extra = {
                        idade: document.getElementById("aut-idade").value,
                        diagnostico: document.getElementById("aut-diagnostico").value,
                        caracteristicas: document.getElementById("aut-caracteristicas").value,
                        identificacao: document.getElementById("aut-identificacao").value,
                        parecer: document.getElementById("aut-parecer").value,
                    };
                    break;
                case 'psicologico':
                    extra = {
                        idade: document.getElementById("psi-idade").value,
                        hist_clinico: document.getElementById("psi-hist_clinico").value,
                        avaliacao: document.getElementById("psi-avaliacao").value,
                        recom_tratamento: document.getElementById("psi-recom_tratamento").value,
                        parecer: document.getElementById("psi-parecer").value,
                    };
                    break;
            }

            fetch(`https://${GetParentResourceName()}/tcwz_medic:enviarLaudo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...base, ...extra })
            });
        });
        document.getElementById("btn-cancelar").addEventListener("click", () => {
            container.innerHTML = '';
        });
    }, 100);
}
//---------------------------------------------------//
// CHECAR PASSAPORTE                                 //
//---------------------------------------------------//
document.querySelector('.search').addEventListener('click', function () {
    const passaporte = document.querySelector('.checkPassaporte').value.trim();
    const pageContent = document.getElementById('check-id');
    const resultadoDiv = document.getElementById('resultado-check');

    if (!pageContent.classList.contains('active')) return;
    if (!passaporte) return showNotification('warning', 'Preencha todos os Campos!');

    resultadoDiv.innerHTML = '';

    // Manda pro client.lua
    fetch(`https://${GetParentResourceName()}/tcwz_medic:checkID`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passaporte) // <- valor direto
    });
});
//---------------------------------------------------//
// ENVIAR CONSULTA PARA O CLIENTE                    //
//---------------------------------------------------//
function enviarParaClient(passaporte, acao, tipo, date) {

    const div = document.querySelector('.consulta-pedido');
    if (div) {
        div.remove();
    }
    console.log(passaporte, acao);
    fetch(`https://${GetParentResourceName()}/tcwz_medic:statusConsulta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            passaporte: passaporte,
            acao: acao,
            tipo: tipo,
            date: date
        })
    });
}
//---------------------------------------------------//
// ENVIAR TESTE PARA ID CORRETO                      //
//---------------------------------------------------//
document.querySelector("#send-test .btn-enviar").addEventListener("click", () => {
    const targetID = document.getElementById("targetID").value;

    if (!targetID) {
        showNotification('warning', 'Preencha Todos os Campos!');
        return;
    }

    showNotification('success', `Teste enviado para o ID: ${targetID}.`);
    fetch(`https://${GetParentResourceName()}/tcwz_medic:sendTestID`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(targetID)
    });
});
//---------------------------------------------------//
// ENVIAR TESTE PARA ID CORRETO                      //
//---------------------------------------------------//
document.querySelector("#my-test .btn-enviar").addEventListener("click", () => {
    const medic_id = document.querySelector("#my-test .medic-id").textContent;
    const responses = [];

    for (let i = 1; i <= 10; i++) {
      const value = document.getElementById(`response-${i}`).value.trim();
      if (!value) {
        showNotification('warning', 'Preencha Todos os Campos!');
        return;
      }
      responses.push(value);
      document.getElementById(`response-${i}`).value = '';
    }
    
    showNotification('success', `Teste enviado para o Médico: ${medic_id}.`);
    fetch(`https://${GetParentResourceName()}/tcwz_medic:sendTestMedic`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: medic_id, responses })
    });
    notactive = document.getElementById('my-test');
    infoactive = document.getElementById('info');
    buttonNotactive = document.getElementById('t-Teste');
    notactive.classList.remove('active');
    buttonNotactive.style.display = 'none';
    infoactive.classList.add('active');
});