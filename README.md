# random-movie-trailer
A webapp that shows you a different trailer from the Rotten Tomatoes Certified Fresh everytime you request the page

## Installation

You know the drill

    git clone https://github.com/grochadc/random-movie-trailer.git
    cd random-movie-trailer
    npm install
    node app.js

Then visit http://localhost:3000/ in your browser

## Queries

You can also request the root of the page with the following parameters:

`trailer (string)`: The title of a movie you want to fetch the trailer of.
`index (number)`:  The index of the movie trailer you want to fetch (based on the movies on the database)

Examples:
    http://localhost:3000/?trailer=Dunkirk
    http://localhost:3000/?index=5
