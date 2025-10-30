// Variáveis Globais
let mesas = [];
let mesaSelecionadaId = null;
let pedidosMesas = {}; // Simula pedidos por mesa (provisório)

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initCaixa();
    setupEventListeners();
    carregarDarkMode();
});

// Inicialização Principal
async function initCaixa() {
    try {
        await carregarMesas();
        simularPedidosIniciais(); // Provisório - para demonstração
        renderizarMesas();
    } catch (error) {
        console.error('Erro ao inicializar caixa:', error);
        alert('Erro ao carregar dados. Verifique o console.');
    }
}

// Carregar Mesas da API
async function carregarMesas() {
    try {
        const response = await fetch('/api/config/mesas');
        const config = await response.json();
        const qtdMesas = config.quantidadeMesas || 5;
        
        mesas = Array.from({ length: qtdMesas }, (_, i) => ({
            id: i + 1,
            numero: i + 1,
            ocupada: false,
            pedidos: []
        }));
    } catch (error) {
        console.error('Erro ao carregar mesas:', error);
        // Fallback: 5 mesas padrão
        mesas = Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            numero: i + 1,
            ocupada: false,
            pedidos: []
        }));
    }
}

// Simular Pedidos Iniciais (PROVISÓRIO - será substituído por API real)
function simularPedidosIniciais() {
    // Mesa 1 - com pedidos
    pedidosMesas[1] = [
        { id: 1, nome: 'X-Burger Clássico', preco: 25.90, quantidade: 2 },
        { id: 2, nome: 'Batata Frita Grande', preco: 18.00, quantidade: 1 },
        { id: 3, nome: 'Coca-Cola 350ml', preco: 6.50, quantidade: 2 }
    ];
    mesas[0].ocupada = true;

    // Mesa 3 - com pedidos
    pedidosMesas[3] = [
        { id: 4, nome: 'Pizza Margherita', preco: 45.90, quantidade: 1 },
        { id: 5, nome: 'Suco Natural Laranja', preco: 8.90, quantidade: 2 }
    ];
    mesas[2].ocupada = true;

    // Mesa 5 - com pedidos
    pedidosMesas[5] = [
        { id: 6, nome: 'Filé com Fritas', preco: 38.90, quantidade: 1 }
    ];
    mesas[4].ocupada = true;
}

// Renderizar Grid de Mesas
function renderizarMesas() {
    const mesasGrid = document.getElementById('mesasGrid');
    mesasGrid.innerHTML = '';

    mesas.forEach(mesa => {
        const mesaCard = document.createElement('div');
        mesaCard.className = `mesa-card ${mesa.ocupada ? 'ocupada' : 'vazia'}`;
        mesaCard.dataset.mesaId = mesa.id;
        
        mesaCard.innerHTML = `
            <div class="mesa-numero">${mesa.numero}</div>
            <div class="mesa-status">${mesa.ocupada ? 'Ocupada' : 'Vazia'}</div>
        `;

        mesaCard.addEventListener('click', () => selecionarMesa(mesa.id));
        mesasGrid.appendChild(mesaCard);
    });
}

// Selecionar Mesa
function selecionarMesa(mesaId) {
    mesaSelecionadaId = mesaId;
    
    // Atualizar visual das mesas
    document.querySelectorAll('.mesa-card').forEach(card => {
        card.classList.remove('selecionada');
    });
    document.querySelector(`[data-mesa-id="${mesaId}"]`).classList.add('selecionada');

    // Atualizar informações da mesa
    const mesa = mesas.find(m => m.id === mesaId);
    document.getElementById('mesaSelecionada').textContent = `Mesa ${mesa.numero}`;
    
    const statusBadge = document.getElementById('statusMesa');
    statusBadge.textContent = mesa.ocupada ? 'Ocupada' : 'Vazia';
    statusBadge.className = `status-badge ${mesa.ocupada ? 'ocupada' : 'vazia'}`;

    // Renderizar itens da mesa
    renderizarItensMesa(mesaId);
    
    // Habilitar botões se mesa tiver pedidos
    const temPedidos = pedidosMesas[mesaId] && pedidosMesas[mesaId].length > 0;
    document.getElementById('btnFecharConta').disabled = !temPedidos;
    document.getElementById('btnLimparMesa').disabled = !temPedidos;
    
    // Limpar formulário
    limparFormulario();
}

