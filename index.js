const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}


// CLASSES
class Room {
  constructor(name, description, items, isLocked) {
    this.name = name
    this.description = description
    this.items = items
    this.isLocked = isLocked
  }
}

class Item {
  constructor(name, description, inspect, actions, isStorage, storageType, storage) {
    this.name = name
    this.description = description
    this.inspect = inspect
    this.actions = actions
    this.isStorage = isStorage
    this.storageType = storageType
    this.storage = storage
}
}
 // ________________________________________________________________________


 // ITEMS
let note = new Item(
  'note',
  'A NOTE sits on the counter.',
  "\n\nDear valued customer,\nWe wanted to express our sincere gratitude for you offer to help us find our missing family recipe book.\nAs a token of our appreciation, we have left a special surprise for you to discover somewhere in the cafe.\nWe hope it brings a smile to your face :)\nThank you again for you unwavering support. We truly appreciate it.\n\nWarm Regards,\nThe Brown Bear Cafe Owners\n\n",
  ['inspect', 'take'],
  false,
  null,
  []
  )

let pastry = new Item(
  'pastry',
  'A PASTRY sits on the table.',
  "\n>> Wow! I can't believe they left me my favorite pastry! I'm so grateful. <<",
  ['inspect', 'take'],
  false,
  null,
  []
)

let keypad = new Item(
  'keypad',
  '\nA KEYPAD lock sits on the basement door..',
  "\n>> Please type: CODE + ENTER <<",
  ['inspect', '1245'],
  false,
  null,
  []
)

let pottedPlant = new Item (
  'plant',
  "A potted PLANT sits next to the door. There's something suspicious about it...",
  "",
  ['inspect'],
  true,
  'storage',
  ['stone']
)

let stone = new Item (
  'stone',
  '\nA STONE with some writing inscribed on it sits inside of the pot. I wonder what it says?',
  "\n\nI'm a stone with letters so old,\nMy writing tells of secrets untold.\nFollow the recipe that you seek,\nMy code unlocks the door with a creak.\nThe first three numbers are one, two, four,\nThe last one's odd, but not a bore.\nArrange them well and heed my sign,\nUnlock the door and what you seek you'll find.\n\n",
  ['inspect', 'take'],
  true,
  'stored',
  ['plant']
)

let box = new Item (
  'box',
  'A random BOX sits in the center of the room. I wonder what is inside of it...',
  "I found the missing family recipe BOOK!!! It appears to have a sticky note attached to it..",
  ['inspect'],
  true,
  'storage',
  ['book']
)

let book = new Item (
  'book',
  "",
  "\n\nDear valued customer,\n\nWe wanted to express our sincere gratitude for your help in finding our missing family recipe book. It means the world to us that you took the time to assist us in our time of need.\n\nAs a token of our appreciation, we wanted to offer you this book. We hope that you will enjoy trying out some of our family's favorite recipes.\n\nThank you again for your unwavering support. We truly appreciate it.\n\nWarm Regards,\nThe Brown Bear Cafe Owners\n\n",
  ['inspect'],
  false,
  null,
  []
)
 // ________________________________________________________________________


// ROOMS
const mainDining = new Room (
  "Main Dining Room",
  "\nYou are in the MAIN DINING area. You are facing the entrance to the PATIO. Behind you is a door to the KITCHEN.",
  [note],
  false
)

const patio = new Room (
  "Patio",
  "\nYou are on the PATIO. Behind you is the MAIN DINING room",
  [pottedPlant, stone],
  false
)

const kitchen = new Room (
  "Kitchen",
  "\nYou are in the KITCHEN. The MAIN DINING room is in front of you. The BASEMENT door is behind you.",
  [pastry, keypad],
  false
)

const basement = new Room (
  "Basement",
  "\nYou are in the BASEMENT. The KITCHEN is just up the stairs.",
  [book, box],
  true
)
 // ________________________________________________________________________


