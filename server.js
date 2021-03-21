//  Dependencies

const express = require('express');
const path = require('path');

const { v4: uuidv4 } = require('uuid');
const fs =require('fs');



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
app.get('/api/notes', (req, res) =>{

    let data=JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    console.log("api notes GET request - Returning notes data: " + JSON.stringify(data));
    res.json(data)
});


// Create New Notes - takes in JSON input
app.post('/api/notes', (req, res) => {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    const newNote = (req.body);
    console.log (newNote);
    let data=JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    newNote.id=uuidv4();
    data.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(data, null, 2));
    res.json(data);
    
  });


//   Delete Notes

app.delete('/api/notes/:id',(req,res)=>{
    let chosenid = req.params.id;
    console.log(chosenid);
    let noteData=JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    // noteData=noteData.filter(note=>note.id !== chosenid);
    for (let i=0; i < noteData.length; i++){
            if(noteData[i].id === chosenid ){
                noteData.splice(i,1);
                break
            }
        }
    console.log(noteData);
    // save file
    fs.writeFileSync('./db/db.json', JSON.stringify(noteData, null,2),(error)=>{
        if(error){
            console.error(error);
        }
    });
  
    res.end();
    
})


// Starts the server to begin listening

app.listen(PORT, () => {console.log(`App listening on PORT ${PORT}`)});