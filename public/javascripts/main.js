'use strict'

var recipesArr = []
var categoryArr = []
var ingredientsArr = []
var instructionsArr = []
var dietArr = []

var renderRecipes = document.querySelector('#render-recipes')

var renderCategory = document.querySelector('#render-category')

var asIngredient = document.getElementById('as-ingredient')

var asInstruction = document.getElementById('as-instruction')

var search = document.querySelector('#search')

const inputName = document.querySelector('#name-text')

var images = document.querySelector('#image-input')

var dietCheckboxes = document.getElementsByName('text')

const saveForm = document.querySelector('#create-form')

const captureIngredient = () => {
  let inputIngredient = document.querySelector('#ingredients-text').value

  let asIngredient = document.getElementById('as-ingredient')

  ingredientsArr.push(inputIngredient)

  asIngredient.innerHTML = [...ingredientsArr].join(' ')

  document.getElementById('ingredients-text').value = ''
}

const captureInstruction = () => {
  let inputInstruction = document.querySelector('#instructions-text').value

  let asInstruction = document.getElementById('as-instruction')

  instructionsArr.push(inputInstruction)

  asInstruction.innerHTML = [...instructionsArr].join(' ')

  document.getElementById('instructions-text').value = ''
}

document
  .getElementById('add-ingredient')
  .addEventListener('click', captureIngredient)
document
  .getElementById('add-instruction')
  .addEventListener('click', captureInstruction)

const clearForm = () => {
  saveForm.reset()
  ingredientsArr.length = 0
  instructionsArr.length = 0
  dietArr.length = 0
  asIngredient.innerHTML = ''
  asInstruction.innerHTML = ''
}

const fetchAndSetAllRecipes = async () => {
  try {
    const response = await fetch('http://localhost:3000/recipe/')

    const data = await response.json()

    if (response.status === 200 && data) {
      // clone array
      let clone = await JSON.parse(JSON.stringify(data))

      recipesArr = clone

      renderList(recipesArr)
    }
  } catch (error) {
    console.error('Error fetching recipes: ', error.message)
  }
}

fetchAndSetAllRecipes()

const fetchAndSetAllCategories = async () => {
  try {
    const response = await fetch('http://localhost:3000/categories')

    const data = await response.json()

    if (response.status === 200 && data) {
      let clone = await JSON.parse(JSON.stringify(data))
      //console.log(clone)
      categoryArr = clone

      categoryList(categoryArr)
    }
  } catch (error) {
    console.error('Error fetching recipes: ', error.message)
  }
}

fetchAndSetAllCategories()

const postRecipe = async (data) => {
  try {
    const response = await fetch('http://localhost:3000/recipe/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    recipesArr.push(result)

    renderList(recipesArr)

    return result
  } catch (error) {
    console.error('Error:', error)
  }
}

const uploadImage = async (formData) => {
  try {
    const response = await fetch('http://localhost:3000/images', {
      method: 'POST',
      body: formData,
    })
    const result = await response.json()
    console.log('Success:', result)
  } catch (error) {
    console.error('Error:', error.message)
  }
}

saveForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  const formData = new FormData()

  // diet checkboxes
  for (let i = 0; i < dietCheckboxes.length; i++) {
    if (dietCheckboxes[i].checked) {
      dietArr.push(dietCheckboxes[i].value)
    }
  }

  let data = {
    name: inputName.value,
    ingredient: ingredientsArr,
    instruction: instructionsArr,
    dietCategory: dietArr,
  }

  formData.append('recipe', inputName.value)

  for (let i = 0; i < images.files.length; i++) {
    formData.append('images', images.files[i])
  }
  await postRecipe(data)

  await uploadImage(formData)

  clearForm()
})

search.addEventListener('change', async (event) => {
  let userInput = event.target.value

  try {
    const response = await fetch(`http://localhost:3000/recipe/${userInput}`)

    const data = await response.json()

    if (response.status === 200 && data) {
      renderSearch(data)
    }
  } catch (error) {
    console.error('Search error: ', error.message)
  }
})

const renderList = (arrObj) => {
  /* eslint-disable-next-line quotes */
  let div = ``
  /* eslint-enable-next-line quotes */

  Object.values(arrObj).forEach(({ id, name, instructions, ingredients }) => {
    div += `<div id='list-of-recipes' key=${id}>
    <h3><a href="http://localhost:3000/recipe/${name}">${name}</a></h3>
    <h4>Ingredients</h4><ul>${ingredients

    .map(function (el) {
      return '<li>' + el + '</li>'
    })
    .join('')}</ul>
    <h5>Instructions</h5><ol style='padding-left:2rem;'>${instructions
    .map((el) => {
      return '<li>' + el + '</li>'
    })
    .join('')}</ol>
    </div>`
  })

  renderRecipes.innerHTML = div
}

const renderSearch = (data) => {
  /* eslint-disable-next-line quotes */
  let div = ``
  /* eslint-enable-next-line quotes */

  div += `<div id='search-result'>
    <h3><a href="http://localhost:3000/recipe/${data.name}">${
  data.name
}</a></h3>
    <h4>Ingredients</h4><ul>${data.ingredients
    .map(function (el) {
      return '<li>' + el + '</li>'
    })
    .join('')}</ul>
    <h5>Instructions</h5><ol style='padding-left:2rem;'>${data.instructions
    .map((el) => {
      return '<li>' + el + '</li>'
    })
    .join('')}</ol>
    </div>`

  renderRecipes.innerHTML = div
}

const categoryList = (arrObj) => {
  /* eslint-disable-next-line quotes */
  let container = `<legend>Categories</legend>`
  /* eslint-enable-next-line quotes */

  Object.values(arrObj).forEach(({ name }) => {
    container += `<label for=${name}><input type='checkbox' id=${name} name='text' value=${name} /><span>${name}</span></label><br>`
  })

  renderCategory.innerHTML = container
}
