import { Box, Button, Heading, Input, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [excludeValue, setExcludeValue] = useState('');
  const [maxMultipliers, setMaxMultipliers] = useState({ 200: 0, 230: 0, 250: 0, 350: 0, 450: 0 });
  const [result, setResult] = useState(null);

  const numbers = [200, 230, 250, 350, 450];

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleExcludeChange = (e) => {
    const values = e.target.value.split(',').map(val => parseInt(val.trim(), 10)).filter(val => !isNaN(val));
    setExcludeValue(values);
  };

  const handleMaxMultiplierChange = (num) => (e) => {
    setMaxMultipliers({ ...maxMultipliers, [num]: parseInt(e.target.value, 10) });
  };

  const handleCalculate = () => {
    const target = parseInt(inputValue, 10);
    const exclude = parseInt(excludeValue, 10);

    if (isNaN(target)) {
      setResult('Please enter a valid number');
      return;
    }

    const filteredNumbers = isNaN(exclude) ? numbers : numbers.filter(num => num !== exclude);

    const findCombination = (target, numbers, maxMultipliers) => {
      const result = numbers.map(num => ({ num, multiplier: 0 }));
      let remaining = target;

      // Apply the specified maximum multipliers first
      for (let i = 0; i < numbers.length; i++) {
        const num = numbers[i];
        const maxMultiplier = maxMultipliers[num];
        if (maxMultiplier > 0) {
          const maxContribution = num * maxMultiplier;
          if (remaining >= maxContribution) {
            result[i].multiplier = maxMultiplier;
            remaining -= maxContribution;
          } else {
            result[i].multiplier = Math.floor(remaining / num);
            remaining -= num * result[i].multiplier;
          }
        }
      }

      // Distribute the remaining value among the other numbers
      while (remaining !== 0) {
        let distributed = false;
        for (let i = 0; i < numbers.length; i++) {
          const num = numbers[i];
          if ((result[i].multiplier < maxMultipliers[num] || maxMultipliers[num] === 0) && remaining >= num) {
            result[i].multiplier += 1;
            remaining -= num;
            distributed = true;
          } else if (remaining < num && remaining > 0) {
            result[i].multiplier += 1;
            remaining -= num;
            distributed = true;
          }
        }
        if (!distributed) break; // If no distribution happened, break the loop to avoid infinite loop
      }

      return result;
    };

    const combination = findCombination(target, filteredNumbers, maxMultipliers);
    setResult(combination);
  };

  return (
    <div>
      <VStack border={'1px,solid,black'} borderRadius={10} spacing={4} align="center" width="100%" margin="30px auto" padding={4}>
      <Heading as="h1" size="xl" my={5} textAlign={'center'}>COREPLANT Ply Combination Calculator</Heading>
      <Input
        type="number"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter a Ply GSM"
        w="75%"
      />
      <Input
        type="number"
        value={excludeValue}
        onChange={handleExcludeChange}
        placeholder="Enter a ply thickness to exclude"
        w="75%" 
      />
      
      {numbers.map(num => (
        <div key={num}>
          <label>
            Max {num} multiplier:
            <br />
            <Input
              type="number"
              value={maxMultipliers[num]}
              onChange={handleMaxMultiplierChange(num)}
              placeholder={`Max ${num} multiplier`}
              w="100%"  

           />
          </label>
          
        </div>
      ))}
      <Button onClick={handleCalculate} w={'25%'}>Calculate</Button>
      {result && (
        <div>
          <Heading>Result:</Heading>
          {typeof result === 'string' ? (
            <p>{result}</p>
          ) : (
            <ul>
              {result.map((item, index) => (
                <li key={index}>
                  <Box fontSize={20}>{item.num} x {item.multiplier}</Box>
                  
                </li>
              ))}
            </ul>
          )}
          
        </div>
        
      )}
      </VStack>
    </div>
  );
}

export default App;