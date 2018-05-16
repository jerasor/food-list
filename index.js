const foodArray = []

const form = document.querySelector('#foodForm')

function renderColor(color) {
  const colorDiv = document.createElement('div')
  colorDiv.style.backgroundColor = color
  colorDiv.style.width = '6rem'
  colorDiv.style.height = '3rem'
  return colorDiv
}

function renderListItem(label, value) {
  const item = document.createElement('li')

  const term = document.createElement('dt')
  term.textContent = label

  const description = document.createElement('dd')

  try {
    description.appendChild(value)
  } catch(e) {
    description.textContent += value
  }

  const deleteButton = document.createElement('button')
  deleteButton.textContent = "Delete"

  item.appendChild(term)
  item.appendChild(description)
  item.appendChild(deleteButton)
  return item
}

function renderList(data) {
  const list = document.createElement('dl')
  const labels = Object.keys(data)
  labels.forEach(label => {
    const item = renderListItem(label, data[label])
    list.appendChild(item)
  })
  return list
}

const handleSubmit = function(ev) {
  ev.preventDefault()
  const f = ev.target
  const foodsForm = {
    foodName: f.foodName.value,
  }

  foodArray.push(foodsForm.foodName)

  const foods = document.querySelector('#foods')
  foods.appendChild(renderList(foodsForm))

  f.reset()
  f.foodName.focus()
}

form.addEventListener('submit', handleSubmit)