// Renderizar Itens da Mesa Selecionada
function renderizarItensMesa(mesaId) {
    const itensContainer = document.getElementById('itensPedido');
    const pedidos = pedidosMesas[mesaId] || [];

    if (pedidos.length === 0) {
        itensContainer.innerHTML = `
            <div class="empty-state">
                <p>🍽️ Esta mesa não possui pedidos</p>
            </div>
        `;
        document.getElementById('totalMesa').textContent = 'R$ 0,00';
        return;
    }

    itensContainer.innerHTML = '';
    let total = 0;

    pedidos.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-pedido';
        itemDiv.innerHTML = `
            <div class="item-info">
                <h4>${item.nome}</h4>
                <div class="item-detalhes">
                    <span>Qtd: ${item.quantidade}</span>
                    <span>Unit: R$ ${item.preco.toFixed(2)}</span>
                </div>
            </div>
            <div class="item-valor">
                <div class="item-preco">R$ ${subtotal.toFixed(2)}</div>
            </div>
        `;
        itensContainer.appendChild(itemDiv);
    });

    document.getElementById('totalMesa').textContent = `R$ ${total.toFixed(2)}`;
}

// Setup Event Listeners
function setupEventListeners() {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Valor Pago - Calcular Troco
    const valorPagoInput = document.getElementById('valorPago');
    valorPagoInput.addEventListener('input', calcularTroco);

    // Forma de Pagamento - Mostrar/Esconder Troco
    const formaPagamentoSelect = document.getElementById('formaPagamento');
    formaPagamentoSelect.addEventListener('change', handleFormaPagamento);

    // Botão Fechar Conta
    const btnFecharConta = document.getElementById('btnFecharConta');
    btnFecharConta.addEventListener('click', fecharConta);

    // Botão Limpar Mesa
    const btnLimparMesa = document.getElementById('btnLimparMesa');
    btnLimparMesa.addEventListener('click', limparMesa);
}

// Calcular Troco
function calcularTroco() {
    const valorPago = parseFloat(document.getElementById('valorPago').value) || 0;
    const totalMesaText = document.getElementById('totalMesa').textContent;
    const totalMesa = parseFloat(totalMesaText.replace('R$ ', '').replace(',', '.')) || 0;
    const formaPagamento = document.getElementById('formaPagamento').value;

    if (formaPagamento === 'dinheiro' && valorPago > 0) {
        const troco = valorPago - totalMesa;
        document.getElementById('valorTroco').textContent = `R$ ${troco.toFixed(2)}`;
        
        if (troco < 0) {
            document.getElementById('valorTroco').style.color = 'var(--vermelho)';
        } else {
            document.getElementById('valorTroco').style.color = 'var(--verde)';
        }
    }
}

// Handle Mudança de Forma de Pagamento
function handleFormaPagamento() {
    const formaPagamento = document.getElementById('formaPagamento').value;
    const trocoInfo = document.getElementById('trocoInfo');

    if (formaPagamento === 'dinheiro') {
        trocoInfo.style.display = 'block';
        calcularTroco();
    } else {
        trocoInfo.style.display = 'none';
    }
}

// Fechar Conta
async function fecharConta() {
    if (!mesaSelecionadaId) {
        alert('Selecione uma mesa primeiro!');
        return;
    }

    const valorPago = parseFloat(document.getElementById('valorPago').value) || 0;
    const formaPagamento = document.getElementById('formaPagamento').value;
    const observacoes = document.getElementById('observacoes').value.trim();
    const totalMesaText = document.getElementById('totalMesa').textContent;
    const totalMesa = parseFloat(totalMesaText.replace('R$ ', '').replace(',', '.')) || 0;

    // Validações
    if (!formaPagamento) {
        alert('Selecione a forma de pagamento!');
        return;
    }

    if (valorPago <= 0) {
        alert('Informe o valor pago!');
        return;
    }

    if (valorPago < totalMesa) {
        const confirmar = confirm(`Valor pago (R$ ${valorPago.toFixed(2)}) é menor que o total (R$ ${totalMesa.toFixed(2)}). Deseja continuar mesmo assim?`);
        if (!confirmar) return;
    }

    // Preparar dados do fechamento
    const fechamento = {
        mesa: mesaSelecionadaId,
        itens: pedidosMesas[mesaSelecionadaId],
        total: totalMesa,
        valorPago: valorPago,
        formaPagamento: formaPagamento,
        troco: formaPagamento === 'dinheiro' ? (valorPago - totalMesa) : 0,
        observacoes: observacoes,
        dataHora: new Date().toISOString()
    };

    console.log('Fechamento de conta:', fechamento);

    // TODO: Enviar para API quando implementada
    // await fetch('/api/caixa/fechar-conta', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(fechamento)
    // });

    // Limpar mesa
    delete pedidosMesas[mesaSelecionadaId];
    const mesa = mesas.find(m => m.id === mesaSelecionadaId);
    mesa.ocupada = false;

    // Atualizar interface
    renderizarMesas();
    renderizarItensMesa(mesaSelecionadaId);
    limparFormulario();

    alert(`✅ Conta da Mesa ${mesaSelecionadaId} fechada com sucesso!\n\nTotal: R$ ${totalMesa.toFixed(2)}\nPago: R$ ${valorPago.toFixed(2)}\n${formaPagamento === 'dinheiro' ? `Troco: R$ ${(valorPago - totalMesa).toFixed(2)}` : ''}`);
    
    // Desabilitar botões
    document.getElementById('btnFecharConta').disabled = true;
    document.getElementById('btnLimparMesa').disabled = true;
}

