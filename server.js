const express = require(`express`);
const path = require(`path`);
const db = require(`./db/db.json`);
const fs = require(`fs`);
const { randomUUID } = require("crypto");
const { error } = require("console");
// const api = require('./')
const PORT = process.env.PORT || 3001;
const app = express();
//middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`public`));
//get route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
  });
//get route for notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});

//get route for retreiving notes (like local storage)
app.get('/api/notes', (req,res)=>{
  fs.readFile('./db/db.json', 'utf-8', (error, data) => {
    res.json(JSON.parse(data))
  })
})
//POST ROUTE 
app.post('/api/notes', (req, res) => {
  const { title, text } = req.body

  if (title && text) {
    fs.readFile('./db/db.json', 'utf-8',(error,data) => {
      if (error) {
      res.status(500).json('NO DATA AVALIABLE');
    } else {
      let note = JSON.parse(data);
      let noteObj = req.body;
      noteObj.id = randomUUID();
      note.push(noteObj)
      fs.writeFile('./db/db.json', JSON.stringify(note),(error) => {
        res.status(200).json('NOTE SAVED');
      })}
    })
  }
})
// DELETE ROUTE
app.delete('/api/notes/:id', (req, res) => {
  const handleDelete = req.params.id

  if (handleDelete) {
    fs.readFile('./db/db.json', 'utf-8', (error,data) => {
      if (error) {
        res.status(500).json('ERROR 500');
      } else {
        let toHandleDelete = JSON.parse (data);
        let tempdelete = toHandleDelete.filter((item) => {
          if (item.id !== handleDelete) {
            return item;
          }
        })

        //write to file to update db.json with the deletions
        fs.writeFile('./db/db.json', JSON.stringify(tempdelete), (error) => {
          res.status(200).json('NOTE HAS BEEN SUCESSFULLY DELETED');
        })
      }
    })
  }
})




//wildcard get route for error page || MUST BE LAST GET ROUTE
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/404.html'))
);

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT} 🚀`)
  })