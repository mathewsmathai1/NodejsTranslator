const Express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const port = process.env.port | 5000;

const app = new Express();

const uri = "mongodb+srv://admin:mathews@cluster0.xwm2m.mongodb.net/mathews_db?retryWrites=true&w=majority";
//const client = new MongoClient(uri);

function connectToDB(){

  mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true},()=>{console.log("Connected Successfully");});
}

app.listen(port, ()=>console.log(`Listening on port ${port}`));


app.use(Express.static( path.join(__dirname, 'public')));

app.get('/ht', (req, res )=> {

    connectToDB();
    const db = mongoose.connection;
     db.on('error', console.error.bind(console, 'connection error:'));

     db.once('open', function() {
     // mongoose.connection.close();
     
      mongoose.connection.db.listCollections().toArray(async function (err, names) {
        var detail;
      if (err) {
        console.log(err);
      } else {
        console.log(names);
        console.log(names[0].name);
        mongoose.connection.collection(names[0].name).insertOne({name:'Tabau'}).then(console.log("Insert Done"));
        const {name} = await mongoose.connection.collection(names[0].name).findOne({name:'mathews'}).then(detail=>detail);
        console.log( "FINAL NAME: "+name );
    
      }

        console.log('We are Connected');
     })    }); 
    //console(mongoose.Collection());
    res.write("Successful This");
    res.end();

});

/*
app.get('/ht', function(req, res,next) {
    //res.sendFile('D:/nodey/public/main.html');
    res.write("Hello Planet");
    next();
}, (req,res,next)=>{
    res.write("\nHello World");
    //res.end();
    next();
} );

app.get('/ht', function(req, res,next) {
    //res.sendFile('D:/nodey/public/main.html');
    res.write("\nHello You");
    res.end();
});
*/
app.get('/users/',(request,response)=>{
response.send("hello There: "+request.query['id']);
});

app.get('/:number',(request,response)=>{
    response.send("hello There2: "+request.params.number);
    });