// Limpar Mesa (sem fechar conta)
function limparMesa() {
    if (!mesaSelecionadaId) {
        alert('Selecione uma mesa primeiro!');
        return;
    }

    const confirmar = confirm(`⚠️ Tem certeza que deseja limpar a Mesa ${mesaSelecionadaId}?\n\nEsta ação irá remover todos os pedidos SEM registrar o pagamento!`);
    
    if (!confirmar) return;

    // Limpar pedidos
    delete pedidosMesas[mesaSelecionadaId];
    const mesa = mesas.find(m => m.id === mesaSelecionadaId);
    mesa.ocupada = false;

    // Atualizar interface
    renderizarMesas();
    renderizarItensMesa(mesaSelecionadaId);
    limparFormulario();

    alert(`🗑️ Mesa ${mesaSelecionadaId} limpa com sucesso!`);
    
    // Desabilitar botões
    document.getElementById('btnFecharConta').disabled = true;
    document.getElementById('btnLimparMesa').disabled = true;
}

// Limpar Formulário
function limparFormulario() {
    document.getElementById('valorPago').value = '';
    document.getElementById('formaPagamento').value = '';
    document.getElementById('observacoes').value = '';
    document.getElementById('trocoInfo').style.display = 'none';
}

// ===================================
// 2. Lógica de Dark Mode Refatorada
// ===================================

// Funções para gerenciar o estado e a UI
function aplicarTema(tema) {
    const body = document.body;
    body.setAttribute('data-theme', tema);

    // Atualiza o estado visual do botão/checkbox
    if (botaoDarkMode) {
        botaoDarkMode.checked = (tema === 'dark');
    }

}

function carregarTemaSalvo() {
    // A lógica original usava localStorage.getItem("modoEscuro")
    // Se você *precisa* manter a persistência entre sessões (mesmo com a nova lógica do seu prompt),
    // é melhor continuar usando localStorage. Se o seu novo requisito é usar *apenas* a variável de sessão (como no seu novo prompt),
    // esta lógica deve ser ajustada para usar window.darkModePreference.

    // A opção mais fiel ao código original (usando localStorage para persistência):
    const modoSalvo = localStorage.getItem("modoEscuro");
    
    // Converte o valor "true" ou "false" salvo para o tema 'dark' ou 'light'
    const temaInicial = (modoSalvo === "true") ? 'dark' : 'light';
    
    aplicarTema(temaInicial);
}

// Inicialização: Carrega o tema ao iniciar
carregarTemaSalvo();

// Adiciona o listener para a interação do usuário
if (botaoDarkMode) {
    botaoDarkMode.addEventListener('click', () => {
        const body = document.body;
        // Verifica o tema atual para determinar o próximo
        const isDark = body.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';

        // Aplica o novo tema (atualiza data-theme, logo e estado do botão)
        aplicarTema(newTheme);

        // Salva a preferência (mantendo a persistência da lógica original)
        // O valor salvo é 'true' ou 'false', compatível com a chave "modoEscuro"
        const escuro = (newTheme === 'dark');
        localStorage.setItem("modoEscuro", escuro);

        // Se você quiser seguir a risca o novo prompt (usando variável de sessão),
        // use: window.darkModePreference = newTheme;
    });
}
