# random-movie-trailer
A webapp that shows you a different trailer from the Rotten Tomatoes Certified Fresh everytime you request the page

##Installation

You know the drill

    git clone https://github.com/grochadc/random-movie-trailer.git
    cd random-movie-trailer
    npm install
    node app.js

Then visit http://localhost:3000/ in your browser

Note: If you request the root page with a movie title it will show that instead of a random one. Ex. `http://localhost:3000/?trailer=Dunkirk` (The movie title must be URI encoded)
