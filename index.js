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
  constructor(name, description, read, actions) {
    this.name = name
    this.description = description
    this.read = read
    this.actions = actions
}
}
 // ________________________________________________________________________


 // OBJECTS
const note = new Item(
  'note',
  'A NOTE sits on the counter.',
  "\n\nDear valued customer,\nWe wanted to express our sincere gratitude for you offer to help us find our missing family recipe book.\nAs a token of our appreciation, we have left a special surprise for you to discover somewhere in the cafe.\nWe hope it brings a smile to your face :)\nThank you again for you unwavering support. We truly appreciate it.\n\nWarm Regards,\nThe Brown Bear Cafe Owners\n\n",
  ['read', 'take']
  )

const pastry = new Item(
  'pastry',
  'A PASTRY sits on the table.',
  "\n>> Wow! I can't believe they left me my favorite pastry! I'm so grateful. <<",
  ['take']
)

const mainDining = new Room (
  "Main Dining Room",
  "\nYou are in the MAIN DINING area. You are facing the entrance to the PATIO. Behind you is a door to the KITCHEN.",
  [note]
)

const patio = new Room (
  "Patio",
  "\nYou are on the PATIO. Behind you is the MAIN DINING room",
  []
)

const kitchen = new Room (
  "Kitchen",
  "\nYou are in the KITCHEN. The MAIN DINING room is in front of you.",
  [pastry]
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
  'note': note,
  'pastry': pastry
}
 // ________________________________________________________________________



async function start() {

  // INITIALIZE
  let currentRoom = 'main dining'
  const validCommands = ['help', 'move', 'read', 'take', 'i', 'exit']
  const strCommands = `\n    VALID COMMANDS:    \n` + validCommands.join(', ')
  const askforInput = '\nWhat would you like to do next? '
  let inventory = []
  // ________________________________________________________________________

  // INTRODUCTION
  console.log(strCommands)
  const welcomeMessage = `\nWelcome to the Brown Bear Cafe!
  \nTo help save the family business, you are tasked with finding the cafe owner's missing family recipe book.
  ${locationLookup[currentRoom].description + `\n` + objLookup['note'].description}`

  console.log(welcomeMessage)
  // ________________________________________________________________________

  // GAME LOOP
  while (true) {
    let answer = await ask(askforInput)
    answer = answer.toLowerCase()
    if (answer === 'exit') break
    
    if (validateInput(answer, validCommands, currentRoom, inventory, strCommands) === true) {
       currentRoom =  doAction(answer, currentRoom, inventory)
      }
      
    }
  // ________________________________________________________________________


  process.exit()
}

start()

function doAction(input, location, inv) { // This is a function that does something according to the action and returns the current location each time
  input = input.split(' ')
  let action = input[0]
  let entity = input[1]
  if (input.length > 2) entity = input.slice(1).join(' ') // If the room / item is two words or more
    
  if (action === 'read') {  
    console.log(objLookup[entity].read)
  } else if (action === 'take') {
    objLookup[entity].description = ''
    if (inv.includes(entity)) {
      console.log('\nYou already took this item')
    } else {
      console.log(objLookup[entity].read)
      inv.push(objLookup[entity].name)
      console.log(`\nYou take the ${entity}. You can now find it in your inventory.`)
    }
  } else if (action === 'move') {
    console.log(`\nMoving to ${entity}...`)
    location = entity
    console.log(locationLookup[location].description)
    locationLookup[location].items.forEach (itm => console.log(itm.description))
  }

  return location
}



function validateInput(input, validcmds, location, inv, strcmds) { // Function that validates all user input - returns true or false
  let action = input.split(' ')[0]
  let entity = input.split(' ')[1]

  if (input.split(' ').length > 2) entity = input.split(' ').slice(1).join(' ') // If room / item is two words

  let availItems = locationLookup[location].items.map(obj => obj.name)
  if (action === 'i') {
    console.log(`\n INVENTORY:`)
    inv.forEach(item => console.log(`    ${item}`))
    return false
  } else if (action === 'help'){
    console.log(strcmds)
    console.log(`\n>> Enter (command + item/room) to interact with your surroundings. <<\n>> Valid items/rooms are in all uppercase letters. <<`)
    return false
  } else if (!validcmds.includes(action)) { // Check if user entered a valid action
    console.log(`\nSorry, I don't know how to "${input}"...`)
    return false
  } else if (input.split(' ').length < 2) { // Check if user entered an item / room
    (input === 'move') ? console.log('\nMove where?') : console.log(`\nWhat do you want to ${input}?`)
    return false
  } else if (action === 'move' && !stateMachine[location].includes(entity)) { // Check if player input action is move and the room ISN'T available
    console.log(`\nI cant't go from here to there...`) 
    return false
  } else if (action === 'move' && stateMachine[location].includes(entity)) { // Check if player input action is move and the room IS available
    return true
  } else if (!availItems.includes(entity)) { // Check if item exists in that room
    console.log(`\nI can't find a "${entity}" in this room...`)
    return false
  } else if (!objLookup[entity].actions.includes(action)) { // Check if action can be used on that item.
    console.log(`\nI can't ${action} this item.`)
    return false
  } else {
    return true
  }
}