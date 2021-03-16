function Todolist({$todoList, initialData, onToggle, onDragDrop, onDelete, initialTable}) {

  this.data = initialData
  this.table = initialTable

  $todoList.addEventListener("click", (e) => {
    if (e.target.className !== 'todo-empty') {
      if (e.target.className === 'delete-todo') {
        const deleteId = e.target.closest('.todo-item').dataset.id
        onDelete(deleteId)
      } else {
        const targetId = e.target.closest('.todo-item').dataset.id
        onToggle(targetId)
      }
    }
  })

  this.renderList = () => {
    const HTMLString = this.data.map((v, i) => {
      if (v.table === this.table) {
        const content = v.completed
          ? `<s class='todo-complete'>${v.content}</s>`
          : `${v.content}`
        return `<div class='todo-item' draggable='true' data-id='${i}'><button class='delete-todo'>&times;</button>`+content+`</div>`    
      }
    })
    $todoList.innerHTML = HTMLString.some(v => v) ? HTMLString.join('') : `<div class='todo-empty'>등록된 항목이 없습니다...</div>`
  }

  this.updateList = ({ newData, selectedTable }) => {
    if (newData) {
      this.data = newData
    }
    if (selectedTable) {
      this.table = selectedTable
    }
    this.renderList()
  }

  this.renderList()



  let dragged
  /* 드래그 가능한 대상에서 이벤트 발생 */
  document.addEventListener("drag", function(event) {
  }, false);
  // 요소를 반투명하게 함
  document.addEventListener("dragstart", (e) => {
    dragged = e.target;
    e.target.style.opacity = .3;
  }, false);
  // 투명도를 리셋
  document.addEventListener("dragend", (e) => {
    e.target.style.opacity = "";
  }, false);

  /* 드롭 대상에서 이벤트 발생 */
  document.addEventListener("dragover", (e) => {
    // 드롭을 허용하도록 prevetDefault() 호출
    e.preventDefault();
  }, false);

  document.addEventListener("dragenter", (e) => {
    if (e.target.className == "todo-table-item") {
      e.target.style.color = "white";
      e.target.style.background = "salmon";
    }
  }, false);
  document.addEventListener("dragleave", (e) => {
    if (e.target.className == "todo-table-item") {
      e.target.style.color = "";
      e.target.style.background = "";
    }
  }, false);

  document.addEventListener("drop", (e) => {
    e.preventDefault();
    if (e.target.className == "todo-table-item") {
      e.target.style.color = "";
      e.target.style.background = "";
      onDragDrop(dragged.dataset.id, e.target.innerHTML)
    }
  }, false);
}

export default Todolist