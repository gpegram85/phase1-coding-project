const gamesList = document.getElementById('display-container')

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
            console.log(game.title)
        })
    })
    .catch(error => {
        console.error("Error retrieving games list: ", error)
    })
}

const main = () => {
    fetchGames()
}

main()