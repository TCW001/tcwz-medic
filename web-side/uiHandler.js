//---------------------------------------------------//
// MOSTRAR CONTEUDO DE PAGINAS                       //
//---------------------------------------------------//
function showContent(contentId, button) {
    // 1. Desmarcar todos os botões como inativos
    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');  // Marca o botão atual como ativo

    // 2. Remover a classe 'active' de todas as divs de conteúdo
    document.querySelectorAll('.page-content').forEach(content => {
        content.classList.remove('active');
    });

    // 3. Ativar a div de conteúdo correspondente ao contentId
    const targetContent = document.getElementById(contentId);
    if (targetContent) {
        targetContent.classList.add('active');
        
        // 4. Verificar se a página ativa é a "check-id"
        if (contentId !== "check-id") {
            // Limpar o conteúdo de #resultado-check se a página "check-id" não estiver ativa
            const resultadoCheck = document.getElementById('resultado-check');
            if (resultadoCheck) {
                resultadoCheck.innerHTML = ''; // Limpa o conteúdo
            }
        }
    }
}
//---------------------------------------------------//
// INPUT HORA e DATA                                 //
//---------------------------------------------------//
document.body.addEventListener("input", function(event) {
    // Para o input de tempo (hora)
    if (event.target.id === "time") {  // Usando ID para identificar o campo de hora
        let timeInput = event.target;
        let val = timeInput.value.replace(/\D/g, "");

        if (val.length === 4) {
            let h = parseInt(val.slice(0, 2));
            let m = parseInt(val.slice(2, 4));

            h = Math.min(h, 23);
            m = Math.min(m, 59);

            timeInput.value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        }
    }

    // Para o input de data
    if (event.target.id === "data") {  // Usando ID para identificar o campo de data
        let dateInput = event.target;
        let val = dateInput.value.replace(/\D/g, "");

        if (val.length <= 8) {
            let d = val.slice(0, 2);
            let m = val.slice(2, 4);
            let y = val.slice(4, 8);

            dateInput.value = [d, m, y].filter(Boolean).join('/');
        }

        if (val.length === 8) {
            let [d, m, y] = [val.slice(0, 2), val.slice(2, 4), val.slice(4, 8)].map(Number);

            d = Math.min(Math.max(d, 1), 31);
            m = Math.min(Math.max(m, 1), 12);
            y = Math.max(y, 1900);

            dateInput.value = `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
        }
    }
});
//---------------------------------------------------//
// NOTIFY                                            //
//---------------------------------------------------//
// Função para mostrar a notificação
function showNotification(type, message, duration = 5000) {
    const notify = document.getElementById("notify");
    const notifyProgress = document.createElement("div");
    notifyProgress.classList.add("notify-progress");
    const icon = document.createElement("img");
    icon.classList.add("notify-icon");

    // Definindo o ícone SVG e a classe da barra de progresso de acordo com o tipo
    let iconSrc = "";
    let progressClass = "";

    if (type === "success") {
        iconSrc = "images/check-circle.svg"; // Substitua com o caminho do seu ícone SVG de sucesso
        progressClass = "notify-progress-success";
    } else if (type === "error") {
        iconSrc = "images/x-circle-error.svg"; // Substitua com o caminho do seu ícone SVG de erro
        progressClass = "notify-progress-error";
    } else if (type === "info") {
        iconSrc = "images/information-circle.svg"; // Substitua com o caminho do seu ícone SVG de info
        progressClass = "notify-progress-info";
    } else if (type === "warning") {
        iconSrc = "images/exclamation-circle.svg"; // Substitua com o caminho do seu ícone SVG de warning
        progressClass = "notify-progress-warning";
    }

    // Adicionando o ícone e a classe de cor à notificação
    icon.src = iconSrc;

    // Colocando o texto na notificação
    notify.innerHTML = `
        <div style="display: flex; align-items: center;">
            ${icon.outerHTML}
            <div>${message}</div>
        </div>
    `;

    // Adiciona a barra de progresso
    notify.appendChild(notifyProgress);

    // Adiciona a classe de barra de progresso de acordo com o tipo
    notifyProgress.classList.add(progressClass);

    // Exibe a notificação
    notify.style.display = "block";

    // Variáveis para controle da barra de progresso e animação
    let progressBar = 0;
    const increment = 100 / (duration / 100);  // Incremento da barra de progresso por intervalo de tempo

    const progressInterval = setInterval(() => {
        progressBar += increment;
        if (progressBar >= 100) {
            clearInterval(progressInterval);
        }
        notifyProgress.style.width = `${progressBar}%`;
    }, 100);

    // Após o tempo de duração, a notificação desaparece
    setTimeout(() => {
        notify.style.display = "none";
        notify.innerHTML = ""; // Limpa o conteúdo da notificação
        notifyProgress.classList.remove(progressClass);  // Remove a classe de cor da barra
    }, duration);
}
//---------------------------------------------------//
// VER LAUDO                                         //
//---------------------------------------------------//
function verLaudo(register_id) {
    console.log('Procurando laudo com register_id:', register_id); // Verificando o register_id passado

    // Tentando encontrar o laudo nas duas listas (laudosAnalise e laudosAprovados)
    const laudo = laudosAnalise.find(l => l.register_id === register_id) || laudosAprovados.find(l => l.register_id === register_id) || laudosTID.find(l => l.register_id === register_id);

    // Se o laudo não for encontrado, exibe erro
    if (!laudo) {
        console.error('Laudo não encontrado para o registro ID:', register_id);
        return;
    }

    // Caso o laudo seja encontrado, exibe as informações
    console.log('Laudo encontrado:', laudo);

    // Atualizando os valores comuns a todos os laudos
    document.querySelector('#ver-laudo .register_id').innerText =  laudo?.register_id || 'ID de registro não especificado';
    document.querySelector('#ver-laudo .name').innerText = laudo?.name + " " + laudo?.name2 || 'Nome não especificado';
    document.querySelector('#ver-laudo .id').innerText = laudo?.user_id || 'ID de passaporte não especificado';
    document.querySelector('#ver-laudo .age').innerText = laudo?.age || 'Idade não especificada';
    document.querySelector('#ver-laudo .phone').innerText = laudo?.contact || 'Telefone não especificado';
    const date = document.querySelector('#ver-laudo .date-laudo');

    // Limpar conteúdo extra, caso haja algum valor pré-existente
    document.querySelector('.extra-fields').innerHTML = '';

    // Preencher campos específicos baseados no tipo de laudo
    if (laudo?.type === 'psicotecnico') {
        // Campos específicos para psicotécnico
        const job = laudo?.job || 'Não especificado';
        const desc_result = laudo?.desc_result || 'Não especificado';
        const result = laudo?.result || 'Não especificado';
        date.innerHTML = laudo?.date;
        document.querySelector('#ver-laudo .type').innerText = 'Exame Psicotécnico';
        document.querySelector('#ver-laudo .extra-fields').innerHTML = `
            <h2 style="text-align: left;">Profissão: <span class="job">${job}</span></h2>
            <h2>Avaliação</h2>
            <h2><span class="desc_result">${desc_result}</span></h2>
            <h3 style="text-align: center;">O(a) candidato(a) acima relacionad(a), foi submetido(a) a avaliação psicológica e foi considerado(a):</h3>
            <h2>Laudo conclui que o paciente esta: <span class="result">${result}</span></h2>
            <h3 style="text-align: center;">A presente avaliação é intransferível e o mesmo segue em observação.</h3>
            <h3 class="assinatura">Dr.(a) <span>${laudo?.signatureMedic}</span> Psicólogo(a)CCM: <span>${laudo?.medic_id}</span></h3>
        `;
    } else if (laudo?.type === 'autorizacao') {
        // Campos específicos para autorização
        const diagnostico = laudo?.diagnostico || 'Não especificado';
        const caracteristicas = laudo?.caracteristicas || 'Não especificado';
        const identificacao = laudo?.identificacao || 'Não especificado';
        const parecer = laudo?.parecer || 'Não especificado';
        const title = document.querySelector('#ver-laudo .type');
        date.innerHTML = laudo?.date;
        title.innerText = 'AUTORIZAÇÃO PARA USO DE MÁSCARA';
        title.style.fontSize = '38px';
        document.querySelector('.extra-fields').innerHTML = `
            <h2>Diagnóstico: <br><span class="diagnostico">${diagnostico}</span></h2>
            <h2>Características: <br><span class="caracteristicas">${caracteristicas}</span></h2>
            <h2 style="text-align: left;">Indentificação da Máscara: <span class="identificacao">${identificacao}</span></h2>
            <h3 style="text-align: center;">O mesmo está ciente de que este laudo não o torna inimputável e que a remoção daquilo que o identifica: a máscara, incorre em óbito.</h3>
            <h2>Conclusão/Parecer: <br><span class="parecer">${parecer}</span></h2>
            <h3 class="assinatura">Dr.(a) <span>${laudo?.signatureMedic}</span> Psicólogo(a)CCM: <span>${laudo?.medic_id}</span></h3>
        `;
    } else if (laudo?.type === 'psicologico') {
        // Campos específicos para autorização
        const hist_clinico = laudo?.hist_clinico || 'Não especificado';
        const avaliacao = laudo?.avaliacao || 'Não especificado';
        const recom_tratamento = laudo?.recom_tratamento || 'Não especificado';
        const parecer = laudo?.parecer || 'Não especificado';
        date.innerHTML = laudo?.date;
        document.querySelector('#ver-laudo .type').innerText = 'LAUDO PSICOLÓGICO';
        document.querySelector('.extra-fields').innerHTML = `
            <h2>Histórico Clinico: <br><span class="diagnostico">${hist_clinico}</span></h2>
            <h2>Recomendações e tratamento: <br><span class="caracteristicas">${avaliacao}</span></h2>
            <h2>Parecer Clinico: <br><span class="identificacao">${recom_tratamento}</span></h2>
            <h2>Conclusão/Parecer Clinico: <br><span class="parecer">${parecer}</span></h2>
            <h3 class="assinatura">Dr.(a) <span>${laudo?.signatureMedic}</span> Psicólogo(a)CCM: <span>${laudo?.medic_id}</span></h3>
        `;
    } else {
        console.warn('Tipo de laudo desconhecido ou não especificado');
    }

    // **IMPORTANTE:** Não mexa no display da página aqui. Não deve alterar a visibilidade.
    // A visibilidade da página deve ser controlada em outro lugar.
}

function criarElemento(tag, texto = '', atributos = {}) {
    const el = document.createElement(tag);
    if (texto) el.textContent = texto;
    Object.entries(atributos).forEach(([key, value]) => el.setAttribute(key, value));
    return el;
}

function criarBotao(texto, cor, callback) {
    const btn = document.createElement('button');
    btn.textContent = texto;
    btn.style.padding = '5px 10px';
    btn.style.backgroundColor = cor;
    btn.style.borderRadius = '5px';
    btn.style.fontSize = '14px';
    if (callback) btn.addEventListener('click', callback);
    return btn;
}

function atualizarLaudosAnalise() {
    const aLaudosDiv = document.getElementById('a-laudos');
    aLaudosDiv.innerHTML = ''; // Limpa sempre

    // Título e quantidade de laudos
    aLaudosDiv.appendChild(criarElemento('h2', 'Laudos Análise'));

    const qtdTexto = laudosAnalise.length > 0
        ? `Tem um total de <span class="aLaudos">${laudosAnalise.length}</span> Laudos para Analisar.`
        : 'Nenhum laudo para analisar no momento.';
    aLaudosDiv.appendChild(criarElemento('h3', '', { innerHTML: qtdTexto }));

    if (laudosAnalise.length === 0) return; // Para aqui se não tiver laudos, após atualizar info

    const tabela = document.createElement('table');
    tabela.style.width = '100%';
    tabela.style.borderCollapse = 'collapse';

    // Cabeçalho
    const thead = document.createElement('thead');
    const cabecalho = document.createElement('tr');
    ['ID', 'Registro', 'Status', 'Tipo', 'Data de Emissão', 'Documento', 'Ação'].forEach(texto => {
        cabecalho.appendChild(criarElemento('th', texto));
    });
    thead.appendChild(cabecalho);
    tabela.appendChild(thead);

    const tbody = document.createElement('tbody');

    laudosAnalise.forEach(laudo => {
        const tr = document.createElement('tr');
        tr.id = `row-${laudo.register_id}`;

        ['user_id', 'register_id', 'status', 'type', 'date'].forEach(prop => {
            tr.appendChild(criarElemento('td', laudo[prop]));
        });

        // Botão Documento
        const tdDocumento = document.createElement('td');
        const btnVer = criarBotao('Ver Documento', '#007BFF', () => {
            showContent('ver-laudo', btnVer);
            verLaudo(laudo.register_id);
        });
        btnVer.classList.add('btn-ver-laudo');
        tdDocumento.appendChild(btnVer);
        tr.appendChild(tdDocumento);

        // Botões Aprovar / Recusar
        const tdAcoes = document.createElement('td');
        const btnAprovar = criarBotao('Aprovar', '#28a745', () => {
            showNotification('success', 'Laudo Aprovado.');
            document.getElementById(`row-${laudo.register_id}`)?.remove();
            fetch(`https://${GetParentResourceName()}/tcwz_medic:aprovarLaudo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ laudo: { register_id: laudo.register_id, user_id: laudo.user_id, type: laudo.type } })
            }).catch(err => console.error('Erro ao aprovar laudo:', err));
        });

        const btnRecusar = criarBotao('Recusar', '#dc3545', () => {
            showNotification('error', 'Laudo Recusado.');
            document.getElementById(`row-${laudo.register_id}`)?.remove();
            fetch(`https://${GetParentResourceName()}/tcwz_medic:revogarLaudo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ laudo: { register_id: laudo.register_id, user_id: laudo.user_id, type: laudo.type} })
            }).catch(err => console.error('Erro ao recusar laudo:', err));
        });

        btnAprovar.style.marginRight = '10px';
        tdAcoes.appendChild(btnAprovar);
        tdAcoes.appendChild(btnRecusar);
        tr.appendChild(tdAcoes);

        tbody.appendChild(tr);
    });

    tabela.appendChild(tbody);
    aLaudosDiv.appendChild(tabela);
}