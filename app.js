class MijeApp {
    constructor() {
        this.dbKey = 'mije_ultimate_data';
        
        // Estado inicial combinando V3 e V2 (Ultimate)
        const initialState = {
            onboardingDone: false,
            gestor: { nome: '', foto: '' },
            perfis: [],
            receitas: [],
            despesasCorrentes: [],
            despesasFixas: [],
            investimentos: [],
            pedidos: [],
            alimentacao: [],
            remedios: [],
            limpeza: [],
            reparacoes: []
        };

        this.data = JSON.parse(localStorage.getItem(this.dbKey)) || initialState;
        
        // Migração de versões antigas se necessário
        if(!this.data.remedios) this.data.remedios = [];
        if(!this.data.limpeza) this.data.limpeza = [];

        this.tempIncome = [];
        this.tempPeople = [];
        this.activeTab = 'dashboard';
        
        // Configuração Central (Vindo do Mije 2.0) para gerar menus e formulários
        this.config = this.getSystemConfig();
    }

    // --- CONFIGURAÇÃO CENTRAL ---
    getSystemConfig() {
        return {
            tabs: [
                { id: 'dashboard', label: 'Visão Geral', icon: 'layout-dashboard', color: 'text-blue-600', bg: 'bg-blue-100' },
                { id: 'perfis', label: 'Pessoas', icon: 'users', color: 'text-indigo-600', bg: 'bg-indigo-100' },
                { id: 'pedidos', label: 'Pedidos $', icon: 'hand-coins', color: 'text-violet-600', bg: 'bg-violet-100' },
                { id: 'receitas', label: 'Receitas', icon: 'trending-up', color: 'text-emerald-600', bg: 'bg-emerald-100' },
                { id: 'despesasCorrentes', label: 'Dia-a-Dia', icon: 'shopping-bag', color: 'text-orange-600', bg: 'bg-orange-100' },
                { id: 'despesasFixas', label: 'Contas Fixas', icon: 'lock', color: 'text-rose-600', bg: 'bg-rose-100' },
                { id: 'investimentos', label: 'Investir', icon: 'bar-chart-3', color: 'text-cyan-600', bg: 'bg-cyan-100' },
                { id: 'alimentacao', label: 'Menu/Comida', icon: 'utensils', color: 'text-amber-600', bg: 'bg-amber-100' },
                { id: 'remedios', label: 'Farmácia', icon: 'pill', color: 'text-pink-600', bg: 'bg-pink-100' },
                { id: 'limpeza', label: 'Limpeza', icon: 'sparkles', color: 'text-teal-600', bg: 'bg-teal-100' },
                { id: 'reparacoes', label: 'Manutenção', icon: 'hammer', color: 'text-slate-600', bg: 'bg-slate-200' }
            ],
            forms: {
                perfil: { title: 'Novo Membro', fields: [
                    { name: 'nome', label: 'Nome Completo', type: 'text', icon: 'user' },
                    { name: 'tipo', label: 'Relação', type: 'select', options: ['Familia Nuclear', 'Parente', 'Amigo', 'Funcionário'] },
                    { name: 'photo_trigger', label: 'Foto', type: 'photo' } 
                ]},
                pedido: { title: 'Novo Pedido', fields: [
                    { name: 'pessoa', label: 'Quem pediu?', type: 'select-dynamic', source: 'perfis', icon: 'user-check' }, 
                    { name: 'valor', label: 'Valor (Kz)', type: 'number', icon: 'banknote' },
                    { name: 'motivo', label: 'Motivo', type: 'text', icon: 'help-circle' },
                    { name: 'status', label: 'Estado', type: 'select', options: ['Pendente', 'Aprovado', 'Recusado', 'Pago'] }
                ]},
                receita: { title: 'Nova Receita', fields: [
                    { name: 'descricao', label: 'Fonte', type: 'text', icon: 'file-text' },
                    { name: 'valor', label: 'Valor (Kz)', type: 'number', icon: 'banknote' },
                    { name: 'categoria', label: 'Tipo', type: 'select', options: ['Salário', 'Extra', 'Negócio'] }
                ]},
                despesaCorrente: { title: 'Gasto Diário', fields: [
                    { name: 'descricao', label: 'Item/Serviço', type: 'text', icon: 'shopping-cart' },
                    { name: 'valor', label: 'Valor (Kz)', type: 'number', icon: 'banknote' },
                    { name: 'categoria', label: 'Categoria', type: 'select', options: ['Supermercado', 'Transporte', 'Lazer', 'Outros'] }
                ]},
                despesaFixa: { title: 'Conta Fixa', fields: [
                    { name: 'descricao', label: 'Nome da Conta', type: 'text', icon: 'file-text' },
                    { name: 'valor', label: 'Valor Aproximado', type: 'number', icon: 'banknote' },
                    { name: 'vencimento', label: 'Dia do Vencimento', type: 'number', icon: 'calendar' }
                ]},
                investimento: { title: 'Investimento', fields: [
                    { name: 'nome', label: 'Onde?', type: 'text', icon: 'trending-up' },
                    { name: 'valor', label: 'Valor', type: 'number', icon: 'banknote' },
                    { name: 'categoria', label: 'Tipo', type: 'select', options: ['Poupança', 'Negócio', 'Imóvel', 'Dólar/Euro'] }
                ]},
                alimentacao: { title: 'Refeição/Menu', fields: [
                    { name: 'titulo', label: 'Dia/Refeição', type: 'text', icon: 'calendar' },
                    { name: 'descricao', label: 'Pratos', type: 'textarea', icon: 'align-left' }
                ]},
                remedio: { title: 'Medicamento', fields: [
                    { name: 'nome', label: 'Nome', type: 'text', icon: 'pill' },
                    { name: 'valor', label: 'Preço (se souber)', type: 'number', icon: 'banknote' },
                    { name: 'status', label: 'Estado', type: 'select', options: ['Comprar', 'Comprado'] }
                ]},
                limpeza: { title: 'Item de Limpeza', fields: [
                    { name: 'nome', label: 'Produto', type: 'text', icon: 'sparkles' },
                    { name: 'quantidade', label: 'Quantidade', type: 'number', icon: 'hash' },
                    { name: 'status', label: 'Estado', type: 'select', options: ['Falta', 'Comprado'] }
                ]},
                reparacao: { title: 'Manutenção Casa', fields: [
                    { name: 'descricao', label: 'O que estragou?', type: 'text', icon: 'alert-triangle' },
                    { name: 'local', label: 'Cômodo', type: 'text', icon: 'home' },
                    { name: 'prioridade', label: 'Urgência', type: 'select', options: ['Baixa', 'Média', 'Alta'] }
                ]}
            }
        };
    }

    init() {
        if (!this.data.onboardingDone) {
            document.getElementById('onboarding-screen').classList.remove('hidden');
            document.getElementById('onboarding-screen').classList.add('flex');
        } else {
            this.renderApp();
        }
        this.initListeners();
        lucide.createIcons();
    }

    initListeners() {
        // Forms
        document.getElementById('modal-form').addEventListener('submit', (e) => this.handleSave(e));
        document.getElementById('btn-close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('btn-close-profile').addEventListener('click', () => document.getElementById('profile-modal').classList.add('hidden'));

        // Mobile Nav & Menu
        document.getElementById('nav-dashboard').addEventListener('click', () => this.setTab('dashboard'));
        document.getElementById('nav-perfis').addEventListener('click', () => this.setTab('perfis'));
        document.getElementById('nav-gastos').addEventListener('click', () => this.setTab('despesasCorrentes'));
        document.getElementById('nav-menu').addEventListener('click', () => this.toggleMobileMenu());
        document.getElementById('close-mobile-menu').addEventListener('click', () => this.toggleMobileMenu());
        
        // Actions
        document.getElementById('btn-new-mobile').addEventListener('click', () => this.openModal(this.activeTab === 'dashboard' ? 'pedido' : this.activeTab));
        document.getElementById('btn-whatsapp').addEventListener('click', () => this.shareWhatsapp());
        
        // Sidebar Actions
        document.getElementById('btn-export').addEventListener('click', () => this.exportData());
        document.getElementById('btn-export-mobile').addEventListener('click', () => this.exportData());
        document.getElementById('btn-reset').addEventListener('click', () => this.resetApp());
        document.getElementById('btn-reset-mobile').addEventListener('click', () => this.resetApp());

        // Onboarding
        document.getElementById('gestor-photo').addEventListener('change', (e) => this.handlePhotoUpload(e.target, 'preview-gestor'));
        document.getElementById('person-photo').addEventListener('change', (e) => this.handlePhotoUpload(e.target, 'preview-person'));
        document.getElementById('btn-next-1').addEventListener('click', () => this.nextStep(1));
        document.getElementById('btn-next-2').addEventListener('click', () => this.nextStep(2));
        document.getElementById('btn-add-income').addEventListener('click', () => this.addIncomeOnboard());
        document.getElementById('btn-add-person').addEventListener('click', () => this.addPersonOnboard());
        document.getElementById('btn-finish-onboard').addEventListener('click', () => this.finishOnboarding());

        // Expor funções para HTML inline (usado nos botões gerados dinamicamente)
        window.openModal = (t) => this.openModal(t);
        window.deleteItem = (cat, id) => this.deleteItem(cat, id);
        window.showProfileHistory = (id) => this.showProfileHistory(id);
        window.setTab = (t) => this.setTab(t);
    }

    // --- PHOTO LOGIC ---
    handlePhotoUpload(input, previewId) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const scale = 150 / Math.max(img.width, img.height);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const compressedData = canvas.toDataURL('image/jpeg', 0.7);
                    
                    const preview = document.getElementById(previewId);
                    preview.style.backgroundImage = `url(${compressedData})`;
                    preview.style.backgroundSize = 'cover';
                    preview.dataset.base64 = compressedData;
                };
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    // --- ONBOARDING ---
    nextStep(current) {
        if (current === 1) {
            const nome = document.getElementById('gestor-name').value;
            if (!nome) return alert('Por favor, diga o seu nome.');
            const fotoElem = document.getElementById('preview-gestor');
            this.data.gestor.nome = nome;
            this.data.gestor.foto = fotoElem.dataset.base64 || '';
            document.getElementById('step-1').classList.add('hidden');
            document.getElementById('step-2').classList.remove('hidden');
        } else if (current === 2) {
            if (this.tempIncome.length === 0 && !confirm('Continuar sem definir rendas?')) return;
            document.getElementById('step-2').classList.add('hidden');
            document.getElementById('step-3').classList.remove('hidden');
        }
    }

    addIncomeOnboard() {
        const desc = document.getElementById('income-desc').value;
        const val = document.getElementById('income-val').value;
        if(desc && val) {
            this.tempIncome.push({ descricao: desc, valor: val, categoria: 'Fixa', id: Date.now() });
            document.getElementById('income-desc').value = '';
            document.getElementById('income-val').value = '';
            this.renderIncomeList();
        }
    }

    renderIncomeList() {
        document.getElementById('income-list').innerHTML = this.tempIncome.map(i => `
            <div class="flex justify-between bg-emerald-50 p-3 rounded-lg text-emerald-800">
                <span>${i.descricao}</span><span class="font-bold">${this.formatKz(i.valor)}</span>
            </div>`).join('');
    }

    addPersonOnboard() {
        const name = document.getElementById('person-name').value;
        const photoElem = document.getElementById('preview-person');
        if(name) {
            this.tempPeople.push({ id: Date.now(), nome: name, foto: photoElem.dataset.base64 || '', tipo: 'Membro' });
            document.getElementById('person-name').value = '';
            photoElem.style.backgroundImage = '';
            delete photoElem.dataset.base64;
            this.renderPeopleListOnboard();
        }
    }

    renderPeopleListOnboard() {
        document.getElementById('people-list-onboard').innerHTML = this.tempPeople.map(p => `
            <div class="flex flex-col items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div class="w-10 h-10 rounded-full bg-slate-200 bg-cover bg-center mb-1" style="background-image: url('${p.foto || ''}')"></div>
                <span class="text-xs font-bold truncate w-full text-center">${p.nome}</span>
            </div>`).join('');
    }

    finishOnboarding() {
        this.data.receitas = [...this.tempIncome];
        this.data.perfis = [...this.tempPeople];
        this.data.onboardingDone = true;
        this.save();
        location.reload();
    }

    // --- MAIN APP ---
    renderApp() {
        document.getElementById('app-container').classList.remove('hidden');
        const avatarStyle = this.data.gestor.foto ? `background-image: url('${this.data.gestor.foto}')` : '';
        document.getElementById('sidebar-avatar').style = avatarStyle;
        document.getElementById('mobile-avatar').style = avatarStyle;
        document.getElementById('sidebar-role').innerText = this.data.gestor.nome;

        this.renderDesktopNav();
        this.renderMobileMenuGrid();
        this.renderContent();
    }

    renderDesktopNav() {
        const navHTML = this.config.tabs.map(tab => `
            <button onclick="setTab('${tab.id}')" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${this.activeTab === tab.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}">
                <i data-lucide="${tab.icon}" class="w-5 h-5 ${this.activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}"></i>
                <span>${tab.label}</span>
            </button>`).join('');
        document.getElementById('desktop-nav').innerHTML = navHTML;
    }

    renderMobileMenuGrid() {
        const mobileHTML = this.config.tabs.map(tab => `
            <button onclick="setTab('${tab.id}'); document.getElementById('mobile-menu-overlay').classList.add('hidden')" class="flex flex-col items-center gap-2 p-2 rounded-xl active:scale-95 transition">
                <div class="p-3 rounded-full ${tab.bg} ${tab.color}"><i data-lucide="${tab.icon}" class="w-6 h-6"></i></div>
                <span class="text-[10px] font-bold text-slate-600 leading-tight text-center">${tab.label}</span>
            </button>`).join('');
        document.getElementById('mobile-menu-grid').innerHTML = mobileHTML;
    }

    setTab(tab) {
        this.activeTab = tab;
        this.renderDesktopNav();
        // Atualiza UI mobile
        const mobileIds = { dashboard: 'nav-dashboard', perfis: 'nav-perfis', despesasCorrentes: 'nav-gastos' };
        Object.keys(mobileIds).forEach(key => {
            const el = document.getElementById(mobileIds[key]);
            if(el) {
                if(key === tab) el.classList.replace('text-slate-400', 'text-blue-600');
                else el.classList.replace('text-blue-600', 'text-slate-400');
            }
        });
        
        // Se a tab não estiver na barra inferior principal, ilumina o "Mais"
        const navMenu = document.getElementById('nav-menu');
        if (!mobileIds[tab]) navMenu.classList.replace('text-slate-400', 'text-blue-600');
        else navMenu.classList.replace('text-blue-600', 'text-slate-400');

        this.renderContent();
    }

    renderContent() {
        const container = document.getElementById('content');
        if (this.activeTab === 'dashboard') this.renderDashboard(container);
        else if (this.activeTab === 'perfis') this.renderProfiles(container);
        else this.renderGenericList(container);
        lucide.createIcons();
    }

    renderDashboard(container) {
        const { receitas, despesasFixas, despesasCorrentes, investimentos, pedidos } = this.data;
        const totalReceitas = receitas.reduce((a, b) => a + Number(b.valor), 0);
        const totalDespesas = [...despesasFixas, ...despesasCorrentes].reduce((a, b) => a + Number(b.valor), 0);
        const totalInvest = investimentos.reduce((a, b) => a + Number(b.valor), 0);
        const totalPedidos = pedidos.filter(p => p.status === 'Pago' || p.status === 'Aprovado').reduce((a, b) => a + Number(b.valor), 0);
        const saldo = totalReceitas - totalDespesas - totalInvest - totalPedidos;

        // Top 3 Pedintes
        const topRequesters = {};
        pedidos.forEach(p => { if(p.status === 'Aprovado' || p.status === 'Pago') topRequesters[p.pessoa] = (topRequesters[p.pessoa] || 0) + Number(p.valor); });
        const topList = Object.entries(topRequesters).sort((a,b) => b[1] - a[1]).slice(0,3);

        container.innerHTML = `
            <div class="mb-8">
                <p class="text-slate-400 text-sm">Olá, ${this.data.gestor.nome}</p>
                <div class="flex justify-between items-end">
                    <h2 class="text-3xl font-black text-slate-800">Visão Geral</h2>
                    <div class="text-right">
                        <p class="text-xs font-bold text-slate-400 uppercase">Disponível</p>
                        <p class="text-xl md:text-2xl font-black ${saldo >= 0 ? 'text-blue-600' : 'text-rose-500'}">${this.formatKz(saldo)}</p>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                ${this.card('Receitas', totalReceitas, 'bg-emerald-500', 'trending-up')}
                ${this.card('Despesas', totalDespesas, 'bg-rose-500', 'arrow-down')}
                ${this.card('Pedidos', totalPedidos, 'bg-violet-500', 'hand-coins')}
                ${this.card('Investido', totalInvest, 'bg-cyan-600', 'pie-chart')}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 class="font-bold mb-4 flex items-center gap-2 text-slate-700"><i data-lucide="crown" class="w-4 h-4 text-amber-500"></i> Top Gastadores</h3>
                    ${topList.length === 0 ? '<p class="text-slate-400 text-sm">Sem dados.</p>' : 
                        topList.map(([name, val]) => `
                        <div class="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                            <span class="font-medium text-slate-600">${name}</span>
                            <span class="font-bold text-slate-800">${this.formatKz(val)}</span>
                        </div>`).join('')
                    }
                 </div>
                 <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <button onclick="openModal('pedido')" class="w-full bg-blue-50 text-blue-700 py-3 rounded-xl font-bold mb-3 flex items-center justify-center gap-2"><i data-lucide="plus"></i> Novo Pedido</button>
                    <button onclick="openModal('despesaCorrente')" class="w-full bg-orange-50 text-orange-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2"><i data-lucide="shopping-cart"></i> Gasto Rápido</button>
                 </div>
            </div>
        `;
    }

    card(label, value, color, icon) {
        return `<div class="${color} text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <i data-lucide="${icon}" class="absolute -right-2 -bottom-2 w-16 h-16 opacity-20"></i>
            <p class="text-xs font-bold uppercase opacity-80">${label}</p>
            <p class="text-2xl font-black mt-1 tracking-tight">${this.formatKz(value)}</p>
        </div>`;
    }

    renderProfiles(container) {
        container.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-black text-slate-800">Família & Pessoas</h2>
                <button onclick="openModal('perfil')" class="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex gap-2"><i data-lucide="plus" class="w-4 h-4"></i> Novo</button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${this.data.perfis.map(p => `
                    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col items-center text-center relative group">
                        <button onclick="event.stopPropagation(); deleteItem('perfis', ${p.id})" class="absolute top-2 right-2 text-slate-300 hover:text-rose-500 bg-white rounded-full p-1"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                        <div onclick="showProfileHistory(${p.id})" class="w-full flex flex-col items-center">
                            <div class="w-20 h-20 rounded-full bg-slate-100 mb-3 bg-cover bg-center border-4 border-white shadow-sm flex items-center justify-center text-xl font-bold text-slate-400" style="background-image: url('${p.foto || ''}')">
                                ${!p.foto ? p.nome.charAt(0).toUpperCase() : ''}
                            </div>
                            <h3 class="font-bold text-slate-800 leading-tight">${p.nome}</h3>
                            <p class="text-xs text-slate-400 mt-1">${p.tipo}</p>
                        </div>
                    </div>
                `).join('')}
            </div>`;
    }

    renderGenericList(container) {
        const items = this.data[this.activeTab] || [];
        const config = this.config.tabs.find(t => t.id === this.activeTab);
        const singular = this.activeTab.replace(/s$/, '').replace(/es$/, ''); 
        
        // Descobrir qual campo usar como título principal (variável no V2, unificada aqui)
        const titleKey = items.length > 0 ? (items[0].descricao ? 'descricao' : items[0].nome ? 'nome' : items[0].titulo ? 'titulo' : 'pessoa') : 'descricao';

        container.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-black text-slate-800 flex items-center gap-2"><i data-lucide="${config.icon}" class="${config.color}"></i> ${config.label}</h2>
                <button onclick="openModal('${this.activeTab === 'pedidos' ? 'pedido' : this.activeTab.replace(/s$/,'').replace(/es$/,'')}')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex gap-2"><i data-lucide="plus" class="w-4 h-4"></i> Adicionar</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                ${items.map(i => `
                    <div class="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                        <div class="flex-1 pr-2">
                            <p class="font-bold text-slate-800 truncate">${i[titleKey] || i.pessoa}</p>
                            <div class="flex gap-2 text-xs text-slate-500 mt-1">
                                ${i.valor ? `<span>${this.formatKz(i.valor)}</span>` : ''}
                                ${i.status ? `<span class="bg-slate-100 px-1 rounded">${i.status}</span>` : ''}
                                ${i.quantidade ? `<span>Qtd: ${i.quantidade}</span>` : ''}
                            </div>
                        </div>
                        <button onclick="deleteItem('${this.activeTab}', ${i.id})" class="text-slate-300 hover:text-rose-500"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                `).join('')}
            </div>
            ${items.length === 0 ? '<div class="text-center py-10 text-slate-400 bg-slate-50 rounded-xl">Lista vazia.</div>' : ''}
        `;
    }

    // --- MODAL DETALHE PERFIL ---
    showProfileHistory(id) {
        const p = this.data.perfis.find(x => x.id === id);
        if(!p) return;
        document.getElementById('profile-detail-name').innerText = p.nome;
        document.getElementById('profile-detail-type').innerText = p.tipo;
        
        const imgDiv = document.getElementById('profile-detail-img');
        if(p.foto) { imgDiv.style.backgroundImage = `url('${p.foto}')`; imgDiv.innerText = ''; }
        else { imgDiv.style.backgroundImage = ''; imgDiv.innerText = p.nome.charAt(0).toUpperCase(); }

        const history = this.data.pedidos.filter(req => req.pessoa === p.nome);
        const total = history.filter(h => h.status === 'Aprovado' || h.status === 'Pago').reduce((a,b) => a + Number(b.valor), 0);
        const denied = history.filter(h => h.status === 'Recusado').length;
        document.getElementById('profile-detail-total').innerText = this.formatKz(total);
        document.getElementById('profile-detail-denied').innerText = denied;

        const list = document.getElementById('profile-history-list');
        list.innerHTML = history.length === 0 ? '<p class="text-center text-slate-400 py-4">Sem histórico.</p>' : 
            history.reverse().map(h => `
                <div class="bg-white p-3 rounded-lg border border-slate-100 flex justify-between items-center text-sm">
                    <div><p class="font-bold text-slate-700">${h.motivo}</p><p class="text-[10px] text-slate-400">${new Date(h.id).toLocaleDateString()}</p></div>
                    <div class="text-right"><p class="font-bold">${this.formatKz(h.valor)}</p><p class="text-[10px] ${h.status === 'Recusado' ? 'text-rose-500' : 'text-emerald-500'}">${h.status}</p></div>
                </div>`).join('');
        document.getElementById('profile-modal').classList.remove('hidden');
    }

    // --- FORMS & DATA HANDLER ---
    openModal(type) {
        // Normalização de chaves para o Config
        const key = type.replace(/s$/, '').replace(/es$/, ''); // Ex: investimentos -> investimento
        // Fallback manual para exceções
        const formKey = (type === 'despesasCorrentes' ? 'despesaCorrente' : (type === 'despesasFixas' ? 'despesaFixa' : (type === 'pedidos' ? 'pedido' : type === 'remedios' ? 'remedio' : type === 'reparacoes' ? 'reparacao' : key)));
        
        const config = this.config.forms[formKey];
        if(!config) return console.error('Form config not found for', type);

        document.getElementById('modal-title').innerText = config.title;
        document.getElementById('modal-form').dataset.type = formKey; // Importante para salvar no lugar certo

        const fields = config.fields.map(f => {
            let input = '';
            if(f.type === 'select-dynamic' && f.source === 'perfis') {
                const opts = this.data.perfis.map(p => `<option value="${p.nome}">${p.nome}</option>`).join('');
                input = this.data.perfis.length ? `<select name="${f.name}" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">${opts}</select>` : `<div class="p-3 text-rose-500 text-xs bg-rose-50 rounded-xl">Adicione uma pessoa primeiro na aba Pessoas.</div>`;
            } else if(f.type === 'select') {
                input = `<select name="${f.name}" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">${f.options.map(o => `<option value="${o}">${o}</option>`).join('')}</select>`;
            } else if(f.type === 'photo') {
                input = `<div class="text-center"><input type="file" id="new-profile-photo" accept="image/*" class="hidden"><label for="new-profile-photo" id="preview-new" class="inline-block w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed photo-upload-zone cursor-pointer bg-cover bg-center"></label></div>`;
            } else if(f.type === 'textarea') {
                input = `<textarea name="${f.name}" rows="3" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"></textarea>`;
            } else {
                input = `<input type="${f.type}" name="${f.name}" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="${f.label}">`;
            }
            return f.type === 'photo' ? input : `<div class="mb-3"><label class="text-xs font-bold text-slate-400 uppercase mb-1 block">${f.label}</label>${input}</div>`;
        }).join('');

        document.getElementById('form-fields').innerHTML = fields;
        document.getElementById('modal').classList.remove('hidden');

        // Reattach listener foto se existir
        const newPhoto = document.getElementById('new-profile-photo');
        if(newPhoto) newPhoto.addEventListener('change', (e) => this.handlePhotoUpload(e.target, 'preview-new'));
    }

    closeModal() { document.getElementById('modal').classList.add('hidden'); }

    handleSave(e) {
        e.preventDefault();
        const type = e.target.dataset.type;
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.id = Date.now();

        // Mapeamento Form Type -> Array Data
        let target = type + 's';
        if(type === 'perfil') {
            target = 'perfis';
            const pElem = document.getElementById('preview-new');
            data.foto = pElem ? (pElem.dataset.base64 || '') : '';
        } else if(type === 'receita') target = 'receitas';
        else if(type === 'despesaCorrente') target = 'despesasCorrentes';
        else if(type === 'despesaFixa') target = 'despesasFixas';
        else if(type === 'remedio') target = 'remedios';
        else if(type === 'reparacao') target = 'reparacoes';
        else if(type === 'alimentacao') target = 'alimentacao';
        else if(type === 'investimento') target = 'investimentos';

        if(this.data[target]) {
            this.data[target].push(data);
            this.save();
            this.closeModal();
            this.renderContent();
            this.showToast('Salvo com sucesso!');
        }
    }

    deleteItem(cat, id) {
        if(confirm('Apagar este item?')) {
            this.data[cat] = this.data[cat].filter(i => i.id !== id);
            this.save();
            this.renderContent();
        }
    }

    // --- UTILS ---
    save() { localStorage.setItem(this.dbKey, JSON.stringify(this.data)); }
    formatKz(v) { return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(v).replace('AOA', 'Kz'); }
    resetApp() { if(confirm('⚠️ ATENÇÃO: Isso apagará TODOS os dados. Continuar?')) { localStorage.removeItem(this.dbKey); location.reload(); } }
    toggleMobileMenu() { document.getElementById('mobile-menu-overlay').classList.toggle('hidden'); }
    
    showToast(msg) {
        const t = document.getElementById('toast');
        document.getElementById('toast-msg').innerText = msg;
        t.classList.remove('translate-x-[150%]');
        setTimeout(() => t.classList.add('translate-x-[150%]'), 3000);
    }

    shareWhatsapp() {
        const s = this.data.pedidos.filter(p=>p.status==='Aprovado').reduce((a,b)=>a+Number(b.valor),0);
        const text = `*Resumo Mije Ultimate* 🇦🇴%0AOlá ${this.data.gestor.nome}!%0APedidos Aprovados: ${this.formatKz(s)}`;
        window.open(`https://wa.me/?text=${text}`, '_blank');
    }

    exportData() {
        const str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data));
        const a = document.createElement('a');
        a.href = str; a.download = `mije_backup_${Date.now()}.json`;
        document.body.appendChild(a); a.click(); a.remove();
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => { const app = new MijeApp(); app.init(); });