// STATE MACHINE + LOOKUPS
const stateMachine = {
  'main dining': ['patio', 'kitchen'],
  'patio': ['main dining'],
  'kitchen': ['main dining', 'basement'],
  'basement': ['kitchen']
}

const locationLookup = {
  'main dining': mainDining,
  'patio': patio,
  'kitchen': kitchen,
  'basement': basement
}

const objLookup = {
  'note': note,
  'pastry': pastry,
  'plant': pottedPlant,
  'stone': stone,
  'book': book,
  'box': box,
  'keypad': keypad
}
 // ________________________________________________________________________



async function start() {

  // INITIALIZE
  let currentRoom = 'main dining'
  const validCommands = ['help', 'i', 'move', 'inspect', 'take', 'exit']
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
      
      if (currentRoom === 'the end') {
        console.log("\n>>> CONGRATULATIONS! You won the game! <<<\nThank you for playing :)")
        break
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
    
  if (action === 'inspect') { 
    if (objLookup[entity].isStorage === true) {
      if (objLookup[entity].storage.length === 0) {
        objLookup[entity].inspect = '\nThis is empty now!'
      } else {
        objLookup[entity].storage.forEach (item => console.log(objLookup[item].description))
      }
    }
    console.log(objLookup[entity].inspect)

    if (entity === 'book') {
      location = 'the end'
    }
  } else if (action === 'take') {
    objLookup[entity].description = ''

    if (inv.includes(entity)) {
      console.log('\nYou already took this item')
    } else {
      if (objLookup[entity].isStorage === true) {
        let container = objLookup[entity].storage[0]
        objLookup[container].storage = objLookup[container].storage.filter (item => item !== entity)
      }
      inv.push(objLookup[entity].name)
      console.log(`\nYou take the ${entity}. You can now find it in your inventory.`)
    }
  } else if (action === 'move') {
    console.log(`\nMoving to ${entity}...`)
    location = entity
    console.log(locationLookup[location].description)
    locationLookup[location].items.forEach (itm => { 
      if (itm.storageType === 'storage' || itm.storageType === null){
        console.log(itm.description)
      }
    })
  } else if (entity === 'enter') {
    if (action === '1245') {
      locationLookup['basement'].isLocked = false
      console.log('\n>> SUCCESS! <<\nYou unlocked the basement.')
    } else {
      console.log("\n>> NOT A VALID PASSWORD. PLEASE TRY AGAIN. <<")
    }
  }

  return location
}



function validateInput(input, validcmds, location, inv, strcmds) { // Function that validates all user input - returns true or false
  input = input.toLowerCase()
  let action = input.split(' ')[0]
  let entity = input.split(' ')[1]

  if (input.split(' ').length > 2) entity = input.split(' ').slice(1).join(' ') // If room / item is two words

  let availItems = locationLookup[location].items.map(obj => obj.name)

  if (location === 'kitchen' && entity === 'enter') {
    return true
  }

  if (action === 'i') { // Displays inventory
    console.log(`\n INVENTORY:`)
    inv.forEach(item => console.log(`    ${item}`))
    return false
  } else if (action === 'help'){ // Displays help info
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
  } else if (action === 'move' && locationLookup[entity].isLocked === true){
    console.log("\nI can't go here. This room is locked!")
    return false
  } else if (action === 'move' && stateMachine[location].includes(entity)) { // Check if player input action is move and the room IS available
    return true
  } else if (!availItems.includes(entity)) { // Check if item exists in that room
    if (inv.includes(entity) && objLookup[entity].actions.includes(action)) { // Check if item exists in invetory & if action can be used on that item
      return true
    } else {
    console.log(`\nI can't find a "${entity}" in this room or in my inventory...`)
    return false
    }
  } else if (!objLookup[entity].actions.includes(action)) { // Check if action can be used on that item.
    console.log(`\nI can't ${action} this item.`)
    return false
  } else {
    return true
  }
}