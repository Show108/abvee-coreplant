import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  HStack,
  Text,
  List,
  ListItem,
  IconButton,
} from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../src/components/ui/dialog";
import { FaPlus } from "react-icons/fa";
import React, { useState } from "react";
import Select from "react-select";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [excludeValues, setExcludeValues] = useState([]);
  const [maxMultipliers, setMaxMultipliers] = useState({});
  const [result, setResult] = useState([]);
  const [numbers, setNumbers] = useState([200, 230, 250, 350, 450]);
  const [newNumber, setNewNumber] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleExcludeChange = (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    setExcludeValues(values);
  };

  const handleMaxMultiplierChange = (num) => (e) => {
    setMaxMultipliers({
      ...maxMultipliers,
      [num]: parseInt(e.target.value, 10),
    });
  };

  const handleCalculate = () => {
    const target = parseInt(inputValue, 10);

    if (isNaN(target)) {
      setResult([{ num: "Error", multiplier: "Please enter a valid number" }]);
      return;
    }

    const filteredNumbers = filterNumbers(numbers, excludeValues);
    const combination = findCombination(
      target,
      filteredNumbers,
      maxMultipliers
    );

    setResult(Array.isArray(combination) ? combination : []);
  };

  const filterNumbers = (numbers, excludeValues) => {
    return numbers.filter((num) => !excludeValues.includes(num));
  };

  const findCombination = (target, numbers, maxMultipliers) => {
    const result = numbers.map((num) => ({ num, multiplier: 0 }));
    let remaining = target;

    // Apply the specified maximum multipliers first
    for (let i = 0; i < numbers.length; i++) {
      const num = numbers[i];
      const maxMultiplier = maxMultipliers[num];
      if (maxMultiplier !== undefined && maxMultiplier > 0) {
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

    // Distribute the remaining value among the other numbers as evenly as possible
    while (remaining > 0) {
      let distributed = false;
      for (let i = 0; i < numbers.length; i++) {
        const num = numbers[i];
        const maxMultiplier = maxMultipliers[num];
        if (
          remaining >= num &&
          (maxMultiplier === undefined || result[i].multiplier < maxMultiplier)
        ) {
          result[i].multiplier += 1;
          remaining -= num;
          distributed = true;
        }
      }
      if (!distributed) break; // If no distribution was possible, break the loop
    }

    return result;
  };

  const handleAddNumber = () => {
    const num = parseInt(newNumber, 10);
    if (!isNaN(num) && !numbers.includes(num)) {
      setNumbers([...numbers, num]);
      setNewNumber("");
      onClose();
    }
  };

  const options = numbers.map((num) => ({ value: num, label: num }));

  return (
    <VStack spacing={4} align="stretch" width="50%" margin="0 auto" padding={4}>
      <Heading as="h1" size="xl" my={5} textAlign={"center"}>
        COREPLANT Ply Combination Calculator
      </Heading>
      <Input
        type="number"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter a Ply GSM"
        w="75%"
      />
      <Select
        isMulti
        options={options}
        onChange={handleExcludeChange}
        placeholder="Select numbers to exclude"
        closeMenuOnSelect={false}
      />
      {numbers.map((num) => (
        <HStack key={num}>
          <Text>Max {num} multiplier:</Text>
          <Input
            type="number"
            value={maxMultipliers[num] || ""}
            onChange={handleMaxMultiplierChange(num)}
            placeholder={`Max ${num} multiplier`}
          />
        </HStack>
      ))}

      <Button onClick={handleCalculate} bgColor="black">
        Calculate
      </Button>
      {result.length > 0 && (
        <Box
          borderWidth="1px"
          borderRadius="lg"
          padding={4}
          marginTop={4}
          bg="gray.50"
        >
          <Heading size="md" mb={4}>
            Result:
          </Heading>
          <List.Root spacing={3}>
            {result.map((item, index) => (
              <List.Item key={index}>
                <Box fontSize={20}>
                  {item.num} x {item.multiplier}
                </Box>
              </List.Item>
            ))}
          </List.Root>
        </Box>
      )}
      <DialogRoot
        size="cover"
        placement="center"
        motionPreset="slide-in-bottom"
      >
        <DialogTrigger asChild>
          <Button bgColor='teal' mt={5} >add ply</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Ply</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody>
            <Input
              type="number"
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
              placeholder="Enter a new number"
            />
          </DialogBody>
          <DialogFooter>
            <Button colorScheme="teal" onClick={handleAddNumber}>
              Add 
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </VStack>
  );
}

export default App;
