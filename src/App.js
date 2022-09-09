import './App.css';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

//components
import Die from './components/Die';

function App() {

  const [dice, setDice] = useState(allNewDice())
  const [count, setCount] = useState(0)
  const [tenzies, setTenzies] = useState(false)
  const [won, setWon] = useState(false)
  const [lose, setLose] = useState(false)

  function generateNewDie() {
    return {
      number: Math.ceil(Math.random() * 6), 
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
    const array = []

    for (let i=0; i < 10; i++) 
      {array.push(generateNewDie())}
    return array
  }

  function holdDice(id) {
    setDice(prevState => prevState.map(x => {
      return x.id === id ? {...x, isHeld: !x.isHeld} : x
    }))
  }

  function handleRoll(id) {
    setDice(prevState => prevState.map(x => {
      return x.isHeld ? x : generateNewDie()
    }))
    setCount(prevState => prevState + 1)
  }

  function playAgain(id) {
    setDice(allNewDice())
    setCount(0)
    setTenzies(false)
    setLose(false)
  }

  const dices = dice.map((x) => {
    return (
      <Die 
        key={x.id}
        value={x.number}
        isHeld={x.isHeld}
        onClick={() => holdDice(x.id)}
      />
    )
  })

  useEffect(() => {
    const allHeld = dice.every(x => x.isHeld)
    const dieValue = dice[0].value
    const allSameNumber = dice.every(x => x.value === dieValue)
    if(allHeld && allSameNumber && count < 10) {
      setWon(true)
      setTenzies(true)
    } else if (count > 10) {
      setTenzies(true)
      setLose(true)
    }

  },[dice])

  return (
    <div className="App">
      <main className='tenzies--mid-square'>
        {
          won && <Confetti />
        }
        <h1 className="die--title">FunDices</h1>
        <p className="die--instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls. If you do it within 10 rolls, you win! 🥳</p>
        <div className="die--box">
          {dices}
        </div>
        {
          tenzies ? 
          <button className='die--button' onClick={() => playAgain(dice.id)}>Play again</button> :
          <button className='die--button' onClick={() => handleRoll(dice.id)}>Roll</button>
          
        }
        {
          count > 0 && <h3 className='die--count'>{`You've made ${count} ${count === 1 ? "attempt" : "attempts"}`}</h3> 
        }
        {
          won && <h3 className='dice--won'>Congratulations! You completed it in less than 10 attempts 🥳</h3>
        }
        {
          lose && <h3 className='dice--lose'>Ummm, you had more than 10 attempts. Try again!</h3>
        }
      </main>
    </div>
  );
}

export default App;
