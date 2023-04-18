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
    this.items = items
  }
}

class Item {
  constructor(name, description, actions) {
    this.name = name
    this.description = description
    this.actions = actions
  }
}
 // ________________________________________________________________________


 // OBJECTS
const note = new Item(
  'note',
  "\n\nDear valued customer,\nWe wanted to express our sincere gratitude for you offer to help us find our missing family recipe book.\nAs a token of our appreciation, we have left a special surprise for you to discover somewhere in the cafe.\nWe hope it brings a smile to your face :)\nThank you again for you unwavering support. We truly appreciate it.\n\nWarm Regards,\nThe Brown Bear Cafe Owners\n\n",
  ['read', 'take']
  )

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

  // INITIALIZE
  let currentRoom = 'main dining'
  const validCommands = ['move', 'read', 'take']
  const strCommands = `VALID COMMANDS:\n${validCommands}`
  const askforInput = '\nWhat would you like to do next? '
  // ________________________________________________________________________

  // INTRODUCTION
  console.log(strCommands)
  const welcomeMessage = `\nWelcome to the Brown Bear Cafe!
  \nTo help save the family business, you are tasked with finding the cafe owner's missing family recipe book.
  \n${locationLookup[currentRoom].description}`

  console.log(welcomeMessage)
  // ________________________________________________________________________

  // GAME LOGIC LOOP
  while (true) {
    let answer = await ask(askforInput)
    if (validateInput(answer, validCommands, currentRoom) === true) {
        doAction(answer)
        break
      }
      
    }
  // ________________________________________________________________________

  

  process.exit()
}

start()

function doAction(input) {
  if (input.startsWith('read')) {  
    input = input.split(' ')
    console.log(objLookup[input[1]].description)
  } else if (input.startsWith('take')) {
    console.log(`You take the ${input[1]}. You can now find it in your inventory.`)
  }
}



function validateInput(input, validcmds, location) {
  let action = input.split(' ')[0]
  let item = input.split(' ')[1]
  let availItems = locationLookup[location].items.map(obj => obj.name)

  if (!validcmds.includes(action)) { // Check if user entered a valid action
    console.log(`\nSorry, I don't know how to "${input}"...`)
    return false
  } else if (input.split(' ').length < 2) { // Check if user entered an item / room
    (input === 'move') ? console.log('\nMove where?') : console.log(`\nWhat do you want me to ${input}?`)
    return false
  } else if (!availItems.includes(item)) { // Check if item exists in that room
    console.log(`\nI can't find a "${item}" in this room...`)
    return false
  } else if (!objLookup[item].actions.includes(action)) { // Check if action can be used on that item.
    console.log(`\nI can't ${action} this object.`)
    return false
  } else {
    return true
  }
}






// Old game loop...
// while (true) {
//   let answer = await ask(askforInput)
//   if (validateInput(answer, validCommands) === true) {
//     if (answer.startsWith('read')) {  
//       answer = answer.split(' ')
//       console.log(objLookup[answer[1]].description)
//     }
//     break
//   }
// }