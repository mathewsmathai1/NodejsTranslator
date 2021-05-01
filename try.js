const axios = require('axios');
const {url}  = require('url');
const Express = require('express');
const qs = require('qs');
const cors = require('cors')

const PORT = process.env.PORT || 5002;
const app = Express();
app.use(cors())
var errorMsg = 'Sorry! Something went Wrong or the target/source language is not supported yet. Report Bug At: https://github.com/mathewsmathai1/AngularTranslator/issues';


async function getToken(req,res)
{
	
	    console.log("Called GetToken()");
		
await axios({
        method: "post",
    url: "https://iam.cloud.ibm.com/identity/token",
    data: qs.stringify({"grant_type":  "urn:ibm:params:oauth:grant-type:apikey",
           "apikey": "Your IBM API KEY HERE"
    }),
    headers: { "Content-Type": "application/x-www-form-urlencoded" ,
               "Accept": "application/json"}
  })
  .then(function (response) {
		 
		   access_token = response.data.access_token;
		   console.log("Printing Access Token: "+access_token);
		   //return new Promise((resolve,reject)=>{resolve("FROM PROMISE")});
		    })
    .catch(function (response) {
      //handle error
      console.log(response);
      res.write(errorMsg);
      res.end();
    });

};

app.get('/languages',(req,res,next)=>{
	
  var langList;
  var langListObj;
 getToken(req,res).then(() => {
   

 axios({
    method: "get",
    url: "https://api.us-east.language-translator.watson.cloud.ibm.com/instances/YOUR_INSTANCE_ID_HERE/v3/languages?version=2018-05-01",
    headers: { "Content-Type": "application/x-www-form-urlencoded" ,
               "Authorization": "Bearer "+access_token},
  }) 
    .then(function (response) {
		
	  console.log("AFTER REQUEST: "+JSON.stringify(response.data.languages[0]));//[0].language);
	  //res.write(JSON.stringify(response.data.languages[0].language));//[0].language);
    console.log(typeof(langList));
    console.log(typeof(response.data.languages));
    
    langList = response.data.languages.map((arrElement)=>{ return {language: arrElement.language, language_name: arrElement.language_name}});
    //console.log(JSON.stringify(langlist));
   /* langList.forEach(element => {
       //console.log(langList.indexOf(element));
       langListObj[langList.indexOf(element)] = {language: element};
    }); */
    res.write(JSON.stringify(langList));
    console.log("LANGLIST: "+langList[2].language_name);
    res.end();         
	  	})
	  .catch(function (response) {
          //handle error
         // console.log(response);
         res.write(errorMsg);
         res.end();
        }); 
		
 }).catch(function (response) {
  //handle error
   console.log(response);
   res.write(errorMsg);
   res.end();
}); 

});



app.get('/translate',(req,res,next)=>{
 
        let source = '';
        let target = '';
        let text = ''; 
        let {url} = req;
        console.log("Printing url search: "+url);

      //  var query = url_parts.query;
        const link = new URL(url,`http://${req.headers.host}`);
      //  res.write("Link : "+link+" and Data: "+link.searchParams.get('hello'));

        source = link.searchParams.get('source');
        target = link.searchParams.get('target');
        text   = link.searchParams.get('text');

        console.log("Source "+link.searchParams.get('source'));
        console.log("Target "+link.searchParams.get('target'));
        console.log("Text "+link.searchParams.get('text'));
		


    getToken(req,res).then(() => {

      //console.log("ACTUAL MESSAGE: "+message);
      //access_token = response.data.access_token;
      console.log("Printing Access Token: "+access_token);
      axios({
        method: "post",
        url: "https://api.us-east.language-translator.watson.cloud.ibm.com/instances/YOUR_INSTANCE_ID_HERE/v3/translate?version=2018-05-01",
        data: {"text": decodeURI(text),
               "source": source,
               "target" : target  
        },
        headers: { //"Content-Type": "application/json" ,
                    "Authorization" :"Bearer "+access_token},
      })
        .then(function (response) {
          //handle success
          console.log(response.data);
          res.write(response.data.translations[0].translation);
          res.end();         
        })
        .catch(function (response) {
          //handle error
          console.log(response);
          res.write(errorMsg);
          res.end();
        });

    })
    .catch(function (response) {
      //handle error
     console.log(response);
     res.write(errorMsg);
     res.end();
    });
    console.log("AFTER ME");
});



app.listen(PORT, console.log("Listening on port: "+PORT));