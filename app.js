/*
Part 1
For this assignment you will be combining your knowledge of DOM access and events to build a todo app!

As a user, you should be able to:

Add a new todo (by submitting a form)
Mark a todo as completed (cross out the text of the todo)
Remove a todo
Part 2
Now that you have a functioning todo app, save your todos in localStorage! Make sure that when the page refreshes, the todos on the page remain there.
*/
let todoArr = [];

function loadPage() {
  const body = document.querySelector('body');

  // create form, label, input, button
  const form = document.createElement('form');
  form.id = "create-todo-form";

  const newTodoLabel = document.createElement('label');
  newTodoLabel.textContent = "Create a new Todo";
  newTodoLabel.for = "todo-input";

  const newTodoInput = document.createElement('input');
  newTodoInput.placeholder = "Todo";
  newTodoInput.id = "todo-input";
  
  const newTodoButton = document.createElement('button');
  newTodoButton.textContent = "Create!";

  // create ul for todos
  let todoList = document.createElement('ul');
  todoList.id = "todo-list"

  // put clickHandler on todoList
  todoList.addEventListener('click', ulHandleClick);

  // add elements to page
  body.append(form);
  form.append(newTodoLabel);
  newTodoLabel.append(newTodoInput);
  form.append(newTodoButton);
  body.append(todoList);

  // have button create todo
  newTodoButton.addEventListener('click', handleCreateTodo)

  checkLocalStorage();
}


function ulHandleClick(e) {
  const {target} = e
  if (target.tagName === "BUTTON") {
    removeTodo(e);
  } else if (target.tagName === "INPUT" && target.type === "checkbox") {
    toggleTodoCompletion(e);
  } else {
    console.log("Something went wrong in ulHandleClick");
    console.dir(target);
  }
}


function handleCreateTodo(e) {
  e.preventDefault();
  const todoInput = e.target.parentElement.querySelector("input");
  const todoText = todoInput.value;
  
  // check that string is not empty
  if (todoText.replace(/\s/g, "") === "") {
    todoInput.value = "";
    todoInput.placeholder = "Don't add a blank todo!" 
    return;
  } else {
    createTodo(todoText, false);
  
    // Reset todoInput
    todoInput.value = "";
    todoInput.placeholder = "Create a new Todo";
  }
  
}


function createTodo(todoText, completedBool) {

  renderTodo(todoText, completedBool);

  // make change to todoArr and localStorage
  todoArr.push({
    text: todoText,
    completed: false
  })
  localStorage.setItem("todos", JSON.stringify(todoArr));
}


function renderTodo(todoText, completedBool) {
  // create todoElement, add to page
  const todoElement = document.createElement('li');

  const todoSpan = document.createElement('span');
  todoSpan.textContent = todoText;
  todoElement.append(todoSpan);

  // create todoElement completed checkbox
  let todoCompletedLabel = document.createElement('label');
  todoCompletedLabel.textContent = "Done?";
  let todoCompletedCheckbox = document.createElement('input');
  todoCompletedCheckbox.type = "checkbox";
  
  if (completedBool) {
    todoCompletedCheckbox.checked = true;
    todoSpan.classList.toggle("completed")
  }
  
  todoCompletedLabel.append(todoCompletedCheckbox);

  // create todoElement remove button
  let todoRemoveButton = document.createElement('button');
  todoRemoveButton.textContent = "Delete";

  // append checkbox and button to todoElement
  todoElement.append(todoCompletedLabel);
  todoElement.append(todoRemoveButton);

  // add todoElement to page
  const todoList = document.querySelector("#todo-list");
  todoList.append(todoElement);
}


// Event Delegation: event target will be li checkbox, but this is handled on ul
// target will be input
function toggleTodoCompletion(e) {

  const checkbox = e.target;
  const li = checkbox.parentElement.parentElement;

  // toggle strikethrough
  li.querySelector("span").classList.toggle("completed");

  // make change to todoArr
  let index = getChildIndexOf(li);
  todoArr[index].completed = !todoArr[index].completed

  // change localStorage
  localStorage.setItem("todos", JSON.stringify(todoArr));
}


// Event Delegation: event target will be li checkbox, but this is handled on ul
function removeTodo(e) {
  e.preventDefault();
  const removeButton = e.target;
  const li = removeButton.parentElement;

  let index = getChildIndexOf(li);
  todoArr.splice(index, 1);

  li.remove();

  // change localStorage
  localStorage.setItem("todos", JSON.stringify(todoArr));
}


function checkLocalStorage() {
  if (!localStorage.todos) localStorage.setItem("todos", "[]");
  else {
    // load from local storage
    todoArr = JSON.parse(localStorage.todos);
    for (let td of todoArr) {
      renderTodo(td.text, td.completed)
    }
  }
}


function getChildIndexOf(element) {
  let parent = element.parentElement;

  for (let i=0; i<parent.children.length; i++) {
    if (element === parent.children[i]) return i;
  }
}


// main
document.addEventListener("DOMContentLoaded", loadPage);