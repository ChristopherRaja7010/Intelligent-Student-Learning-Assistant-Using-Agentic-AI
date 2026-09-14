const defaultState = {
  student: { name: "Alex Rivera", streak: 7 },
  progress: 68,
  studyMinutes: 260,
  tasks: [
    { title: "Review: Python list comprehensions", detail: "Python fundamentals", time: "25 min", done: true },
    { title: "Practice: Functions and scope", detail: "8 questions", time: "20 min", done: false },
    { title: "Read: Intro to data structures", detail: "Recommended resource", time: "30 min", done: false }
  ],
  subjects: [
    { name: "Python fundamentals", value: 78, tone: "" },
    { name: "Data structures", value: 54, tone: "orange-bar" },
    { name: "Web development", value: 71, tone: "green-bar" }
  ]
};
const state = JSON.parse(localStorage.getItem("learnflow-state") || JSON.stringify(defaultState));
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const save = () => localStorage.setItem("learnflow-state", JSON.stringify(state));
const showToast = (message) => {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
};
const initials = (name) => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

function renderIdentity() {
  const shortName = state.student.name.split(" ")[0];
  $("#page-title").innerHTML = `Good morning, ${shortName} <span class="wave">✦</span>`;
  $("#sidebar-name").textContent = state.student.name;
  $("#top-name").textContent = state.student.name;
  $("#sidebar-avatar").textContent = initials(state.student.name);
  $("#top-avatar").textContent = initials(state.student.name);
  $("#streak-count").textContent = state.student.streak;
  $("#sidebar-streak").textContent = state.student.streak;
  $("#study-time").textContent = `${Math.floor(state.studyMinutes / 60)}h ${state.studyMinutes % 60}m`;
  $("#weekly-progress").textContent = `${state.progress}%`;
  $("#weekly-bar").style.width = `${state.progress}%`;
  $("#streak-dots").innerHTML = Array.from({ length: 7 }, (_, index) => `<i class="${index < state.student.streak ? "on" : ""}"></i>`).join("");
}

function taskMarkup(task, index) {
  return `<div class="task ${task.done ? "done" : ""}" data-task="${index}"><button class="task-check" aria-label="${task.done ? "Completed" : "Mark complete"}">${task.done ? "✓" : ""}</button><div class="task-info"><strong>${task.title}</strong><span>${task.detail}</span></div><span class="task-time">${task.time}</span></div>`;
}
function renderTasks() {
  $("#today-tasks").innerHTML = state.tasks.map(taskMarkup).join("");
  $("#planner-tasks").innerHTML = state.tasks.map((task, index) => `<div class="planner-task"><span class="task-time-block">${index === 0 ? "09:00" : index === 1 ? "10:00" : "11:00"}</span><i class="task-color ${index === 1 ? "orange-line" : index === 2 ? "green-line" : ""}"></i><div><h3>${task.title}</h3><p>${task.detail} · ${task.time}</p></div>${task.done ? '<span class="complete-label">Completed ✓</span>' : `<button class="text-button planner-complete" data-task="${index}">Complete</button>`}</div>`).join("");
}
function renderSubjects() {
  $("#subject-list").innerHTML = state.subjects.map((subject) => `<div><div class="subject-top"><span>${subject.name}</span><b>${subject.value}%</b></div><div class="subject-bar"><i class="${subject.tone}" style="width:${subject.value}%"></i></div></div>`).join("");
}
function completeTask(index) {
  state.tasks[index].done = !state.tasks[index].done;
  if (state.tasks[index].done) {
    state.progress = Math.min(100, state.progress + 3);
    state.studyMinutes += 20;
    showToast("Nice work. Your plan has been updated.");
  }
  save(); renderIdentity(); renderTasks();
}

