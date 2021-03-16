function Todoinput({ $input, onSubmit }) {
    
  $input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const newInput = e.target.value
      console.log(newInput)
      onSubmit(newInput)
      e.target.value = ''
    }
  })
}

export default Todoinput