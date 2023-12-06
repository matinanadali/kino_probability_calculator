import './try_it.css';
import React from 'react';
import { useState } from 'react';
const numbers = [];
const allProbabilities = [];
const allLoss = [];
const profits = [
  [2.5],
  [5, 1],
  [25, 2.5, 0],
  [100, 4, 1, 0],
  [450, 20, 2, 0, 0],
  [1600, 50, 7, 1, 0, 0],
  [5000, 100, 20, 3, 1, 0, 0],
  [15000, 1000, 50, 10, 2, 0, 0, 0],
  [40000, 4000, 200, 25, 5, 1, 0, 0, 0],
  [100000, 10000, 500, 80, 20 , 2, 0, 0, 0,0],
  [500000, 15000,1500, 250, 50, 10, 1, 0, 0, 0, 0],
  [1000000, 25000, 2500, 1000, 150, 25, 5, 0, 0, 0, 0, 0]
]
let numbersForMinLoss = 0;
let numbersForMaxLoss = 0;

const factorial=(n, stop) => {
  if (n === stop) return 1;
  return n * factorial(n-1, stop);
}

//calculates combination c(n,k) - we use stop in order not to calculate factorials that get simplified
const combination = (n, k) => {
  let stop = Math.min(k, n-k);
  return factorial(n, stop) / factorial(Math.max(k, n-k), 1);
}

const allCases = combination(80,20);

//calculate probability of getting k numbers right when you choose n
const calculateProbability = (n,k) => {
  const probability = combination(80-n, 20-k) / allCases * combination(n,k);
  return probability.toFixed(6);
}

//calculate loss when player chooses k numbers
const calculateLoss = (k) => {
  let loss = 0;
  for (let i = 0; i < profits[k-1].length; i++) {
    console.log(allProbabilities[k-1][i], k, i)
    loss += allProbabilities[k-1][i] * profits[k-1][profits[k-1].length - 1 -i];
  }
  return 1 - loss;
}


//generate number buttons from 1 to 80
const generateNumbers= () => {
    for (let i = 0; i < 80; i++) {
        numbers[i] = i + 1;
  }
}

//fill allProbalities array with 12 arrays, one for each every amount of numbers the player can choose
const generateProbabillities = () => {
  for (let i = 1; i <= 12; i++) {
    let probabilities_for_i_numbers = [];
    for (let j = 1; j <= i; j++) {
      let probability = calculateProbability(i, j);
      probabilities_for_i_numbers.push(probability);
    }
    allProbabilities.push(probabilities_for_i_numbers);
  }
}

//fill the allLoss array with the loss percentage when the player chooses i numbers
const generateLosses = () => {
  for (let i = 1; i <= 12; i++) {
   let loss = calculateLoss(i);
   allLoss.push(loss);
  }
}

//find for which amount of numbers the loss gets its max and min value
const findMinMaxLoss = () => {
  let currentMinLoss = allLoss[0];
  let currentMaxLoss = allLoss[0];
  for (let i = 0; i < 12; i++) {
    if (allLoss[i] < currentMinLoss) {
      currentMinLoss = allLoss[i];
      numbersForMinLoss = i;
    }
    if (allLoss[i] > currentMaxLoss) {
      currentMaxLoss = allLoss[i];
      numbersForMaxLoss = i;
    }
  }
}

generateProbabillities();
generateNumbers();
generateLosses();
findMinMaxLoss();

function Try_it() {
  const [showProbability, setShowProbability] = useState(false);
  const [numbers_chosen, setNumbersChosen] = useState([]);
  const [selectedValue, setSelectedValue] = useState(1);

  const handlePlay= () => { 
    if (numbers_chosen.length === 0) {
      alert("You should choose at least one number"); 
    } else {
    let number_buttons = document.getElementsByClassName("number_button");
    for (let i = 0; i < 80; i++) {
      number_buttons[i].disabled = true;
    }
    setShowProbability(true);
    }
  }
  
  const handleNumberButtonClick = (number) => {
    if (numbers_chosen.includes(number)) {
      const button = document.getElementById(`button${number}`)
      button.classList.remove("selected");
      setNumbersChosen(numbers_chosen.filter((n) => n !== number));
    } else {
      if (numbers_chosen.length >= 12) {
        alert("You have already chosen 12 numbers.")
      }  else {
         const button = document.getElementById(`button${number}`)
         button.classList.add("selected");
         setNumbersChosen([...numbers_chosen, number]);
      }
    }
  };

  const handleReset = () => {
    let number_buttons = document.getElementsByClassName("number_button");
    for (let i = 0; i < 80; i++) {
      number_buttons[i].disabled = false;
      number_buttons[i].classList.remove("selected");
    }
    setNumbersChosen([]);
    setShowProbability(false);
  }
  
  const handleDropdownChange = (e) => {
    setSelectedValue(e.target.value);
  };
  
  return (
    <div className='App'>
    <div className="Try_it">
      <h3>1. Try it yourself!</h3>
      <div>Choose from 1 up to 12 numbers from the grid below to find out the probability of getting them right, when 20 out of 80 numbers are picked up randomly.</div>
      <div className='numbers-grid'> {numbers.map((number) => 
        <button 
        id = {`button${number}`}
        className='number_button' 
        onClick={() => handleNumberButtonClick(number)}>{number}</button>
        )}       
      </div>
      <button className='play-button' onClick={handlePlay}>Play</button>
      <div className='probability-section'>
        {showProbability ? (
          <div>
            <div>Probability of getting them all ({numbers_chosen.length}) right: {allProbabilities[numbers_chosen.length - 1][numbers_chosen.length-1]}</div>
            <div>Probability of getting: 
              <form>
                <select id="dropdown" onChange={(e) => handleDropdownChange(e)}>
                    {numbers_chosen.map((n, i) => (
                      <option value={i + 1}>{i + 1}</option>
                ))}
                </select>
              </form>
                / {numbers_chosen.length} right: {selectedValue ? allProbabilities[numbers_chosen.length - 1][selectedValue-1] : 0}
            </div>
            <div>It is practically as disappointing as losing {100*allLoss[numbers_chosen.length-1]} % of the money you bet.</div>
            <div>{(showProbability) ? <button className='play-button' onClick={handleReset}>Try again</button> : ""}</div>
          </div>
        ) : (
        <div></div>
        )}
      </div>
      </div>
      <div className='board-section'>
        <h3>2. Comparison Board</h3>
        <table>
          <thead>
            <tr>
              <td>You choose...</td>
              <td>You lose...</td>
            </tr>
          </thead>
          <tbody>
          {allLoss.map((loss, i) => 
          <tr className={(i === numbersForMinLoss) ? "minLoss" : (i === numbersForMaxLoss) ? "maxLoss" : "normal"}>
            <td>{i+1} {(i>0) ? "numbers" : "number"}</td>
            <td>{loss}</td>
          </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Try_it;