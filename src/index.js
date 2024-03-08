
function createGameCard(game) {
    const gameShelf = document.getElementById('game-shelf')
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

// function handleSearchGames {
//     // insert code here
// }

const main = () => {
    fetchGames()
}

main()