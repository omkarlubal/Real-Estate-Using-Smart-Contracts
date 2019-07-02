var express = require('express');
var path = require('path');

var app = express();


app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req,res){
    res.render("main",{title:"Real Estate App"});
});

app.get("/sell", function(req,res){
    res.render("seller",{title:"Real Estate App || Seller"});
});

app.get("/admin", function(req,res){
    res.render("admin",{title:"Real Estate App || Admin"})
})


let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Blockchain up at http://localhost:" + port);
});


