
let gameShelf, clearSearchBtn, addGameSubmit, searchSubmit, cancelBtn, newGameInput, newGameForm

function createGameCard(game) {
    
    const gameBox = document.createElement('div')


    gameBox.setAttribute('id', `${game.id}`)
    gameBox.setAttribute('class', 'game-box')

    gameBox.addEventListener('click', () => handleGameDetailDisplay(game))

    const gameThumbnail = document.createElement('img')
        gameThumbnail.src = game.thumbnail
        gameThumbnail.alt = game.name

    gameBox.appendChild(gameThumbnail)
    gameShelf.appendChild(gameBox)
}

async function fetchGames() {
    try {
        const response = await fetch('http://localhost:3000/games')
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const gameData = await response.json()
        
        gameData.forEach(game => {
            createGameCard(game)
            console.log(game.id)
        })
        handleMouseOver()
    } catch (error) {
        console.error("Error retrieving games list: ", error)
    }
}

function handleAddEventListeners() {
    searchSubmit.addEventListener('click', () => handleSearchGames())
    addGameSubmit.addEventListener('click', () => displayNewGameForm())
    cancelBtn.addEventListener('click', () => {
        const gameForm = document.getElementById('game-form')
        gameForm.reset()

    })
    newGameForm.addEventListener('submit', async (event) => handleAddNewGame(event))
}


async function handleSearchGames() {
    try {
    const response = await fetch('http://localhost:3000/games')
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const gameData = await response.json()

        const query = searchbar.value.toLowerCase()    
        const searchResults = gameData.filter(game => {
            return (
                game.title.toLowerCase().includes(query) ||
                game.genre.toLowerCase().includes(query) ||
                game.description.toLowerCase().includes(query) ||
                game.platform.toLowerCase().includes(query)
            )
        })
        if (searchResults.length >= 1) {
        displaySearchResults(searchResults)
        } else {
            gameShelf.innerHTML = ''
            const nullSearchReturn =  document.createElement('h1')
            nullSearchReturn.innerText = 'No games found matching your search. Please try again.'
            gameShelf.appendChild(nullSearchReturn)
        }

    }
        catch(error) {
            console.error("Error retrieving games list: ", error)
        }
}

function displaySearchResults(searchResults) {
    clearSearchBtn.classList.remove('hidden')
    clearSearchBtn.addEventListener('click', () => clearSearchResults())
    
    gameShelf.innerHTML = ''
    searchResults.forEach(game => {
        createGameCard(game)
    })
    handleMouseOver()
}

function clearSearchResults() {
    gameShelf.innerHTML = ''
    clearSearchBtn.classList.add('hidden')
    fetchGames()
}

function handleMouseOver() {
    const gameBoxes = document.querySelectorAll('.game-box')

    gameBoxes.forEach(box => {
        box.addEventListener('mouseover', () => {
            gameBoxes.forEach(otherBox => {
                if (otherBox !== box) {
                    otherBox.style.opacity = '0.2'
                }
            })
        })

        box.addEventListener('mouseout', () => {
            gameBoxes.forEach(otherBox => {
                otherBox.style.opacity = '1'
            })
        })
    })
}

async function handleDeleteGame(game) {
    try {
     const response = await fetch(`http://localhost:3000/games/${game.id}`, {
        method: 'DELETE'
    })

    if(!response.ok) {
        throw new Error('Error deleting game: ' + response.statusText)
    }
}
    catch(error) {
        console.error(error)
    }

    setTimeout(function() {
        location.reload()
    }, 1000)
}

function handleGameDetailDisplay(game) {
    const gameDetailDiv = document.getElementById('game-detail')
    let gameDetails = document.createElement('ul')

    let gameSplash = document.createElement('img')
    gameSplash.src = game.splash

    let gameTitle = document.createElement('p')
    gameTitle.innerText = game.title

    let gameGenre = document.createElement('li')
    gameGenre.innerText = `Genre: ${game.genre}`

    let gamePlatform = document.createElement('li')
    gamePlatform.innerText = `Platform: ${game.platform}`

    let gamePublisher = document.createElement('li')
    gamePublisher.innerText = `Publisher: ${game.publisher}`

    let gameRelease = document.createElement('li')
    gameRelease.innerText = `Release date: ${game.release_date}`

    let gameDescription = document.createElement('li')
    gameDescription.innerText = game.description

    const deleteBtn = document.createElement('button')
    deleteBtn.setAttribute('id', 'gameDeleteBtn')
    deleteBtn.innerText = 'DELETE GAME?'
    deleteBtn.addEventListener('click', () => handleDeleteGame(game))

    gameDetailDiv.innerHTML = ``

    gameSplash.onload = function() {
        gameDetailDiv.style.height = `${gameSplash.height}px`
        gameDetailDiv.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    gameDetailDiv.appendChild(gameTitle)
    gameDetailDiv.appendChild(gameSplash)

    gameDetails.appendChild(gameGenre)
    gameDetails.appendChild(gamePlatform)
    gameDetails.appendChild(gamePublisher)
    gameDetails.appendChild(gameRelease)
    gameDetails.appendChild(gameDescription)
    gameDetailDiv.appendChild(gameDetails)
    gameDetailDiv.appendChild(deleteBtn)
}

function displayNewGameForm() {
    newGameInput.classList.remove('hidden')
    addGameSubmit.classList.add('hidden')
}

async function handleAddNewGame(event) {
    event.preventDefault()

    const form = event.target
    const formData = new FormData(form)

    const gameData = {}
    for (const [key, value] of formData.entries()) {
        if (key === 'platform') {
            if (!gameData[key]) {
                gameData[key] = ''
            }
            gameData[key] += value + ', '
        } else {
            gameData[key] = value
        }
    }

    try {
        const response = await fetch('http://localhost:3000/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameData)
        })

        if (!response.ok) {
            throw new Error('Failed to add game')
        }

        console.log('Game added successfully')
        // Optionally, you can reset the form after successful submission
        form.reset()
        newGameForm.classList.add('hidden')
        gameShelf.innerHTML = ''
        fetchGames()
    } catch (error) {
        console.error('Error adding game:', error)
    }
}

function getElements() {
    // Assign elements to global variables
    gameShelf = document.getElementById('game-shelf')
    clearSearchBtn = document.getElementById('clear-search')
    addGameSubmit = document.getElementById('new-game-button')
    searchSubmit = document.getElementById('searchbutton')
    cancelBtn = document.getElementById('cancel-button')
    newGameInput = document.getElementById('new-game-input')
    newGameForm = document.getElementById('game-form')
}

const main = () => {
    getElements()
    handleAddEventListeners()
    fetchGames()
}

main()