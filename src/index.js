const gameShelf = document.getElementById('game-shelf')

function createGameCard(game) {
    
    const gameBox = document.createElement('div')
    const gameThumbnail = document.createElement('img')

    gameBox.setAttribute('id', `${game.id}`)
    gameBox.setAttribute('class', 'game-box')
    gameThumbnail.src = game.thumbnail
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
        })
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
        displaySearchResults(searchResults)
    })
    .catch(error => {
        console.error("Error retrieving games list: ", error)
    })
}

function displaySearchResults(searchResults) {
    gameShelf.innerHTML = ''
    searchResults.forEach(game => {
        createGameCard(game)
    })
}

const main = () => {
    handleAddEventListeners()
    fetchGames()
}

main()