// Referências do HTML
const form = document.getElementById('workout-form');
const exerciseInput = document.getElementById('exercise');
const weightInput = document.getElementById('weight');
const repsInput = document.getElementById('reps');
const listUl = document.getElementById('workout-list-ul');
const editIndexInput = document.getElementById('edit-index');

// --- "API" INTERNA (Gerenciamento de Dados) ---

// READ: Função para buscar dados do LocalStorage
function getExercises() {
    const exercises = localStorage.getItem('gymLogData');
    // Se tiver dados, converte de JSON para Objeto, senão retorna lista vazia
    return exercises ? JSON.parse(exercises) : [];
}

// SAVE: Função para salvar a lista atualizada no LocalStorage
function saveExercises(exercisesList) {
    // Converte a lista de objetos para JSON (string) para salvar no navegador
    localStorage.setItem('gymLogData', JSON.stringify(exercisesList));
}

// CREATE: Adicionar novo exercício
function createExercise(exercise, weight, reps) {
    const exercises = getExercises();
    const newExercise = { exercise, weight, reps };
    
    exercises.push(newExercise);
    saveExercises(exercises);
    render(); // Atualiza a tela
}

// UPDATE: Atualizar um exercício existente
function updateExercise(index, exercise, weight, reps) {
    const exercises = getExercises();
    
    exercises[index] = { exercise, weight, reps }; // Substitui o antigo pelo novo
    saveExercises(exercises);
    render();
}

// DELETE: Apagar um exercício
function deleteExercise(index) {
    const exercises = getExercises();
    exercises.splice(index, 1); // Remove 1 item na posição 'index'
    saveExercises(exercises);
    render();
}

// --- INTERFACE (DOM) ---

// Função para desenhar a lista na tela (HTML Dinâmico)
function render() {
    const exercises = getExercises();
    listUl.innerHTML = ''; // Limpa a lista antes de redesenhar

    exercises.forEach((item, index) => {
        const li = document.createElement('li');
        
        li.innerHTML = `
            <div class="info">
                <strong>${item.exercise}</strong>
                <span>Carga: ${item.weight}kg | ${item.reps}</span>
            </div>
            <div class="actions">
                <button class="edit" onclick="loadItemForEdit(${index})">
                    <i class="ph ph-pencil-simple"></i>
                </button>
                <button class="delete" onclick="deleteExercise(${index})">
                    <i class="ph ph-trash"></i>
                </button>
            </div>
        `;
        listUl.appendChild(li);
    });
}

// Função para preencher o formulário quando clicar em editar
window.loadItemForEdit = function(index) {
    const exercises = getExercises();
    const item = exercises[index];

    exerciseInput.value = item.exercise;
    weightInput.value = item.weight;
    repsInput.value = item.reps;
    editIndexInput.value = index; // Salva o índice num campo escondido

    document.getElementById('save-btn').innerText = "Atualizar Treino";
}

// Evento de envio do formulário
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita recarregar a página

    const exercise = exerciseInput.value;
    const weight = weightInput.value;
    const reps = repsInput.value;
    const editIndex = editIndexInput.value;

    if (editIndex === '') {
        // Se não tem índice de edição, é CRIAÇÃO
        createExercise(exercise, weight, reps);
    } else {
        // Se tem índice, é ATUALIZAÇÃO
        updateExercise(editIndex, exercise, weight, reps);
        editIndexInput.value = ''; // Limpa o índice
        document.getElementById('save-btn').innerText = "Adicionar Treino";
    }

    form.reset(); // Limpa os campos
});

// Inicializa a aplicação carregando os dados
render();
