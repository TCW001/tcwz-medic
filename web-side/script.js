let idUI = "";
let nameUI = "";
let lastNameUI = "";
let permissNUI = "";
let selectedOption = "";

window.addEventListener('message', function(event) {
    if (event.data.action === "open") {
        const container = document.getElementById('container');
        container.style.display = 'flex';  // Se o container estiver oculto, garantimos que ele fique visível.
        
        // Força a atualização do layout, recalculando a estrutura
        setTimeout(() => {
            container.style.width = '80%';  // Ajuste da largura, se necessário
            container.style.height = '80%'; // Ajuste da altura, se necessário
        }, 100);  // Delay de 100ms para garantir que o painel tenha tempo para aparecer
    }

    permissNUI = event.data.permiss;
    if (permissNUI === "Paramedic") {
        document.getElementById("medic").style.display = 'flex';
        document.getElementById("medic1").style.display = 'flex';
        document.getElementById("staff").style.display = 'flex';
        document.getElementById("checkID").style.display = 'flex';
        document.getElementById("title").innerText = 'CUS | Funcionário';
    } else if (permissNUI === "Police") {
        document.getElementById("medic").style.display = 'none';
        document.getElementById("medic1").style.display = 'none';
        document.getElementById("staff").style.display = 'none';
        document.getElementById("checkID").style.display = 'flex';
        document.getElementById("title").innerText = 'CUS | Policia';
    } else {
        document.getElementById("medic").style.display = 'none';
        document.getElementById("medic1").style.display = 'none';
        document.getElementById("staff").style.display = 'none';
        document.getElementById("checkID").style.display = 'none';
        document.getElementById("title").innerText = 'CUS | Cidadão';
    }

    // Verificar se os dados não são undefined
    if (event.data.id && event.data.name && event.data.lastName) {
        idUI = event.data.id;
        nameUI = event.data.name;
        lastNameUI = event.data.lastName;
        
        if (event.data.action === "updateTable") {
            // Atualiza os dados da tabela com os valores recebidos do servidor
            document.getElementById("Name").innerText = nameUI || "Nome não disponível";
            document.getElementById("Name2").innerText = nameUI || "Nome não disponível";
            document.getElementById("lastName").innerText = lastNameUI || "Sobrenome não disponível";
            document.getElementById("id").innerText = idUI || "Não Disponível";  
        }
    }
    console.log(event.data.checkDataNUI)
    if (event.data.checkDataNUI === "correto") {
        alert("Laudo enviado para Análise.")
        // limpar formulario do laudo
        document.getElementById("paciente").value = '';
        document.getElementById("paciente2").value = '';
        document.getElementById("idade").value = '';
        document.getElementById("rg").value = '';
        document.getElementById("contato").value = '';
        document.getElementById("profissao").value = '';
        document.getElementById("avaliacao").value = '';
        document.getElementById("resultado").value = '';
        document.getElementById("data").value = '';
        document.getElementById("ccm").value = '';
    } else if (event.data.checkDataNUI === "incorreto") {
        alert("Dados Incorretos, faça uma revisão.")
        // Limpar do formulario laudo (name,name2,id,phone)
        document.getElementById("paciente").value = '';
        document.getElementById("paciente2").value = '';
        document.getElementById("rg").value = '';
        document.getElementById("contato").value = '';
    }

    if (event.data.action === "renderLaudos") {
        const laudos = event.data.result;
        const tableBody = document.querySelector("#aprovarLaudo tbody");
        tableBody.innerHTML = "";
    
        laudos.forEach((laudo, index) => {
            const row = document.createElement("tr");
    
            row.innerHTML = `
                <td>${laudo.register_id}</td>
                <td>${laudo.user_id}</td>
                <td>${laudo.name}</td>
                <td>${laudo.type}</td>
                <td>${laudo.date}</td>
                <td>${laudo.status}</td>
                <td>${laudo.medic_id}</td>
                <td><button class="ver-doc" data-index="${index}" onclick="verDocumento()">Ver Documento</button></td>
                <td>
                    <button class="btn-aprovar" data-id="${laudo.register_id}">Aprovar</button>
                    <button class="btn-recusar" data-id="${laudo.register_id}">Recusar</button>
                </td>
            `;
    
            tableBody.appendChild(row);
        });
    
        // Ver Documento
        document.querySelectorAll(".ver-doc").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                const laudo = laudos[index];
    
                document.getElementById("type").innerText = laudo.type || "-";
                document.getElementById("name").innerText = laudo.name + " " + laudo.name2 || "-";
                document.getElementById("age").innerText = laudo.age || "-";
                document.getElementById("user_id").innerText = laudo.user_id || "-";
                document.getElementById("phone").innerText = laudo.contact || "-";
                document.getElementById("job").innerText = laudo.job || "-";
                document.getElementById("desc_avaliacao").innerText = laudo.desc_result || "-";
                document.getElementById("result").innerText = laudo.result || "-";
                document.getElementById("date").innerText = laudo.date || "-";
                document.getElementById("medicSignature").innerText = laudo.medic_id || "-";
                document.getElementById("register").innerText = laudo.register_id || "-";
            });
        });
    
        // Aprovar
        document.querySelectorAll(".btn-aprovar").forEach(button => {
            button.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                const row = this.closest("tr");
    
                fetch(`https://${GetParentResourceName()}/aprovarLaudo`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ register_id: id })
                });
    
                row.remove(); // remove a linha da tabela direto
            });
        });
    
        // Recusar
        document.querySelectorAll(".btn-recusar").forEach(button => {
            button.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                const row = this.closest("tr");
    
                fetch(`https://${GetParentResourceName()}/recusarLaudo`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ register_id: id })
                });
    
                row.remove(); // remove a linha da tabela direto
            });
        });
    }
    
    if (event.data.action === "renderMyLaudos") {
        const laudos = event.data.result2;
        const tableBody = document.querySelector("#meusLaudos tbody");
        tableBody.innerHTML = "";
    
        laudos.forEach((laudo, index) => {
            const row = document.createElement("tr");
    
            row.innerHTML = `
                <td>${laudo.register_id}</td>
                <td>${laudo.type}</td>
                <td>${laudo.date}</td>
                <td><button class="ver-doc-meu" data-index="${index}" onclick="verDocumento()">Ver Documento</button></td>
            `;
    
            tableBody.appendChild(row);
        });
    
        document.querySelectorAll(".ver-doc-meu").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                const laudo = laudos[index];
    
                document.getElementById("type").innerText = laudo.type || "-";
                document.getElementById("name").innerText = laudo.name + " " + laudo.name2 || "-";
                document.getElementById("age").innerText = laudo.age || "-";
                document.getElementById("user_id").innerText = laudo.user_id || "-";
                document.getElementById("phone").innerText = laudo.contact || "-";
                document.getElementById("job").innerText = laudo.job || "-";
                document.getElementById("desc_avaliacao").innerText = laudo.desc_result || "-";
                document.getElementById("result").innerText = laudo.result || "-";
                document.getElementById("date").innerText = laudo.date || "-";
                document.getElementById("medicSignature").innerText = laudo.medic_id || "-";
                document.getElementById("register").innerText = laudo.register_id || "-";
            });
        });
    }

    // Envia o ID do passaporte buscado para o servidor
    if (event.data.action === "renderPassaporte") {
        const laudos = event.data.result3;
    
        // Preenche os dados
        document.getElementById("infoPassaporte").style.display = "block";
        document.getElementById("nomePassaporte").innerText = laudos[0].name + " " + laudos[0].name2;
        document.getElementById("idPassaporte").innerText = laudos[0].user_id;
        document.getElementById("quantidadeLaudos").innerText = laudos.length;
    
        // Preenche a tabela
        const tableBody = document.querySelector("#tabelaLaudosPassaporte tbody");
        tableBody.innerHTML = "";
    
        if (laudos.length > 0) {
            document.getElementById("tabelaLaudosPassaporte").style.display = "table";
        } else {
            document.getElementById("tabelaLaudosPassaporte").style.display = "none";
        }
    
        laudos.forEach((laudo, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${laudo.register_id || "-"}</td>
                <td>${laudo.type || "-"}</td>
                <td>${laudo.date || "-"}</td>
                <td><button class="ver-doc" data-index="${index}" onclick="verDocumento()">Ver Documento</button></td>
            `;
            tableBody.appendChild(row);
        });
        
        // Evento para ver documento do passaporte
        document.querySelectorAll(".ver-doc").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                const laudo = laudos[index];
        
                document.getElementById("type").innerText = laudo.type || "-";
                document.getElementById("name").innerText = (laudo.name || "") + " " + (laudo.name2 || "");
                document.getElementById("age").innerText = laudo.age || "-";
                document.getElementById("user_id").innerText = laudo.user_id || "-";
                document.getElementById("phone").innerText = laudo.contact || "-";
                document.getElementById("job").innerText = laudo.job || "-";
                document.getElementById("desc_avaliacao").innerText = laudo.desc_result || "-";
                document.getElementById("result").innerText = laudo.result || "-";
                document.getElementById("date").innerText = laudo.date || "-";
                document.getElementById("medicSignature").innerText = laudo.medic_id || "-";
                document.getElementById("register").innerText = laudo.register_id || "-";
            });
        });
    }
});

function fecharPainel() {
    fetch(`https://${GetParentResourceName()}/closePanel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    }).then(resp => resp.json()).then(resp => {
        document.getElementById("container").style.display = "none";
    });
}

