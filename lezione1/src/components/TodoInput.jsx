import { useState } from 'react'

function TodoInput({ onAggiungi }) {
  const [testo, setTesto] = useState('')

  function handleSubmit() {
    const testoPulito = testo.trim()  
    if (testoPulito === '') return    

    onAggiungi(testoPulito)          
    setTesto('')                    
  }

  return (
    <div className="todo-input">
      <input
        type="text"
        value={testo}
        onChange={e => setTesto(e.target.value)}
        placeholder="Cosa devi fare?"
      />
      <button onClick={handleSubmit}>Aggiungi</button>
    </div>
  )
}

export default TodoInput