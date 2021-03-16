import Todoinput from './Components/TodoInput.js'
import Todotable from './Components/TodoTable.js'
import Todolist from './Components/TodoList.js'
import UserLogin from './Components/UserLogin.js'

function App() {
  let appData
  const $title = document.querySelector('#user-name')
  const $placeholder = document.querySelector('#input-label')
  const $input = document.querySelector('#todo-input')
  const $todoList = document.querySelector('#todo-list')
  const $todoTable = document.querySelector('#todo-table')
  
  const $changeUser = document.querySelector('#change-user')

  const userLogin = new UserLogin({
    $changeUser,
    onLogin: (username) => {
      this.setState({newUser: username})
    },
    onAutoConfig: (username) => {
      this.setState({autoUser: username})
    }
  })
  
  this.state = {
    user: undefined,
    pass: undefined,
    currentTableId: undefined,
    tables: []
  }
  this.todoData = []

  const todoInput = new Todoinput({
    $input: $input,
    onSubmit: (newInput) => {
      if (this.state.currentTableId === undefined) {
        alert('리스트를 먼저 선택해주세요!')
      } else if (newInput !== '') {
        const newItem = {
          table: this.state.tables[this.state.currentTableId],
          completed: false,
          content: newInput
        }
        this.setState({newItem: newItem})
      }
    }
  })

  const todoList = new Todolist({
    $todoList: $todoList,
    initialData: this.todoData,
    onToggle: (targetId) => {
      this.setState({toggleId: targetId})
    },
    onDragDrop: (dragId, dropTable) => {
      this.setState({dragId: dragId, dropTable: dropTable})
    },
    onDelete: (deleteId) => {
      this.setState({deleteId: deleteId})
    },
    initialTable: this.state.tables[this.state.currentTableId]
  })

  const todoTable = new Todotable({
    $todoTable,
    initialTables: this.state.tables,
    onTableClick: (selectedTable) => {
      this.setState({selectedTable: selectedTable})
    },
    onAddTable: (newTable) => {
      this.setState({newTable})
    },
    onDeleteTable: () => {
      this.setState({deleteTableId: this.state.currentTableId})
    }
  })

  this.setState = ({ dragId, dropTable, toggleId, selectedTable, deleteId, newItem, newTable, deleteTableId, newUser, autoUser }) => {
    if (dragId && dropTable) {
      this.todoData[dragId].table = dropTable
    }
    if (toggleId) {
      this.todoData[toggleId].completed = !this.todoData[toggleId].completed
    } 
    if (selectedTable) {
      this.state.currentTableId = parseInt(selectedTable, 10)
      todoList.updateList({selectedTable: this.state.tables[this.state.currentTableId]})
    }
    if (deleteId) {
      this.todoData = this.todoData.filter((_, i) => i !== parseInt(deleteId, 10))
      todoList.updateList({newData: this.todoData})
    }
    if (newItem) {
      this.todoData.push(newItem)
    }
    if (newTable) {
      this.state.tables.push(newTable)
      todoTable.updateTables(this.state.tables)
    }
    if (deleteTableId !== undefined) {
      if (this.state.currentTableId === 0) {
        alert("ToDo 리스트는 삭제할 수 없습니다.")
        return
      }
      const deleteTable = this.state.tables[deleteTableId]

      this.state.tables = this.state.tables.filter((_, i) => i !== deleteTableId)
      todoTable.updateTables(this.state.tables)
      
      // 같은 Table 이름의 Todo들이 같이 지워짐...
      // 그냥 같은 이름 Table을 막아야할 듯..?   <= 일단 이렇게 해놓음
      // 아니면 Todo마다 저장된 table을 인덱스로 바꿔야됨
      this.todoData = this.todoData.filter((v) => v.table !== deleteTable)
      this.state.currentTableId -= 1
      todoList.updateList({newData: this.todoData, selectedTable: this.state.tables[this.state.currentTableId]})
    }

    if (newUser) {
      if (!localStorage.getItem(newUser)) {
        alert('입력하진 유저가 존재하지 않습니다.')
      } else {
        try {
          appData = JSON.parse(window.localStorage.getItem(newUser))
        } catch (error) {
          throw error
        }
        this.state = appData.state
        this.todoData = appData.data
        todoTable.updateTables(this.state.tables)
        todoList.updateList({newData: this.todoData, selectedTable: this.state.tables[this.state.currentTableId]})
      }
    }
    if (autoUser !== undefined) {
      localStorage.setItem('AutoLogin', autoUser)
    }
    localStorage.setItem(this.state.user, JSON.stringify({ state: this.state, data: this.todoData }))

    this.render()
  }

  this.render = () => {
    if (this.state.user) {
      $title.innerHTML = `<span class="display-user">${this.state.user}</span>'s ${this.state.tables[this.state.currentTableId]} 리스트`
      $placeholder.innerHTML = `${this.state.tables[this.state.currentTableId]}...`
      todoList.renderList()
    }
  }

  let prevUser
  try {
    prevUser = window.localStorage.getItem('AutoLogin')
  } catch (error) {
    throw error
  }
  if (!prevUser || prevUser === '') {
    const $modal = document.querySelector('.modal');
    $modal.style.display = "block";
  } else {
    this.setState({newUser: prevUser})
  }

  this.render()
}

export default App