const quiz = [
  { question: "Which Python expression creates a list containing the squares of 0, 1, and 2?", options: ["[x * x for x in range(3)]", "[x ^ 2 for x in range(3)]", "square(x) for x in range(3)", "range(x * x, 3)"], answer: 0 },
  { question: "What does the `return` statement do inside a function?", options: ["Repeats the function forever", "Sends a value back to the caller", "Imports a module", "Creates a new variable"], answer: 1 },
  { question: "Which data structure follows the FIFO principle?", options: ["Stack", "Set", "Queue", "Dictionary"], answer: 2 }
];
let quizIndex = 0; let selectedAnswer = null; let quizScore = 0;
function renderQuiz() {
  const current = quiz[quizIndex];
  $("#question-number").textContent = `Question ${quizIndex + 1} of ${quiz.length}`;
  $("#quiz-progress-bar").style.width = `${((quizIndex + 1) / quiz.length) * 100}%`;
  $("#question-text").textContent = current.question;
  $("#answer-options").innerHTML = current.options.map((option, index) => `<button class="answer-option" data-answer="${index}">${option}</button>`).join("");
  $("#quiz-feedback").textContent = "";
  $("#next-question").disabled = true;
  $("#next-question").textContent = "Check answer";
  selectedAnswer = null;
}
function selectAnswer(index) {
  selectedAnswer = index;
  $$(".answer-option").forEach((option) => option.classList.toggle("selected", Number(option.dataset.answer) === index));
  $("#next-question").disabled = false;
}
function checkAnswer() {
  const current = quiz[quizIndex];
  if (selectedAnswer === null) return;
  if ($("#next-question").textContent === "Next question") {
    quizIndex += 1;
    if (quizIndex >= quiz.length) {
      $("#quiz-card").innerHTML = `<div class="quiz-complete"><span class="stat-icon purple">✦</span><p class="eyebrow">Session complete</p><h2>Great effort, ${state.student.name.split(" ")[0]}!</h2><p>You answered <strong>${quizScore} of ${quiz.length}</strong> correctly. Your next study plan will prioritize the topics that need more practice.</p><button class="primary-button" id="restart-quiz">Practice again</button></div>`;
      $("#quiz-score").textContent = quizScore;
      state.progress = Math.min(100, state.progress + quizScore * 2); save(); renderIdentity();
      $("#restart-quiz").addEventListener("click", () => window.location.reload());
      return;
    }
    renderQuiz(); return;
  }
  const correct = selectedAnswer === current.answer;
  if (correct) { quizScore += 1; $("#quiz-feedback").textContent = "Correct! Keep going."; $("#quiz-feedback").style.color = "var(--green)"; }
  else { $("#quiz-feedback").textContent = `Not quite. The best answer is "${current.options[current.answer]}".`; $("#quiz-feedback").style.color = "#c26a6a"; }
  $$(".answer-option").forEach((option) => { const value = Number(option.dataset.answer); option.disabled = true; if (value === current.answer) option.classList.add("correct"); else if (value === selectedAnswer) option.classList.add("incorrect"); });
  $("#next-question").textContent = quizIndex === quiz.length - 1 ? "Finish session" : "Next question";
}

function switchView(view) {
  $$(".view").forEach((item) => item.classList.toggle("active", item.id === `${view}-view`));
  $$(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  const titles = { overview: "Overview", planner: "Study planner", practice: "Practice lab", resources: "Resources" };
  document.title = `LearnFlow | ${titles[view]}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function renderResources() {
  const resources = [
    ["Python list comprehensions", "A visual guide to writing cleaner, more expressive Python.", "12 min read", "purple-cover", "⌘"],
    ["Functions and scope", "Build a stronger mental model of arguments, returns, and closures.", "Video · 18 min", "orange-cover", "▶"],
    ["Data structures crash course", "Learn when to reach for lists, tuples, sets, and dictionaries.", "Interactive", "blue-cover", "◇"]
  ];
  $("#resource-grid").innerHTML = resources.map((resource) => `<article class="resource-card"><div class="resource-cover ${resource[3]}"><span>${resource[4]}</span><b>${resource[0]}</b></div><div class="resource-copy"><h3>${resource[0]}</h3><p>${resource[1]}</p><div class="resource-meta"><span>${resource[2]}</span><b>Open →</b></div></div></article>`).join("");
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-view], [data-view-target]");
  if (nav) switchView(nav.dataset.view || nav.dataset.viewTarget);
  const task = event.target.closest("[data-task]");
  if (task && (event.target.closest(".task-check") || event.target.closest(".planner-complete"))) completeTask(Number(task.dataset.task));
  const answer = event.target.closest(".answer-option");
  if (answer) selectAnswer(Number(answer.dataset.answer));
});
$("#next-question").addEventListener("click", checkAnswer);
$("#generate-plan").addEventListener("click", () => { state.tasks = [...state.tasks].sort(() => Math.random() - .5); save(); renderTasks(); showToast("Your plan was regenerated around your current focus."); });
$("#goals-form").addEventListener("submit", (event) => { event.preventDefault(); showToast("Preferences saved. Your learning plan is now personalized."); });
$("#time-input").addEventListener("input", (event) => { $("#time-value").textContent = `${event.target.value} minutes`; });
$("#refresh-resources").addEventListener("click", () => { renderResources(); showToast("Fresh recommendations are ready."); });
$("#notifications").addEventListener("click", () => showToast("You have one new learning insight."));
$("#open-profile").addEventListener("click", () => showToast("Profile settings are coming soon."));
$("#reset-data").addEventListener("click", () => { Object.assign(state, JSON.parse(JSON.stringify(defaultState))); save(); renderIdentity(); renderTasks(); renderSubjects(); showToast("Demo data reset."); });
renderIdentity(); renderTasks(); renderSubjects(); renderResources(); renderQuiz();
