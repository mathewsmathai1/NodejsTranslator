const http= require('http');
const { URL } = require('url'); 

const port = process.env.port | 5001;

http.createServer((req,res)=>{

console.log("I am listening");

const { headers, method, url } = req;
let body = [];
if(method == 'POST')
{
req.on('error', (err) => {
  console.error(err);
}).on('data', (chunk) => {
  body.push(chunk);
}).on('end', () => {
  body = Buffer.concat(body).toString();
}
);
res.write("POST REQUEST\n");
}
else if(method == 'GET')
{

res.write("GET REQUEST\n");
}
console.log("Listened: "+url.search);
const link = new URL(url,`http://${req.headers.host}`);
res.write("Link : "+link+" and Data: "+link.searchParams.get('hello'));
res.end();

}).listen(port,()=>console.log(`Listening on ${port}`));