export interface AppPreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  defaultCode: string;
}

export const PRESETS: AppPreset[] = [
  {
    id: "calculator",
    name: "Calculadora de Precisão",
    icon: "Calculator",
    category: "Utilidade",
    description: "Calculadora de alta precisão comercial com histórico de operações e design minimalista em vidro (glassmorphism).",
    defaultCode: `<!-- Calculadora de Precisão Real-time -->
<div class="min-h-[450px] flex flex-col items-center justify-center p-4">
  <div class="w-full max-w-xs bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
    
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <span class="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded-full border border-cyan-900/30">PRECISION PRO</span>
      <div id="hist-btn" class="text-slate-500 hover:text-slate-300 text-xs cursor-pointer transition-colors font-mono">Histórico</div>
    </div>
    
    <!-- Display -->
    <div class="mb-6 text-right">
      <div id="equation" class="text-slate-500 font-mono text-xs h-5 overflow-hidden pr-1 mb-1"></div>
      <div id="calc-display" class="text-3xl font-light text-slate-100 pr-1 truncate tracking-tight">0</div>
    </div>
    
    <!-- Teclado Grid -->
    <div class="grid grid-cols-4 gap-2.5">
      <!-- Row 1 -->
      <button onclick="clearCalc()" class="col-span-2 bg-rose-950/30 border border-rose-900/30 text-rose-400 py-3 rounded-2xl hover:bg-rose-950/60 active:scale-95 transition-all font-mono text-sm font-semibold">C</button>
      <button onclick="pressOperator('/')" class="bg-indigo-950/40 border border-indigo-900/40 text-indigo-400 py-3 rounded-2xl hover:bg-indigo-950/70 active:scale-95 transition-all text-lg font-bold">/</button>
      <button onclick="pressOperator('*')" class="bg-indigo-950/40 border border-indigo-900/40 text-indigo-400 py-3 rounded-2xl hover:bg-indigo-950/70 active:scale-95 transition-all text-lg font-bold">*</button>
      
      <!-- Row 2 -->
      <button onclick="pressNum('7')" class="bg-slate-800/40 border border-slate-700/20 text-slate-200 py-3 rounded-2xl hover:bg-slate-800/80 active:scale-95 transition-all text-base font-semibold">7</button>
      <button onclick="pressNum('8')" class="bg-slate-800/40 border border-slate-700/20 text-slate-200 py-3 rounded-2xl hover:bg-slate-800/80 active:scale-95 transition-all text-base font-semibold">8</button>
      <button onclick="pressNum('9')" class="bg-slate-800/40 border border-slate-700/20 text-slate-200 py-3 rounded-2xl hover:bg-slate-800/80 active:scale-95 transition-all text-base font-semibold">9</button>
      <button onclick="pressOperator('-')" class="bg-indigo-950/40 border border-indigo-900/40 text-indigo-400 py-3 rounded-2xl hover:bg-indigo-950/70 active:scale-95 transition-all text-lg font-bold">-</button>
      
      <!-- Row 3 -->
      <button onclick="pressNum('4')" class="bg-slate-800/40 border border-slate-700/20 text-slate-200 py-3 rounded-2xl hover:bg-slate-800/80 active:scale-95 transition-all text-base font-semibold">4</button>
      <button onclick="pressNum('5')" class="bg-slate-800/40 border border-slate-700/20 text-slate-200 py-3 rounded-2xl hover:bg-slate-800/80 active:scale-95 transition-all text-base font-semibold">5</button>
      <button onclick="pressNum('6')" class="bg-slate-800/40 border border-slate-700/20 text-slate-200 py-3 rounded-2xl hover:bg-slate-800/80 active:scale-95 transition-all text-base font-semibold">6</button>
      <button onclick="pressOperator('+')" class="bg-indigo-950/40 border border-indigo-900/40 text-indigo-400 py-3 rounded-2xl hover:bg-indigo-950/70 active:scale-95 transition-all text-lg font-bold">+</button>
      
      <!-- Row 4 -->
      <button onclick="pressNum('1')" class="bg-slate-800/40 border border-slate-700/20 text-slate-200 py-3 rounded-2xl hover:bg-slate-800/80 active:scale-95 transition-all text-base font-semibold">1</button>
      <button onclick="pressNum('2')" class="bg-slate-800/40 border border-slate-700/20 text-slate-200 py-3 rounded-2xl hover:bg-slate-800/80 active:scale-95 transition-all text-base font-semibold">2</button>
      <button onclick="pressNum('3')" class="bg-slate-800/40 border border-slate-700/20 text-slate-200 py-3 rounded-2xl hover:bg-slate-800/80 active:scale-95 transition-all text-base font-semibold">3</button>
      
      <!-- Equal button (Spans 2 rows) -->
      <button onclick="calculate()" class="row-span-2 bg-gradient-to-br from-cyan-500 to-indigo-600 border border-cyan-400/20 text-white rounded-2xl hover:brightness-110 active:scale-95 transition-all text-xl font-bold">=</button>
      
      <!-- Row 5 -->
      <button onclick="pressNum('0')" class="col-span-2 bg-slate-800/40 border border-slate-700/20 text-slate-200 py-3 rounded-2xl hover:bg-slate-800/80 active:scale-95 transition-all text-base font-semibold">0</button>
      <button onclick="pressNum('.')" class="bg-slate-800/40 border border-slate-700/20 text-slate-200 py-3 rounded-2xl hover:bg-slate-800/80 active:scale-95 transition-all text-base font-semibold">.</button>
    </div>
  </div>
</div>

<script>
  let currentVal = '0';
  let memoryVal = '';
  let activeOp = '';
  let resetDisplayOnNextInput = false;

  const displayEl = document.getElementById('calc-display');
  const equationEl = document.getElementById('equation');

  function updateDisplay(val) {
    displayEl.innerText = val;
  }

  function pressNum(num) {
    if (currentVal === '0' || resetDisplayOnNextInput) {
      currentVal = num;
      resetDisplayOnNextInput = false;
    } else {
      if (num === '.' && currentVal.includes('.')) return;
      currentVal += num;
    }
    updateDisplay(currentVal);
    console.log("Número clicado:", num);
  }

  function pressOperator(op) {
    memoryVal = currentVal;
    activeOp = op;
    resetDisplayOnNextInput = true;
    equationEl.innerText = memoryVal + ' ' + op;
    console.log("Operador clicado:", op);
  }

  function clearCalc() {
    currentVal = '0';
    memoryVal = '';
    activeOp = '';
    resetDisplayOnNextInput = false;
    updateDisplay('0');
    equationEl.innerText = '';
    console.log("Calculadora resetada");
  }

  function calculate() {
    if (!activeOp || !memoryVal) return;
    const num1 = parseFloat(memoryVal);
    const num2 = parseFloat(currentVal);
    let finalResult = 0;

    switch (activeOp) {
      case '+': finalResult = num1 + num2; break;
      case '-': finalResult = num1 - num2; break;
      case '*': finalResult = num1 * num2; break;
      case '/': 
        if (num2 === 0) {
          updateDisplay('Erro');
          currentVal = '0';
          memoryVal = '';
          activeOp = '';
          return;
        }
        finalResult = num1 / num2; 
        break;
    }

    equationEl.innerText = memoryVal + ' ' + activeOp + ' ' + currentVal + ' =';
    currentVal = String(Number(finalResult.toFixed(8))); // Resolve floating point precision
    updateDisplay(currentVal);
    memoryVal = '';
    activeOp = '';
    resetDisplayOnNextInput = true;
    console.log("Resultado final:", finalResult);
  }
</script>
`,
  },
  {
    id: "todolist",
    name: "Lista de Tarefas Fluida",
    icon: "CheckSquare",
    category: "Produtividade",
    description: "Gerenciador intuitivo de tarefas semanais com checkboxes interativos de toque, contadores dinâmicos de progresso e filtros ativos.",
    defaultCode: `<!-- Lista de Tarefas Minimalista e Fluida -->
<div class="min-h-[460px] flex items-center justify-center p-4">
  <div class="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
    
    <!-- Top Bar -->
    <div class="flex items-center justify-between mb-5">
      <div>
        <h3 class="text-lg font-semibold text-zinc-100">Fazer Hoje</h3>
        <p class="text-xs text-zinc-500 font-mono" id="task-counter">Carregando...</p>
      </div>
      <div id="filter-btn" onclick="toggleFilter()" class="text-xs font-medium text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-900/30 cursor-pointer hover:bg-emerald-950/80 transition-all">
        Filtrar: Todos
      </div>
    </div>
    
    <!-- Input Form -->
    <div class="flex gap-2.5 mb-5">
      <input type="text" id="task-input" placeholder="Planeje uma nova tarefa..." class="flex-1 bg-zinc-950 rounded-2xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none border border-zinc-800 focus:border-emerald-500/50 transition-colors">
      <button onclick="addTask()" class="bg-emerald-500 text-zinc-950 px-4 rounded-2xl hover:bg-emerald-400 active:scale-95 transition-all font-bold text-sm">+</button>
    </div>
    
    <!-- Lists Stack -->
    <div id="todo-list" class="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
      <!-- Tarefas populadas pelo script -->
    </div>

  </div>
</div>

<script>
  let tasks = [
    { id: 1, text: "Configurar variáveis de ambiente do app", completed: true },
    { id: 2, text: "Otimizar contêiner Docker para produção", completed: false },
    { id: 3, text: "Ajustar tipografia do cabeçalho da página", completed: false }
  ];
  let filterState = 'all'; // all, pending, completed

  function renderList() {
    const listEl = document.getElementById('todo-list');
    listEl.innerHTML = '';

    const filteredTasks = tasks.filter(t => {
      if (filterState === 'pending') return !t.completed;
      if (filterState === 'completed') return t.completed;
      return true;
    });

    if (filteredTasks.length === 0) {
      listEl.innerHTML = \`
        <div class="flex flex-col items-center justify-center py-8 text-center">
          <span class="text-2xl mb-1">☘️</span>
          <p class="text-xs text-zinc-500">Nenhuma tarefa encontrada neste filtro.</p>
        </div>
      \`;
      updateCounter();
      return;
    }

    filteredTasks.forEach(task => {
      const card = document.createElement('div');
      card.className = \`flex items-center justify-between bg-zinc-950/70 border border-zinc-800/40 px-4 py-3 rounded-2xl hover:border-zinc-800 transition-all group \${task.completed ? 'opacity-60' : ''}\`;
      
      const textClass = task.completed ? 'line-through text-zinc-600' : 'text-zinc-200';
      const checkBg = task.completed ? 'bg-emerald-500 border-emerald-400' : 'border-zinc-700';
      const checkIcon = task.completed ? '✓' : '';

      card.innerHTML = \`
        <div class="flex items-center gap-3 cursor-pointer select-none flex-1" onclick="toggleTask(\${task.id})">
          <div class="w-5 h-5 rounded-lg border flex items-center justify-center text-[10px] font-bold text-zinc-950 transition-all \${checkBg}">
            \${checkIcon}
          </div>
          <span class="text-sm \${textClass}">\${task.text}</span>
        </div>
        <button onclick="deleteTask(\${task.id})" class="text-xs text-zinc-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 p-1">
          excluir
        </button>
      \`;
      listEl.appendChild(card);
    });

    updateCounter();
  }

  function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    renderList();
    console.log("Tarefa alternada, id:", id);
  }

  function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    if (!text) return;

    const newTask = {
      id: Date.now(),
      text: text,
      completed: false
    };

    tasks.unshift(newTask);
    input.value = '';
    renderList();
    console.log("Nova tarefa adicionada:", text);
  }

  // Permite adicionar com "Enter"
  document.getElementById('task-input').onkeydown = function(e) {
    if (e.key === 'Enter') addTask();
  };

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderList();
    console.log("Tarefa removida, id:", id);
  }

  function toggleFilter() {
    const filterBtn = document.getElementById('filter-btn');
    if (filterState === 'all') {
      filterState = 'pending';
      filterBtn.innerText = 'Filtrar: Pendentes';
    } else if (filterState === 'pending') {
      filterState = 'completed';
      filterBtn.innerText = 'Filtrar: Concluídas';
    } else {
      filterState = 'all';
      filterBtn.innerText = 'Filtrar: Todos';
    }
    renderList();
  }

  function updateCounter() {
    const counterEl = document.getElementById('task-counter');
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    counterEl.innerText = \`\${completed} de \${total} concluídas (\${total - completed} restantes)\`;
  }

  // Inicialização
  renderList();
</script>
`,
  },
  {
    id: "pomodoro",
    name: "Focus & Pomodoro Zen",
    icon: "Clock",
    category: "Produtividade",
    description: "Temporizador de concentração imersivo com círculo dinâmico de progresso sutil e alertas de intervalo integrados.",
    defaultCode: `<!-- Temporizador Pomodoro Zen -->
<div class="min-h-[460px] flex flex-col items-center justify-center p-4">
  <div class="w-full max-w-xs bg-[#110e1a]/95 border border-[#231a3d] rounded-3xl p-6 shadow-2xl relative overflow-hidden text-center">
    
    <!-- Neon back glow -->
    <div class="absolute -top-12 -left-12 w-24 h-24 bg-violet-600/10 blur-3xl rounded-full"></div>
    <div class="absolute -bottom-12 -right-12 w-24 h-24 bg-rose-600/10 blur-3xl rounded-full"></div>
    
    <!-- Mode select -->
    <div class="flex items-center justify-center gap-2 mb-6 relative z-10">
      <span class="text-xs bg-violet-950/60 border border-violet-800/20 text-violet-300 px-3 py-1 rounded-full font-medium" id="timer-mode">POMODORO ESTUDO</span>
    </div>

    <!-- Timer Circle & Digital Display -->
    <div class="relative w-40 h-40 mx-auto mb-6 flex items-center justify-center">
      <!-- Radial background ring -->
      <svg class="absolute inset-0 w-full h-full transform -rotate-90">
        <circle cx="80" cy="80" r="70" stroke="#1d1633" stroke-width="4" fill="transparent" />
        <circle id="timer-circle" cx="80" cy="80" r="70" stroke="#8b5cf6" stroke-width="4" fill="transparent" 
                stroke-dasharray="440" stroke-dashoffset="0" stroke-linecap="round" class="transition-all duration-300" />
      </svg>
      
      <div class="relative text-center">
        <div class="text-4xl font-light font-mono text-zinc-50 tracking-tight" id="time-display">25:00</div>
        <div class="text-[10px] text-zinc-500 tracking-widest font-mono mt-1">FOCO ABSOLUTO</div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-center gap-2.5 relative z-10">
      <button onclick="toggleTimer()" id="play-btn" class="bg-violet-600 text-white font-medium hover:bg-violet-500 active:scale-95 transition-all text-xs px-5 py-2.5 rounded-2xl min-w-[100px]">Iniciar</button>
      <button onclick="resetTimer()" class="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 active:scale-95 transition-all text-xs px-5 py-2.5 rounded-2xl">Resetar</button>
    </div>
  </div>
</div>

<script>
  let focusTime = 25 * 60; // 25 Min
  let breakTime = 5 * 60;  // 5 Min
  let timeLeft = focusTime;
  let timerId = null;
  let isWorking = true;

  const displayEl = document.getElementById('time-display');
  const circleEl = document.getElementById('timer-circle');
  const modeEl = document.getElementById('timer-mode');
  const playBtn = document.getElementById('play-btn');

  const circleLength = 440; // Total stroke value width

  function updateVisuals() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    displayEl.innerText = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;

    // Progress circle calculates percentage
    const totalCurrentModeTime = isWorking ? focusTime : breakTime;
    const pct = timeLeft / totalCurrentModeTime;
    const offset = circleLength - (pct * circleLength);
    circleEl.setAttribute('stroke-dashoffset', offset);
  }

  function toggleTimer() {
    if (timerId === null) {
      // Start
      timerId = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          updateVisuals();
        } else {
          // Switch State
          isWorking = !isWorking;
          timeLeft = isWorking ? focusTime : breakTime;
          modeEl.innerText = isWorking ? 'POMODORO ESTUDO' : 'HORA DO DESCANSO';
          circleEl.setAttribute('stroke', isWorking ? '#8b5cf6' : '#ec4899');
          alert(isWorking ? "Foco iniciado!" : "Hora de descansar um pouco.");
          updateVisuals();
        }
      }, 1000);
      playBtn.innerText = 'Pausar';
      playBtn.className = 'bg-rose-600 text-white font-medium hover:bg-rose-500 active:scale-95 transition-all text-xs px-5 py-2.5 rounded-2xl min-w-[100px]';
      console.log("Pomodoro iniciado");
    } else {
      // Pause
      clearInterval(timerId);
      timerId = null;
      playBtn.innerText = 'Retomar';
      playBtn.className = 'bg-violet-600 text-white font-medium hover:bg-violet-500 active:scale-95 transition-all text-xs px-5 py-2.5 rounded-2xl min-w-[100px]';
      console.log("Pomodoro pausado");
    }
  }

  function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorking = true;
    timeLeft = focusTime;
    modeEl.innerText = 'POMODORO ESTUDO';
    circleEl.setAttribute('stroke', '#8b5cf6');
    playBtn.innerText = 'Iniciar';
    playBtn.className = 'bg-violet-600 text-white font-medium hover:bg-violet-500 active:scale-95 transition-all text-xs px-5 py-2.5 rounded-2xl min-w-[100px]';
    updateVisuals();
    console.log("Pomodoro resetado");
  }

  // Inicializa
  updateVisuals();
</script>
`,
  },
  {
    id: "sandbox",
    name: "Painel de Bio Link",
    icon: "Layers",
    category: "Design",
    description: "Estrutura moderna para agregador de links pessoais ou links-na-bio, contendo botões interativos de redes, foto de perfil, e animações de hover.",
    defaultCode: `<!-- Hub de Links de Bio Moderno -->
<div class="min-h-[460px] flex items-center justify-center p-4">
  <div class="w-full max-w-sm bg-stone-900 text-stone-100 border border-stone-800 rounded-3xl p-6 shadow-xl relative text-center">
    
    <!-- User Pic -->
    <div class="w-20 h-20 bg-gradient-to-tr from-amber-400 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl border-2 border-stone-800 shadow-md">
      🚀
    </div>
    
    <!-- Profile Info -->
    <h3 class="text-lg font-semibold tracking-tight text-white mb-0.5">Alex Santos</h3>
    <p class="text-xs text-amber-500 font-mono mb-4">@alexsantos_dev</p>
    
    <!-- Pitch -->
    <p class="text-xs text-stone-400 max-w-xs mx-auto mb-6">Desenvolvo soluções web performáticas com design impecável e atenção extrema a detalhes.</p>
    
    <!-- Links Stack -->
    <div class="space-y-3">
      <a href="#" onclick="alert('Conectado ao Portfólio')" class="block bg-stone-950 border border-stone-800/60 py-3 px-4 rounded-2xl text-xs font-medium text-stone-200 hover:bg-stone-850 hover:-translate-y-0.5 active:translate-y-0 transition-all">
        🌐 Visite Meu Portfólio Principal
      </a>
      
      <a href="#" onclick="alert('Iniciando contato via LinkedIn')" class="block bg-stone-950 border border-stone-800/60 py-3 px-4 rounded-2xl text-xs font-medium text-stone-200 hover:bg-stone-850 hover:-translate-y-0.5 active:translate-y-0 transition-all">
        💼 Conecte-se comigo no LinkedIn
      </a>
      
      <a href="#" onclick="alert('Abrindo repositórios do GitHub')" class="block bg-stone-950 border border-stone-800/60 py-3 px-4 rounded-2xl text-xs font-medium text-stone-200 hover:bg-stone-850 hover:-translate-y-0.5 active:translate-y-0 transition-all">
        🐙 Siga meus Projetos no GitHub
      </a>
    </div>

    <!-- Footer Counter -->
    <div class="mt-6 pt-4 border-t border-stone-800/55 flex justify-between items-center text-[10px] text-stone-500 font-mono">
      <span>Membros</span>
      <span class="text-stone-300 bg-stone-950 px-2 py-0.5 rounded-full border border-stone-800">1.2k+ inscritos</span>
    </div>
  </div>
</div>
`,
  }
];

