function Todotable({ $todoTable, initialTables, onTableClick, onAddTable, onDeleteTable }) {
    this.tables = initialTables
    
    this.renderTables = () => {
        const HTMLString = this.tables.map((v, i) => {
            return `<div class="todo-table-item" data-id=${i}>${v}</div>`
        })
        $todoTable.innerHTML = HTMLString.join('')
    }
  
    this.renderTables()

    $todoTable.addEventListener('click', (e) => {
        const selectedTable = e.target.dataset.id
        onTableClick(selectedTable)
    })

    this.updateTables = (newTables) => {
        this.tables = newTables
        this.renderTables()
    }

    document.querySelector('#todo-table-add').addEventListener('click', (e) => {
        const newTable = prompt('새로운 리스트를 입력하시오')
        if (this.tables.indexOf(newTable) < 0) {
            onAddTable(newTable)
        } else {
            alert('같은 이름의 리스트가 이미 있습니다!')
        }
        e.stopPropagation()
    })
    
    document.querySelector('#todo-table-delete').addEventListener('click', (e) => {
        e.stopPropagation()
        if (confirm('리스트를 삭제하시겠습니까?')) {
            onDeleteTable()
        }
    })
  }
  
  export default Todotable