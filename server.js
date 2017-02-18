// environment variables

const PORT = 8000;

const express = require('express');
const app = express();


//configuring the server

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', (req,res) => {
  res.render('index.pug');
})

app.listen(PORT, () => {
  console.log("Voto Server is running on port " + PORT);
});




