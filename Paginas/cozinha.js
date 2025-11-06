// Variáveis Globais
let pedidos = [];
let filtroAtual = 'todos';
let tipoPagina = 'comidas'; // 'comidas' ou 'bebidas'

// Categorias de Comidas e Bebidas (baseado no cardápio)
const CATEGORIAS_COMIDAS = ['Lanches', 'Pratos', 'Porções', 'Sobremesas'];
const CATEGORIAS_BEBIDAS = ['Bebidas'];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    detectarTipoPagina();
    initCozinha();
    setupEventListeners();
    carregarDarkMode();
    iniciarAtualizacaoAutomatica();
});

// Detectar tipo de página (comidas ou bebidas)
function detectarTipoPagina() {
    tipoPagina = document.body.dataset.tipo === 'bebidas' ? 'bebidas' : 'comidas';
}

// Inicialização Principal
async function initCozinha() {
    try {
        await carregarPedidos();
        renderizarPedidos();
    } catch (error) {
        console.error('Erro ao inicializar cozinha:', error);
        simularPedidosIniciais(); // Fallback para demonstração
        renderizarPedidos();
    }
}

// Carregar Pedidos da API (PROVISÓRIO - será implementado)
async function carregarPedidos() {
    try {
        // TODO: Implementar quando houver API
        // const response = await fetch('/api/pedidos/pendentes');
        // pedidos = await response.json();
        
        // Por enquanto, usar dados simulados
        simularPedidosIniciais();
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        throw error;
    }
}

// Simular Pedidos Iniciais (PROVISÓRIO)
function simularPedidosIniciais() {
    const todosPedidos = [
        {
            id: 1,
            mesa: 1,
            dataHora: new Date(Date.now() - 5 * 60000).toISOString(), // 5 min atrás
            status: 'pendente',
            itens: [
                { id: 1, nome: 'X-Burger Clássico', quantidade: 2, categoria: 'Lanches' },
                { id: 2, nome: 'Batata Frita Grande', quantidade: 1, categoria: 'Porções' }
            ]
        },
        {
            id: 2,
            mesa: 1,
            dataHora: new Date(Date.now() - 5 * 60000).toISOString(),
            status: 'pendente',
            itens: [
                { id: 3, nome: 'Coca-Cola 350ml', quantidade: 2, categoria: 'Bebidas' },
                { id: 4, nome: 'Suco de Laranja', quantidade: 1, categoria: 'Bebidas' }
            ]
        },
        {
            id: 3,
            mesa: 3,
            dataHora: new Date(Date.now() - 10 * 60000).toISOString(), // 10 min atrás
            status: 'preparando',
            itens: [
                { id: 5, nome: 'Pizza Margherita', quantidade: 1, categoria: 'Pratos' },
                { id: 6, nome: 'Salada Caesar', quantidade: 1, categoria: 'Porções' }
            ]
        },
        {
            id: 4,
            mesa: 3,
            dataHora: new Date(Date.now() - 10 * 60000).toISOString(),
            status: 'pendente',
            itens: [
                { id: 7, nome: 'Suco Natural Laranja', quantidade: 2, categoria: 'Bebidas' }
            ]
        },
        {
            id: 5,
            mesa: 5,
            dataHora: new Date(Date.now() - 2 * 60000).toISOString(), // 2 min atrás
            status: 'pendente',
            itens: [
                { id: 8, nome: 'Filé com Fritas', quantidade: 1, categoria: 'Pratos' },
                { id: 9, nome: 'Pudim', quantidade: 1, categoria: 'Sobremesas' }
            ]
        },
        {
            id: 6,
            mesa: 5,
            dataHora: new Date(Date.now() - 2 * 60000).toISOString(),
            status: 'preparando',
            itens: [
                { id: 10, nome: 'Água Mineral 500ml', quantidade: 1, categoria: 'Bebidas' },
                { id: 11, nome: 'Refrigerante Lata', quantidade: 2, categoria: 'Bebidas' }
            ]
        },
        {
            id: 7,
            mesa: 4,
            dataHora: new Date(Date.now() - 8 * 60000).toISOString(),
            status: 'preparando',
            itens: [
                { id: 12, nome: 'Espetinho Misto', quantidade: 4, categoria: 'Porções' }
            ]
        },
        {
            id: 8,
            mesa: 6,
            dataHora: new Date(Date.now() - 1 * 60000).toISOString(),
            status: 'pendente',
            itens: [
                { id: 13, nome: 'Caipirinha', quantidade: 2, categoria: 'Bebidas' },
                { id: 14, nome: 'Mojito', quantidade: 1, categoria: 'Bebidas' }
            ]
        },
        {
            id: 9,
            mesa: 2,
            dataHora: new Date(Date.now() - 7 * 60000).toISOString(),
            status: 'preparando',
            itens: [
                { id: 15, nome: 'Hambúrguer Vegetariano', quantidade: 1, categoria: 'Lanches' }
            ]
        },
        {
            id: 10,
            mesa: 7,
            dataHora: new Date(Date.now() - 3 * 60000).toISOString(),
            status: 'pendente',
            itens: [
                { id: 16, nome: 'Cerveja Lata', quantidade: 3, categoria: 'Bebidas' }
            ]
        },
        {
            id: 11,
            mesa: 7,
            dataHora: new Date(Date.now() - 3 * 60000).toISOString(),
            status: 'pendente',
            itens: [
                { id: 16, nome: 'Cerveja Lata', quantidade: 3, categoria: 'Bebidas' }
            ]
        },
        {
            id: 12,
            mesa: 7,
            dataHora: new Date(Date.now() - 3 * 60000).toISOString(),
            status: 'pendente',
            itens: [
                { id: 16, nome: 'Cerveja Lata', quantidade: 3, categoria: 'Bebidas' }
            ]
        },
        {
            id: 13,
            mesa: 8,
            dataHora: new Date(Date.now() - 3 * 60000).toISOString(),
            status: 'pendente',
            itens: [
                { id: 16, nome: 'Cerveja Lata', quantidade: 3, categoria: 'Bebidas' }
            ]
        },
        {
            id: 14,
            mesa: 9,
            dataHora: new Date(Date.now() - 3 * 60000).toISOString(),
            status: 'pendente',
            itens: [
                { id: 16, nome: 'Cerveja Lata', quantidade: 3, categoria: 'Bebidas' }
            ]
        },
        {
            id: 115,
            mesa: 71,
            dataHora: new Date(Date.now() - 3 * 60000).toISOString(),
            status: 'pendente',
            itens: [
                { id: 16, nome: 'Cerveja Lata', quantidade: 3, categoria: 'Bebidas' }
            ]
        },
        {
            id: 1062,
            mesa: 7841,
            dataHora: new Date(Date.now() - 3 * 60000).toISOString(),
            status: 'pendente',
            itens: [
                { id: 16, nome: 'Cerveja Lata', quantidade: 3, categoria: 'Bebidas' }
            ]
        }
    ];

    // Filtrar apenas pedidos pendentes e preparando
    const pedidosAtivos = todosPedidos.filter(p => 
        p.status === 'pendente' || p.status === 'preparando'
    );

    // Filtrar pedidos baseado no tipo de página
    pedidos = filtrarPedidosPorTipo(pedidosAtivos);
}

