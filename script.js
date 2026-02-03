const form = document.getElementById('workout-form');
const exerciseInput = document.getElementById('exercise');
const weightInput = document.getElementById('weight');
const repsInput = document.getElementById('reps');
const listUl = document.getElementById('workout-list-ul');
const editIndexInput = document.getElementById('edit-index');

function getExercises() {
    const exercises = localStorage.getItem('gymLogData');
    return exercises ? JSON.parse(exercises) : [];
}


function saveExercises(exercisesList) {
    localStorage.setItem('gymLogData', JSON.stringify(exercisesList));
}

function createExercise(exercise, weight, reps) {
    const exercises = getExercises();
    const newExercise = { exercise, weight, reps };
    
    exercises.push(newExercise);
    saveExercises(exercises);
    render(); 
}

function updateExercise(index, exercise, weight, reps) {
    const exercises = getExercises();
    
    exercises[index] = { exercise, weight, reps }; 
    saveExercises(exercises);
    render();
}

function deleteExercise(index) {
    const exercises = getExercises();
    exercises.splice(index, 1); 
    saveExercises(exercises);
    render();
}

function render() {
    const exercises = getExercises();
    listUl.innerHTML = ''; 

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


window.loadItemForEdit = function(index) {
    const exercises = getExercises();
    const item = exercises[index];

    exerciseInput.value = item.exercise;
    weightInput.value = item.weight;
    repsInput.value = item.reps;
    editIndexInput.value = index; 

    document.getElementById('save-btn').innerText = "Atualizar Treino";
}


form.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const exercise = exerciseInput.value;
    const weight = weightInput.value;
    const reps = repsInput.value;
    const editIndex = editIndexInput.value;

    if (editIndex === '') {
        createExercise(exercise, weight, reps);
    } else {
        updateExercise(editIndex, exercise, weight, reps);
        editIndexInput.value = ''; 
        document.getElementById('save-btn').innerText = "Adicionar Treino";
    }

    form.reset(); 
});



render();
