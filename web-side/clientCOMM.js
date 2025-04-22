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

        if (laudosAnalise.length >= 1) {
            const aLaudosDiv = document.getElementById('a-laudos');
            aLaudosDiv.innerHTML = '';
        
            const h2 = document.createElement('h2');
            h2.textContent = 'Laudos Análise';
        
            const h3 = document.createElement('h3');
            h3.innerHTML = `Tem um total de <span class="aLaudos">${laudosAnalise.length}</span> Laudos para Analisar.`;
        
            aLaudosDiv.appendChild(h2);
            aLaudosDiv.appendChild(h3);
        
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
            th6.textContent = 'Documento';
            const th7 = document.createElement('th');
            th7.textContent = 'Ação';
        
            cabecalho.appendChild(th1);
            cabecalho.appendChild(th2);
            cabecalho.appendChild(th3);
            cabecalho.appendChild(th4);
            cabecalho.appendChild(th5);
            cabecalho.appendChild(th6);
            cabecalho.appendChild(th7);
            thead.appendChild(cabecalho);
            tabela.appendChild(thead);
        
            const tbody = document.createElement('tbody');
        
            laudosAnalise.forEach(laudo => {
                const tr = document.createElement('tr');
                tr.id = `row-${laudo.register_id}`; // ID único para a linha
        
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
                btnVerDocumento.classList.add('btn-ver-laudo');
                btnVerDocumento.textContent = 'Ver Documento';
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
        
                const td7 = document.createElement('td');
                const btnAprovar = document.createElement('button');
                btnAprovar.textContent = 'Aprovar';
                btnAprovar.style.padding = '5px 10px';
                btnAprovar.style.backgroundColor = '#28a745';
                btnAprovar.style.borderRadius = '5px';
                btnAprovar.style.fontSize = '14px';
                btnAprovar.style.marginRight = '10px';
        
                const btnRecusar = document.createElement('button');
                btnRecusar.textContent = 'Recusar';
                btnRecusar.style.padding = '5px 10px';
                btnRecusar.style.backgroundColor = '#dc3545';
                btnRecusar.style.borderRadius = '5px';
                btnRecusar.style.fontSize = '14px';
        
                td7.appendChild(btnAprovar);
                td7.appendChild(btnRecusar);
        
                // Ação de Aprovar (remove a linha imediatamente)
                btnAprovar.addEventListener('click', function() {
                    showNotification('success', 'Laudo Aprovado.');
                    const laudoRow = document.querySelector(`#row-${laudo.register_id}`);
                    if (laudoRow) {
                        laudoRow.remove();
                    }
        
                    // Fazer o fetch para aprovar
                    fetch(`https://${GetParentResourceName()}/tcwz_medic:aprovarLaudo`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            laudo: {
                                register_id: laudo.register_id,
                                user_id: laudo.user_id
                            }
                        })
                    }).catch(error => {
                        console.error("Erro ao aprovar laudo:", error);
                    });
                });
        
                // Ação de Recusar (remove a linha imediatamente)
                btnRecusar.addEventListener('click', function() {
                    showNotification('error', 'Laudo Recusado.');
                    const laudoRow = document.querySelector(`#row-${laudo.register_id}`);
                    if (laudoRow) {
                        laudoRow.remove();
                    }
        
                    // Fazer o fetch para recusar
                    fetch(`https://${GetParentResourceName()}/tcwz_medic:revogarLaudo`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            laudo: {
                                register_id: laudo.register_id,
                                user_id: laudo.user_id
                            }
                        })
                    }).catch(error => {
                        console.error("Erro ao recusar laudo:", error);
                    });
                });
        
                // Monta a linha
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);
                tr.appendChild(td6);
                tr.appendChild(td7);
        
                tbody.appendChild(tr);
            });
        
            tabela.appendChild(tbody);
            aLaudosDiv.appendChild(tabela);
        }        
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
        document.getElementById("aut-diagnostico").value = "";
        document.getElementById("aut-caracteristicas").value = "";
        document.getElementById("aut-identificacao").value = "";
        document.getElementById("aut-parecer").value = "";
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
        const resultDiv = document.getElementById('resultado-check');
        resultDiv.innerHTML = ''; // limpa tudo antes de montar
        if (!event.data.identity || event.data.identity.length === 0) {
            const aviso = document.createElement("p");
            aviso.textContent = "Este passaporte não Existe.";
            resultDiv.appendChild(aviso);
            showNotification('error', 'Passaporte inválido.');
            return;
        }
        // Cria e adiciona informações básicas (sempre visíveis)
        const info = document.createElement("div");
        info.innerHTML = `
            <h2>Resultado da Busca</h2>
            <p><strong>Nome:</strong> ${event.data.identity?.name || "Desconhecido"} ${event.data.identity?.name2 || ""}</p>
            <p><strong>Passaporte:</strong> ${event.data.id || "N/A"}</p>
            <p><strong>Telefone:</strong> ${event.data.identity?.phone || "N/A"}</p>
        `;
        resultDiv.appendChild(info);
    
        // Só monta a tabela se houver laudos
        if (!laudosTID || laudosTID.length === 0) {
            const aviso = document.createElement("p");
            aviso.textContent = "Este Passaporte não contém Laudos.";
            resultDiv.appendChild(aviso);
            showNotification('info', 'Este Passaporte não contém Laudos.');
            return;
        }
        
        showNotification('success', 'Busca realizada.');
        // Continuação: gerar tabela
        const tabela = document.createElement("table");
        tabela.style.width = "100%";
        tabela.style.marginTop = "15px";
    
        const thead = tabela.createTHead();
        const row = thead.insertRow();
        const headers = ["ID", "Registro", "Status", "Tipo", "Data", "Documento"];
        if (permissao === "Diretor") headers.push("Ação");
    
        headers.forEach(t => {
            const th = document.createElement("th");
            th.textContent = t;
            row.appendChild(th);
        });
    
        const tbody = tabela.createTBody();
        laudosTID.forEach(laudo => {
            const tr = tbody.insertRow();
            tr.insertCell().textContent = laudo.user_id;
            tr.insertCell().textContent = laudo.register_id;
            tr.insertCell().textContent = laudo.status;
            tr.insertCell().textContent = laudo.type;
            tr.insertCell().textContent = laudo.date;
    
            const tdDocumento = tr.insertCell();
            const btnVerDocumento = document.createElement('button');
            btnVerDocumento.classList.add('btn-ver-laudo');
            btnVerDocumento.textContent = 'Ver Documento';
            btnVerDocumento.style.padding = '5px 10px';
            btnVerDocumento.style.backgroundColor = '#007BFF';
            btnVerDocumento.style.borderRadius = '5px';
            btnVerDocumento.style.fontSize = '14px';
    
            btnVerDocumento.addEventListener('click', () => {
                showContent('ver-laudo', btnVerDocumento);
                verLaudo(laudo.register_id);
            });
    
            tdDocumento.appendChild(btnVerDocumento);
    
            if (permissao === "Diretor") {
                const tdAcao = tr.insertCell();
                const btnRevogar = document.createElement('button');
                btnRevogar.textContent = 'Revogar Laudo';
                btnRevogar.style.padding = '5px 10px';
                btnRevogar.style.backgroundColor = '#dc3545';
                btnRevogar.style.borderRadius = '5px';
                btnRevogar.style.fontSize = '14px';
                btnRevogar.style.color = '#fff';
    
                btnRevogar.addEventListener('click', () => {
                    fetch(`https://${GetParentResourceName()}/tcwz_medic:revogarLaudo`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            laudo: {
                                register_id: laudo.register_id,
                                user_id: laudo.user_id
                            }
                        })
                    });
                    showNotification('error', 'Laudo Revogado.');
                    tr.remove();
                });
    
                tdAcao.appendChild(btnRevogar);
            }
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
        alert("Preencha todos os campos!");
    }
})
//---------------------------------------------------//
// TYPE LAUDO                                        //
//---------------------------------------------------//
function handleLaudoChange(tipo) {
    const container = document.getElementById('laudo-container');
    container.innerHTML = '';

    if (tipo === 'psicotecnico') {
        container.innerHTML = `
            <div class="laudo-documento">
                <h2>Laudo Psicotécnico</h2>
    
                <label>Nome do Avaliado:</label>
                <div class="linha">
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
    
                <div class="linha">
                    <div class="input-box">
                        <label for="idade">Idade:</label>
                        <input type="text" id="idade" placeholder="Ex: 21">
                    </div>
                    <div class="input-box">
                        <label for="profissao">Profissão:</label>
                        <input type="text" id="profissao" placeholder="Ex: Coronel Dos Bombeiros">
                    </div>
                </div>
    
                <label for="avaliacao">Avaliação Psicológica:</label>
                <textarea id="avaliacao" placeholder="Descreva aqui os detalhes da avaliação..."></textarea>
    
                <label for="resultado">Laudo conclui que o paciente está:</label>
                <input type="text" id="resultado" placeholder="Resultado da avaliação">
    
                <p class="assinatura">
                    A PRESENTE AVALIAÇÃO É INTRANSFERÍVEL. O MESMO SEGUE EM OBSERVAÇÃO.
                </p>
    
                <label for="data">Data da Avaliação:</label>
                <input type="text" id="data" class="date" placeholder="DD/MM/AAAA" maxlength="10">
    
                <label for="ccm">Psicólogo(a) Responsável:</label>
                <input type="text" class="assinaturam" placeholder="Primeiro e Último Nome">
    
                <p class="assinatura">ASSINATURA MÉDICO(A) RESPONSÁVEL</p>
    
                <div class="botoes-final">
                    <button class="btn-enviar" id="btn-enviar">Enviar para Análise</button>
                    <button class="btn-cancelar" id="btn-cancelar">Cancelar</button>
                </div>
            </div>
        `;
    
        setTimeout(() => {
            document.getElementById("btn-enviar").addEventListener("click", () => {
                const data = {
                    tipo: "psicotecnico",
                    nome: document.querySelector(".paciente-nome").value,
                    sobrenome: document.querySelector(".paciente-sobrenome").value,
                    id: document.querySelector(".paciente-id").value,
                    contato: document.querySelector(".paciente-contato").value,
                    idade: document.getElementById("idade").value,
                    profissao: document.getElementById("profissao").value,
                    avaliacao: document.getElementById("avaliacao").value,
                    resultado: document.getElementById("resultado").value,
                    date: document.querySelector(".date").value,
                };
    
                fetch(`https://${GetParentResourceName()}/tcwz_medic:enviarLaudo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            });
        }, 100);
    }    

    else if (tipo === 'autorizacao') {
        container.innerHTML = `
            <div class="laudo-documento">
                <h2>AUTORIZAÇÃO PARA USO DE MÁSCARA</h2>
    
                <div class="linha">
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
    
                <div class="linha">
                    <div class="input-box">
                        <label for="idade">Idade:</label>
                        <input type="text" id="aut-idade" placeholder="Ex: 21">
                    </div>
                </div>
    
                <label for="diagnostico">Diagnóstico:</label>
                <textarea id="aut-diagnostico" placeholder="Detalhes do diagnóstico..."></textarea>
    
                <label for="caracteristicas">Características:</label>
                <textarea id="aut-caracteristicas" placeholder="Características da máscara ou do caso..."></textarea>
    
                <label for="identificacao">Identificação da Máscara:</label>
                <input type="text" id="aut-identificacao" placeholder="ID da máscara ou nome...">
    
                <label for="parecer">CONCLUSÃO/PARECER CLÍNICO:</label>
                <textarea id="aut-parecer" placeholder="Descrição do parecer clínico..."></textarea>
    
                <p class="assinatura">
                    O mesmo está ciente de que este não o torna inimputável e que a remoção daquilo que o identifica: a máscara, incorre em óbito.
                </p>
                <label for="data">Data da Avaliação:</label>
                <input type="text" id="data" class="date" placeholder="DD/MM/AAAA" maxlength="10">

                <label for="assinatura">Assinatura:</label>
                <input type="text" class="assinaturam" placeholder="Primeiro e Último Nome">
    
                <p class="assinatura">ASSINATURA MÉDICO(A) RESPONSÁVEL</p>
    
                <div class="botoes-final">
                    <button class="btn-enviar" id="btn-enviar">Enviar para Análise</button>
                    <button class="btn-cancelar" id="btn-cancelar">Cancelar</button>
                </div>
            </div>
        `;
    
        setTimeout(() => {
            document.getElementById("btn-enviar").addEventListener("click", () => {
                const data = {
                    tipo: "autorizacao",
                    nome: document.querySelector(".paciente-nome").value,
                    sobrenome: document.querySelector(".paciente-sobrenome").value,
                    id: document.querySelector(".paciente-id").value,
                    contato: document.querySelector(".paciente-contato").value,
                    idade: document.getElementById("aut-idade").value,
                    diagnostico: document.getElementById("aut-diagnostico").value,
                    caracteristicas: document.getElementById("aut-caracteristicas").value,
                    identificacao: document.getElementById("aut-identificacao").value,
                    parecer: document.getElementById("aut-parecer").value,
                    date: document.querySelector(".date").value,
                    assinatura: document.querySelector(".assinaturam").value
                };
    
                fetch(`https://${GetParentResourceName()}/tcwz_medic:enviarLaudo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            });
        }, 100);
    }
    else if (tipo === 'psicologico') {
        container.innerHTML = `<h3>Formulário Psicológico</h3><p>... Aqui entra o conteúdo dessa opção ...</p>`;
    }
    else if (tipo === 'vistoria') {
        container.innerHTML = `<h3>Formulário de Vistoria</h3><p>... Aqui entra o conteúdo dessa opção ...</p>`;
    }
}
//---------------------------------------------------//
// CHECAR PASSAPORTE                                 //
//---------------------------------------------------//
document.querySelector('.search').addEventListener('click', function () {
    const passaporte = document.querySelector('.checkPassaporte').value.trim();
    const pageContent = document.getElementById('check-id');
    const resultadoDiv = document.getElementById('resultado-check');

    if (!pageContent.classList.contains('active')) return;
    if (!passaporte) return alert("Digite um passaporte válido.");

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
        showNotification('error', 'Preencha Todos os Campos!');
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