// Filtrar pedidos por tipo (comidas ou bebidas)
function filtrarPedidosPorTipo(todosPedidos) {
    const categoriasAlvo = tipoPagina === 'comidas' ? CATEGORIAS_COMIDAS : CATEGORIAS_BEBIDAS;
    
    return todosPedidos.map(pedido => {
        const itensFiltrados = pedido.itens.filter(item => 
            categoriasAlvo.includes(item.categoria)
        );

        if (itensFiltrados.length > 0) {
            return { ...pedido, itens: itensFiltrados };
        }
        return null;
    }).filter(p => p !== null);
}

// Setup Event Listeners
function setupEventListeners() {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Filtros
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filtroAtual = e.target.dataset.filtro;
            renderizarPedidos();
        });
    });

    // Click fora do modal fecha
    document.getElementById('modalPedido').addEventListener('click', (e) => {
        if (e.target.id === 'modalPedido') {
            fecharModal();
        }
    });
}

// Renderizar Pedidos
function renderizarPedidos() {
    const container = document.getElementById('pedidosGrid');
    const emptyState = document.getElementById('emptyState');

    // Aplicar filtro
    let pedidosFiltrados = pedidos;
    if (filtroAtual !== 'todos') {
        pedidosFiltrados = pedidos.filter(p => p.status === filtroAtual);
    }

    if (pedidosFiltrados.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'flex';
        atualizarContador(0);
        return;
    }

    emptyState.style.display = 'none';
    container.innerHTML = '';

    pedidosFiltrados.forEach(pedido => {
        const card = criarCardPedido(pedido);
        container.appendChild(card);
    });

    atualizarContador(pedidosFiltrados.length);
}

