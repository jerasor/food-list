const foodArray = []

const form = document.querySelector('#foodForm')

function addImageToFood (image, food){

    const foods = document.querySelector('#foods')

    foods.lastElementChild.childNodes.forEach(function(element){
        element.childNodes.forEach(function(childElements){
            if (childElements.textContent === food) {
                childElements.appendChild(image)
            }
        })
    })

}

function renderImage(response) {
    const imageLink = response.items[0].link

    const image = document.createElement('img')
    image.setAttribute('src', imageLink)
    image.setAttribute('width', '100rem')
    image.setAttribute('height', '100rem')

    addImageToFood(image, response.queries.request[0].searchTerms)
    
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

  deleteButton.addEventListener('click', deleteFood)

  item.appendChild(term)
  item.appendChild(description)
  item.appendChild(deleteButton)
  return item
}

function deleteFood(ev){

    let elementToDelete = null

    ev.path.forEach(function(element) {
        if (element.tagName === 'DL') {
            elementToDelete = element
        }
    })

    let foodNameToDelete = null

    elementToDelete.lastChild.childNodes.forEach(function(element){
        if (element.tagName === 'DD') {
            foodNameToDelete = element.textContent
        }
    })

    foodArray.splice(foodArray.indexOf(foodNameToDelete), 1)

    document.querySelector('#foods').removeChild(elementToDelete)    

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

  const googleScript = document.createElement('script')
  googleScript.setAttribute('src', `https://www.googleapis.com/customsearch/v1?key=AIzaSyCuDShnGALaTgS3-M25SaLHoQwuVvHbe0s&cx=001914932319504676625:x16q1stbpv4&q=${foodsForm.foodName}&searchType=image&callback=renderImage`)

  document.querySelector('body').appendChild(googleScript)

  const foods = document.querySelector('#foods')
  foods.appendChild(renderList(foodsForm))

  f.reset()
  f.foodName.focus()
}

form.addEventListener('submit', handleSubmit)