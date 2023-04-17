const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}


// CLASSES
class Room {
  constructor(name, description, items) {
    this.name = name
    this.description = description
    this.items = []
  }
}

class Item {
  constructor(name, description) {
    this.name = name
    this.description = description
  }
}
 // ________________________________________________________________________


 // OBJECTS
const note = new Item(
  'Note',
  "\n\nDear valued customer,\nWe wanted to express our sincere gratitude for you offer to help us find our missing family recipe book.\nAs a token of our appreciation, we have left a special surprise for you to discover somewhere in the cafe.\nWe hope it brings a smile to your face :)\nThank you again for you unwavering support. We truly appreciate it.\n\nWarm Regards,\nThe Brown Bear Cafe Owners\n\n")

const mainDining = new Room (
  "Main Dining Room",
  "You are in the main dining area. A note sits on the counter. You are facing the front door to the outdoor patio. Behind you is a door to the kitchen.",
  [note]
)

const patio = new Room (
  "Patio",
  "You are on the Patio.",
  []
)

const kitchen = new Room (
  "Kitchen",
  "You are in the Kitchen.",
  []
)
 // ________________________________________________________________________


// STATE MACHINE + LOOKUPS
const stateMachine = {
  'main dining': ['patio', 'kitchen'],
  'patio': ['main dining'],
  'kitchen': ['main dining']
}

const locationLookup = {
  'main dining': mainDining,
  'patio': patio,
  'kitchen': kitchen
}

const objLookup = {
  'note': note
}
 // ________________________________________________________________________



async function start() {

  // Initialize
  let currentRoom = 'main dining'
  const validCommands = ['move', 'read', 'take']
  const strCommands = `VALID COMMANDS:\n${validCommands}`
  const askforInput = '\nWhat would you like to do next? '
  // ________________________________________________________________________

  console.log(strCommands)
  const welcomeMessage = `\nWelcome to the Brown Bear Cafe!
  \nTo help save the family business, you are tasked with finding the cafe owner's missing family recipe book.
  \n${locationLookup[currentRoom].description}`

  console.log(welcomeMessage)

  while (true) {
    let answer = await ask(askforInput)
    if (validateInput(answer, validCommands) === true) {
      if (answer.startsWith('read')) {  
        answer = answer.split(' ')
        console.log(objLookup[answer[1]].description)
      }
      break
    }
  }

  

  process.exit()
}

start()

function validateInput(input, validcmds) {
  if (!validcmds.includes(input.split(' ')[0])) {
    console.log(`\nSorry, I don't know how to ${input}...`)
    return false
  } else if (input.split(' ').length < 2) {
    (input === 'move') ? console.log('\nMove where?') : console.log(`\nWhat do you want me to ${input}?`)
    return false
  } else {
    return true
  }
}


// Validate commands?
// while (true) {
//   if (answer.startsWith('read')) break
//   console.log(`"${answer}" is not a valid command!`)
//   let answer = await ask("What would you like to do? ")
// }