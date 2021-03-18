//  Dependencies

const express = require('express');
const path = require('path');

const { v4: uuidv4 } = require('uuid');
const fs =require('fs');

var data=JSON.parse(fs.readFileSync('./db/db.json', 'utf8'))

// Sets up the Express App

const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// index

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// 
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});




// Displays all notes
app.get('/api/notes', (req, res) => res.json(data));


// Create New Notes - takes in JSON input
app.post('/api/notes', (req, res) => {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    const newNote = (req.body);
    console.log (newNote);
   
    newNote.id=uuidv4();
  
    data.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(data, null, 2));
    res.json(data);
  });


//   Delete Notes

app.delete('/api/notes/:id',(req,res)=>{
    let chosenid = req.params.id.toString();
    console.log(chosenid);
    let data=JSON.parse(fs.readFileSync('./db/db.json', 'utf8'))
    const newData=data.filter(note=>note.id.toString() !== chosenid);
    fs.writeFileSync('./db/db.json', JSON.stringify(newData, null,2));
    res.json(data);

    // const chosenId=req.params.id.toString();
    // console.log(chosenId);
    // let data=JSON.parse(fs.readFileSync('./db/db.json', 'utf8'))
    // for (let i=0; i < data.length; i++){
    //     if(chosenId === data[i].id.toString()){
    //         data.splice(i,1);
    //     }
    // }
    // fs.writeFileSync('./db/db.json', JSON.stringify(data, null,2));
    // res.status(201).json(data);
})


// Starts the server to begin listening

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));