// Criar Card de Pedido
function criarCardPedido(pedido) {
    const card = document.createElement('div');
    card.className = `pedido-card ${pedido.status}`;
    card.dataset.pedidoId = pedido.id;

    const tempo = calcularTempo(pedido.dataHora);
    const statusTexto = {
        'pendente': 'Pendente',
        'preparando': 'Preparando',
        'pronto': 'Pronto'
    }[pedido.status];

    const statusIcon = {
        'pendente': '⏳',
        'preparando': '👨‍🍳',
        'pronto': '✅'
    }[pedido.status];

    card.innerHTML = `
        <div class="pedido-header">
            <span class="pedido-mesa">Mesa ${pedido.mesa}</span>
            <span class="pedido-status ${pedido.status}">${statusIcon} ${statusTexto}</span>
        </div>
        
        <div class="pedido-tempo">
            ⏱️ ${tempo}
        </div>
        
        <div class="pedido-itens">
            ${pedido.itens.map(item => `
                <div class="item-resumo">
                    <span class="item-nome">${item.nome}</span>
                    <span class="item-qtd">${item.quantidade}x</span>
                </div>
            `).join('')}
        </div>
        
        <div class="pedido-acoes">
            ${pedido.status === 'pendente' ? `
                <button class="btn-acao btn-preparar" onclick="mudarStatus(${pedido.id}, 'preparando')">
                    👨‍🍳 Preparar
                </button>
            ` : ''}
            ${pedido.status === 'preparando' ? `
                <button class="btn-acao btn-finalizar" onclick="mudarStatus(${pedido.id}, 'pronto')">
                    ✅ Finalizar
                </button>
            ` : ''}
            <button class="btn-acao btn-detalhes" onclick="abrirModal(${pedido.id})">
                👁️ Detalhes
            </button>
        </div>
    `;

    return card;
}

// Calcular Tempo Decorrido
function calcularTempo(dataHora) {
    const agora = new Date();
    const pedidoData = new Date(dataHora);
    const diffMs = agora - pedidoData;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Agora';
    if (diffMins === 1) return '1 minuto';
    if (diffMins < 60) return `${diffMins} minutos`;
    
    const diffHoras = Math.floor(diffMins / 60);
    const restMins = diffMins % 60;
    return `${diffHoras}h ${restMins}min`;
}

// Mudar Status do Pedido
function mudarStatus(pedidoId, novoStatus) {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) return;

    // Se mudar para 'pronto', remover da lista (será enviado para outra página)
    if (novoStatus === 'pronto') {
        // TODO: Enviar para API de pedidos finalizados
        console.log(`Pedido ${pedidoId} finalizado e será movido para outra página`);
        
        // Remover da lista atual
        pedidos = pedidos.filter(p => p.id !== pedidoId);
        
        // Feedback visual
        mostrarNotificacao(`✅ Pedido Mesa ${pedido.mesa} finalizado!`);
    } else {
        pedido.status = novoStatus;
        
        // TODO: Enviar para API
        console.log(`Pedido ${pedidoId} mudou para: ${novoStatus}`);
        
        // Feedback visual
        mostrarNotificacao(`👨‍🍳 Pedido Mesa ${pedido.mesa} em preparo!`);
    }

    renderizarPedidos();
}

// Atualizar Contador
function atualizarContador(total) {
    document.getElementById('contadorPedidos').textContent = total;
}

// Abrir Modal de Detalhes
function abrirModal(pedidoId) {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) return;

    const modal = document.getElementById('modalPedido');
    const modalBody = document.getElementById('modalBody');

    const statusTexto = {
        'pendente': 'Pendente',
        'preparando': 'Em Preparo',
        'pronto': 'Pronto'
    }[pedido.status];

    const tipoTexto = tipoPagina === 'comidas' ? 'Comidas' : 'Bebidas';

    modalBody.innerHTML = `
        <div class="modal-info">
            <div class="info-row">
                <span class="info-label">Mesa:</span>
                <span class="info-value">Mesa ${pedido.mesa}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Tipo:</span>
                <span class="info-value">${tipoTexto}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value">${statusTexto}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Horário:</span>
                <span class="info-value">${new Date(pedido.dataHora).toLocaleTimeString('pt-BR')}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Tempo:</span>
                <span class="info-value">${calcularTempo(pedido.dataHora)}</span>
            </div>
        </div>

        <div class="modal-itens">
            <h4>📋 Itens do Pedido</h4>
            ${pedido.itens.map(item => `
                <div class="modal-item">
                    <div class="modal-item-info">
                        <h5>${item.nome}</h5>
                        <div class="modal-item-detalhes">
                            Categoria: ${item.categoria}
                        </div>
                    </div>
                    <div class="modal-item-qtd">
                        <span class="item-qtd">${item.quantidade}x</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    modal.style.display = 'flex';
}

// Fechar Modal
function fecharModal() {
    document.getElementById('modalPedido').style.display = 'none';
}

// Mostrar Notificação
function mostrarNotificacao(mensagem) {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--pronto);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;
    notif.textContent = mensagem;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Atualização Automática
function iniciarAtualizacaoAutomatica() {
    // Atualizar a cada 30 segundos
    setInterval(async () => {
        await carregarPedidos();
        renderizarPedidos();
    }, 30000);
}

// Dark Mode
function toggleDarkMode() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    
    const icon = document.getElementById('darkModeToggle');
    icon.textContent = isDark ? '🌙' : '☀️';
    
    window.darkModePreference = newTheme;
}

function carregarDarkMode() {
    const savedTheme = window.darkModePreference || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    const icon = document.getElementById('darkModeToggle');
    icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}