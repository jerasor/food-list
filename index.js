//our food array which will hold the items submitted
const foodArray = []

//items will be submitted through this form
const form = document.querySelector('#foodForm')

//this function takes in an image element and a food name
//it will then add that image to the lastElement in the form
//only after that food has been verified
function addImageToFood (image, food){

    //the food list to search through
    const foods = document.querySelector('#foods')

    //looping throught the last element in the food list child nodes
    foods.lastElementChild.childNodes.forEach(function(element){

        //looping through each of the childElements to verify
        //we are on the correct food
        element.childNodes.forEach(function(childElements){

            //if we are on the correct food...
            if (childElements.textContent === food) {

                //...then we will append the image to the child element
                //(after we put a space between them)
                childElements.appendChild(document.createElement('br'))
                childElements.appendChild(image)

            }
        })
    })

}

//this function is used to take in a respone 
//(from the google search image api)
//and create an image element for the first item in the response
function renderImage(response) {

    //getting the link of the first item in the response
    const imageLink = response.items[0].link

    //creating an image element with the src as the above imageLink
    //and width and heright of 200rem
    const image = document.createElement('img')
    image.setAttribute('src', imageLink)
    image.setAttribute('width', '200rem')
    image.setAttribute('height', '200rem')

    //getting the food name (this is the searchTerm from the response)
    const foodName = response.queries.request[0].searchTerms

    //adding the image element to the list
    addImageToFood(image, foodName)
    
}

//creating a list item with the provided label and value
//label is text wil value can be text or an element
function renderListItem(label, value) {

    //creating the list item
    const item = document.createElement('li')

    //creating the data term (or the label)
    const term = document.createElement('dt')
    term.textContent = label

    //creating the data description
    const description = document.createElement('dd')

    //trying to append the value to the description
    //if that doesn't work, then we will just add the value
    //as textContent
    try {
        description.appendChild(value)
    } catch(e) {
        description.textContent += value
    }

    //creating a delete button to add to the item
    const deleteButton = document.createElement('button')
    deleteButton.textContent = "Delete"

    //adding the deleteButton's listener
    deleteButton.addEventListener('click', deleteFood)

    //appending the term, description, and deleteButotn to the list item
    item.appendChild(term)
    item.appendChild(description)
    item.appendChild(deleteButton)
    return item
}

//deletes the list item whose deleteButton was clicked
function deleteFood(ev){

    //used to search for the dl element to remove
    let elementToDelete = null

    //looping through the path of the event until we find the
    //dl element (the one we want to remove)
    ev.path.forEach(function(element) {
        if (element.tagName === 'DL') {
            elementToDelete = element
        }
    })

    //before we can remove the element, we need to get the food
    //name associated with it so we can remove it from the array as well
    let foodNameToDelete = null

    //looping through the elementToDelete (its lastChild is the li element
    //it is wrapped around), we will then search for the dd element (this
    //element contains the foodName in its textContent)
    elementToDelete.lastChild.childNodes.forEach(function(element){
        if (element.tagName === 'DD') {
            foodNameToDelete = element.textContent
        }
    })

    //removing the foodName from the foodArray
    foodArray.splice(foodArray.indexOf(foodNameToDelete), 1)

    //removing the element from the list of foods
    document.querySelector('#foods').removeChild(elementToDelete)    

}

//takes in an object and puts it in a data list
function renderList(data) {

    //creating the data list
    const list = document.createElement('dl')

    //the labels are the keys of the data object
    const labels = Object.keys(data)

    //we are looping through the labels and creating the
    //list item and adding it to the list
    labels.forEach(label => {
        const item = renderListItem(label, data[label])
        list.appendChild(item)
    })

    return list
}

const handleSubmit = function(ev) {
    
    //preventing the form from its default submission
    ev.preventDefault()

    //the form we are targeting
    const f = ev.target

    //the object from the form
    const foodsForm = {
        foodName: f.foodName.value,
    }

    //adding the submission to the foodArray
    foodArray.push(foodsForm.foodName)

    //adding the list element to the main page
    const foods = document.querySelector('#foods')
    foods.appendChild(renderList(foodsForm))

    //creating a google api script (this will search for the 
    //image of the foodName submitted)
    //it will perform a callback to renderImage when the search is executed
    const googleScript = document.createElement('script')
    googleScript.setAttribute('src', `https://www.googleapis.com/customsearch/v1?key=AIzaSyCuDShnGALaTgS3-M25SaLHoQwuVvHbe0s&cx=001914932319504676625:x16q1stbpv4&q=${foodsForm.foodName}&searchType=image&callback=renderImage`)

    //adding the google api script to the body (this will execute the script)
    document.querySelector('body').appendChild(googleScript)

    //resetting the form and focusing on the foodName input
    f.reset()
    f.foodName.focus()
}

//listening for the form's submit event
form.addEventListener('submit', handleSubmit)