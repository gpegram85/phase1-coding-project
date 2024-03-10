const gameShelf = document.getElementById('game-shelf')
const clearSearchBtn = document.getElementById('clear-search')

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

function fetchGames() {
    const li = document.createElement('li')

    fetch('http://localhost:3000/games')
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        return response.json()
      })
    .then(gameData => {
        console.log(gameData)

        gameData.forEach(game => {
            createGameCard(game)
            console.log(game.id)
        })
        handleMouseOver()
    })
    .catch(error => {
        console.error("Error retrieving games list: ", error)
    })

}

function handleAddEventListeners() {
    const searchSubmit = document.getElementById('searchbutton')
    searchSubmit.addEventListener('click', () => handleSearchGames())
}

function handleSearchGames() {

    fetch('http://localhost:3000/games')
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        return response.json()
    })
    .then(gameData => {

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
    })
    .catch(error => {
        console.error("Error retrieving games list: ", error)
    })
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

function handleDeleteGame(game) {
    console.log(game.id)
    fetch(`http://localhost:3000/games/${game.id}`, {
        method: 'DELETE'
    })
    .then(response =>{
        if(!response.ok) {
            throw new Error('Error deleting game: ' + response.statusText)
        }
    })
    .catch(error => {
        console.error('Error deleting game: ', error)
    })
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

const main = () => {
    handleAddEventListeners()
    fetchGames()
}

main()