export const SIGNS_ZODIAC_LIST = [
  { name: "Áries", symbol: "♈", element: "Fogo", regente: "Marte", traits: "Iniciativa, pioneirismo, vigor, impaciência.", horoscopo: "Hoje é um dia promissor para assumir novos compromissos, porém tenha paciência com respostas burocráticas retardadas.", cosmicImg: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=400&q=80" },
  { name: "Touro", symbol: "♉", element: "Terra", regente: "Vênus", traits: "Estabilidade, persistência, sensualidade, teimosia.", horoscopo: "A quadratura lunar sugere revisar gastos apressados. Foque em estabilizar seu solo financeiro.", cosmicImg: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=400&q=80" },
  { name: "Gêmeos", symbol: "♊", element: "Ar", regente: "Mercúrio", traits: "Comunicação, versatilidade, curiosidade, dispersão.", horoscopo: "Trocar ideias e debater trará excelentes alianças hoje. Cuidado para não dispersar de suas obrigações primordiais.", cosmicImg: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80" },
  { name: "Câncer", symbol: "♋", element: "Água", regente: "Lua", traits: "Acolhimento, sensibilidade, memória, melindre.", horoscopo: "Momento propício para resgatar sua nutrição familiar emocional e meditar e registrar seus sonhos.", cosmicImg: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80" },
  { name: "Leão", symbol: "♌", element: "Fogo", regente: "Sol", traits: "Criatividade, magnetismo, generosidade, orgulho.", horoscopo: "Seu poder pessoal de liderança brilha. Use de empatia nos círculos de negócios para somar forças.", cosmicImg: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80" },
  { name: "Virgem", symbol: "♍", element: "Terra", regente: "Mercúrio", traits: "Método, aperfeiçoamento, lógica, autocrítica excessiva.", horoscopo: "Organize seus arquivos e cuide de sua rotina de bem estar. Seu corpo pede repouso ativo hoje.", cosmicImg: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80" },
  { name: "Libra", symbol: "♎", element: "Ar", regente: "Vênus", traits: "Equilíbrio, conciliação, estética, indecisão.", horoscopo: "Uma decisão importante na vida afetiva demanda equilíbrio sincero e transparência de palavras.", cosmicImg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80" },
  { name: "Escorpião", symbol: "♏", element: "Água", regente: "Plutão", traits: "Profundidade, transformação, garra, controle.", horoscopo: "Energia investigativa poderosa. Suas visões desmascaram mentiras de imediato. Siga sua clarividência.", cosmicImg: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=400&q=80" },
  { name: "Sagitário", symbol: "♐", element: "Fogo", regente: "Júpiter", traits: "Aventura, expansão, sabedoria, autoindulgência.", horoscopo: "Novas possibilidades de viagem ou novos saberes de retórica surgem para inspirar sua mente ávida.", cosmicImg: "https://images.unsplash.com/photo-1516339901601-2e1d62dc0c45?auto=format&fit=crop&w=400&q=80" },
  { name: "Capricórnio", symbol: "♑", element: "Terra", regente: "Saturno", traits: "Estrutura, dever, resiliência, rigidez.", horoscopo: "Foque em planos pragmáticos de longo prazo. A estabilidade decorre de sua dedicação sistemática.", cosmicImg: "https://images.unsplash.com/photo-1504333631150-c8ab2da93b03?auto=format&fit=crop&w=400&q=80" },
  { name: "Aquário", symbol: "♒", element: "Ar", regente: "Urano", traits: "Independência, originalidade, visionário, intelectual.", horoscopo: "Sua audácia vanguardista flui forte em 2026. Recuse dogmas limitadores e busque criar sua própria órbita.", cosmicImg: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=400&q=80" },
  { name: "Peixes", symbol: "♓", element: "Água", regente: "Netuno", traits: "Intuição, sensibilidade poética, compaixão, escapismo.", horoscopo: "Seus sonhos estão extraordinariamente falantes hoje. Mantenha papel e caneta ao lado da cama.", cosmicImg: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80" }
];

export const BLOG_ARTICLES_LIST = [
  {
    id: 1,
    title: "O que a Astrologia REALMENTE pode e não pode fazer",
    author: "Orbia Astróloga",
    date: "08 Junho 2026",
    summary: "Descubra como os planetas apenas indicam disposições latentes sem suprimir seu livre-arbítrio espiritual e sua soberania racional.",
    content: "A grande ilusão do determinismo astrológico é supor que você está preso a carimbos celestes intransponíveis. Na verdade, as configurações energéticas mapeadas na hora de seu nascimento servem como correntes eletromagnéticas subliminares. Comandá-las ou ser comandado por elas é onde reside sua dinâmica de autoconhecimento. O Sol em Aquário abre potencialidades originais, mas é a sua consciência racional ativa que pavimenta as escolhas materiais diárias."
  },
  {
    id: 2,
    title: "Como planejar a rotina usando as 4 Fases da Lua",
    author: "Orbia Astróloga",
    date: "05 Junho 2026",
    summary: "Lua Balsâmica, Nova, Crescente, Minguante. Aprenda os melhores períodos na agricultura doméstica, rotina de beleza e lançamentos comerciais.",
    content: "A Lua dita o movimento das marés e o fluxo da seiva das plantas. Em nossa consciência, rege as reações imediatas e a disposição íntima. Lançar projetos audaciosos sob a Lua Nova traz inícios pujantes; revisar e desapegar sob a Lua Balsâmica ou Minguante impede que você acumule tarefas infrutíferas. Alinhar suas missões a esses biorritmos lunares otimiza drasticamente seus resultados diários."
  },
  {
    id: 3,
    title: "Mercúrio Retrógrado em 2026: Datas de Cuidado Puro",
    author: "Orbia Astróloga",
    date: "28 Maio 2026",
    summary: "Guia definitivo das semanas críticas onde eletrônicos, assinaturas contratuais e mal-entendidos de diálogo exigem cautela metódica.",
    content: "O aparente retrocesso de Mercúrio traz à superfície todas as fendas ocultas no sistema de comunicação humana. backups desatualizados apagam-se misteriosamente, e-mails de teor sensível são interpretados com melindre e acordos verbais decaem rapidamente. A recomendação de nossa IA conselheira é ler atenciosamente todas as entrelinhas e evitar assinar transações sem a devida vistoria jurídica detalhada."
  }
];

export const FAQ_LIST = [
  { q: "O que é o sistema Placidus usado para gerar o Mapa?", a: "O sistema Placidus é o método de divisão matemática de casas astrológicas mais testado e difundido na astrologia ocidental desde o século XVII. Ele leva em conta a latitude exata de nascimento para projetar as 12 cúspides no firmamento celeste no instante de seu sopro vital primário." },
  { q: "Quantas consultas ao Oráculo do Dia posso submeter?", a: "Para conservar sua reverência mística e valor terapêutico percebido, o aplicativo limita as respostas profundas do Oráculo do Dia a exatamente uma consulta por dia por usuário." },
  { q: "Meus sonhos analisados no 'Cofre dos Sonhos' são confidenciais?", a: "Sim, absolutamente garantido de forma premium. Todos os seus registros oníricos e interpretações automatizadas por IA ficam criptografados internamente protegendo sua integridade íntima." },
  { q: "Posso criar e calcular o mapa de outras pessoas importantes?", a: "Perfeitamente. Na aba 'Mapa Estelar' sob a categoria 'Mapas Extras', você poderá salvar e consultar o mapa de até 2 outras pessoas queridas com facilidade sem desfigurar seus dados originais de nascimento." }
];