function showContent(contentId) {
    // Primeiro, escondemos a div de laudo se estiver visível
    const laudoDiv = document.getElementById('laudo');
    if (laudoDiv && laudoDiv.style.display === 'block') {
        laudoDiv.style.display = 'none';  // Esconde o laudo
    }

    // Esconde todos os conteúdos
    document.querySelectorAll('.content-box').forEach(box => {
        box.classList.remove('active');
        box.style.display = 'none';  // Esconde a div do conteúdo
    });

    // Mostra o conteúdo selecionado
    const selectedContent = document.getElementById(contentId);
    if (selectedContent) {
        selectedContent.classList.add('active');
        selectedContent.style.display = 'block';  // Torna o conteúdo visível
    }

    // Atualiza o botão da sidebar para mostrar qual aba está ativa
    document.querySelectorAll('.sidebar button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.sidebar button[onclick*="${contentId}"]`).classList.add('active');
}

function selectOption(option) {
    selectedOption = option;
    document.getElementById("dropdownButton").innerText = option;
}

// Função para solicitar a consulta
function solicitarConsulta() {
    const data = document.getElementById('dataInput').value;
    const hora = document.getElementById('horaInput').value;
    const desc = document.getElementById('descricao').value;

    // Verifica se todos os campos estão preenchidos
    if (!selectedOption || !data || !hora || !desc) {
        alert("Preencha todos os campos antes de solicitar!");
        return;
    }

    // Cria uma nova linha na tabela de pedidos de consulta
    const consultaRow = document.createElement("tr");
    
    consultaRow.innerHTML = `
        <th>${nameUI}</th>       <!-- Nome -->
        <th>${idUI}</th>         <!-- ID -->
        <td>${selectedOption}</td>
        <td>${data}</td>
        <td>${hora}</td>
        <td>${desc}</td>
        <td><span class="status" id="status-pendente">Pendente</span></td>
        <td>
            <button onclick="mudarStatus('confirmado', this)">Confirmar</button>
            <button onclick="mudarStatus('recusado', this)">Recusar</button>
            <button onclick="mudarStatus('reagendar', this)">Reagendar</button>
        </td>
    `;

    // Adiciona a linha à tabela de pedidos de consulta
    document.getElementById("pedidosConsulta").querySelector("tbody").appendChild(consultaRow);

    // Limpa os campos
    document.getElementById('dataInput').value = '';
    document.getElementById('horaInput').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('dropdownButton').innerText = 'Selecione';
}

// Função para mudar o status do pedido e mover para Minhas Consultas e Histórico de Consultas
function mudarStatus(status, button) {
    // Pega o elemento da consulta
    const consultaItem = button.closest("tr");
    const statusElement = consultaItem.querySelector(".status");

    // Altera o status
    if (status === "confirmado") {
        statusElement.innerText = "Aprovado";
        statusElement.classList.add("status-confirmado");
        statusElement.classList.remove("status-recusado", "status-reagendado");
    } else if (status === "recusado") {
        statusElement.innerText = "Recusado";
        statusElement.classList.add("status-recusado");
        statusElement.classList.remove("status-confirmado", "status-reagendado");
    } else if (status === "reagendar") {
        statusElement.innerText = "Solicitar outra Consulta";
        statusElement.classList.add("status-reagendado");
        statusElement.classList.remove("status-confirmado", "status-recusado");
    }

    // Remove os botões "Confirmar", "Recusar" e "Reagendar" da consulta antes de mover
    const buttons = consultaItem.querySelectorAll("button");
    buttons.forEach(button => button.remove()); // Remove os botões

    // Move a consulta para "Histórico de Consultas" (sem alteração)
    const historicoTable = document.getElementById("historicoConsulta").querySelector("tbody");
    historicoTable.appendChild(consultaItem);

    // **Clona a consulta para "Minhas Consultas"**
    const consultaClone = consultaItem.cloneNode(true); // Clona a linha para a tabela de "Minhas Consultas"
    
    // **Remove o nome e o ID do clone para Minhas Consultas**
    const cloneCells = consultaClone.querySelectorAll("th");
    if (cloneCells.length >= 2) {
        cloneCells[0].style.display = "none"; // Esconde o "name" no clone
        cloneCells[1].style.display = "none"; // Esconde o "id" no clone
    }

    // Adiciona a linha clonada à tabela "Minhas Consultas"
    document.getElementById("minhasConsultas").querySelector("tbody").appendChild(consultaClone);
}

document.getElementById('btnSolicitar').addEventListener('click', solicitarConsulta);

document.getElementById("btn-enviar").addEventListener("click", function() {
    // Coletar os valores dos campos e remover espaços em branco ao redor
    var tipoExame = document.getElementById("exame").value.trim();
    var nome = document.getElementById("paciente").value.trim();
    var sobrenome = document.getElementById("paciente2").value.trim();
    var idade = document.getElementById("idade").value.trim();
    var rg = document.getElementById("rg").value.trim();
    var contato = document.getElementById("contato").value.trim();
    var profissao = document.getElementById("profissao").value.trim();
    var avaliacao = document.getElementById("avaliacao").value.trim();
    var resultado = document.getElementById("resultado").value.trim();
    var data = document.getElementById("data").value.trim();
    var ccm = document.getElementById("ccm").value.trim();

    // Verificar se todos os campos estão preenchidos
    if (tipoExame === "" || nome === "" || sobrenome === "" || idade === "" || rg === "" || contato === "" || profissao === "" || avaliacao === "" || resultado === "" || data === "" || ccm === "") {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Criar objeto com as informações coletadas
    var dados = {
        tipoExame: tipoExame,
        nome: nome,
        sobrenome: sobrenome,
        idade: idade,
        rg: rg,
        contato: contato,
        profissao: profissao,
        avaliacao: avaliacao,
        resultado: resultado,
        data: data,
        ccm: ccm
    };

    // Enviar os dados para o client.lua com SendNUIMessage
    fetch(`https://${GetParentResourceName()}/laudo:sendDataServer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dados: dados })
    }).then(resp => resp.json()).then(resp => {
        if (resp.status === "ok") {
            // Fechar o painel após enviar os dados
        } else {
            alert("Houve um erro ao enviar os dados.");
        }
    });
});

function verDocumento() {
    // Acessa o conteúdo atual
    const conteudoAtual = document.querySelector('.content-box.active');  // A div ativa do conteúdo
    const laudoDiv = document.getElementById('laudo');

    // Esconde o conteúdo atual
    if (conteudoAtual) {
        conteudoAtual.style.display = 'none'; // Oculta o conteúdo atual
    }

    // Exibe o laudo
    if (laudoDiv) {
        laudoDiv.style.display = 'block';  // Torna o laudo visível
    }
}

document.getElementById("btn-cancelar").addEventListener("click", function() {
    document.getElementById("paciente").value = '';
    document.getElementById("paciente2").value = '';
    document.getElementById("idade").value = '';
    document.getElementById("rg").value = '';
    document.getElementById("contato").value = '';
    document.getElementById("profissao").value = '';
    document.getElementById("avaliacao").value = '';
    document.getElementById("resultado").value = '';
    document.getElementById("data").value = '';
    document.getElementById("ccm").value = '';
});

// Envia o ID do passaporte buscado para o servidor
document.getElementById("buscarPassaporteForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const inputID = document.getElementById("passaporteInput").value;
    
    fetch(`https://${GetParentResourceName()}/buscarPorPassaporte`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: inputID })
    });
});