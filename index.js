import express from "express";
import bodyParser from "body-parser";
import fs from "node:fs";

const app = express();
const PORT = 3000;
const folderPath = "blogs/";

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

function getArticleData(){
    try {
        let headlines = fs.readdirSync(folderPath);
        
        let content = [];

        for (let i = 0; i < headlines.length; i++){
            content.push(fs.readFileSync(folderPath + headlines[i], 'utf-8').slice(0, 200) + "...");
        }
        
        let data = {
            titles: headlines,
            body: content
        }
        return data;
    } catch (err) {
        console.error(err);
    }
}

app.get("/", (req, res)=>{
    res.render("index.ejs", getArticleData());
});

app.post("/submit", (req, res)=>{
    res.redirect("/");

    const bodyContent = req.body["category"] + "\n" + req.body["body"];

    fs.writeFile(`${folderPath}/${req.body["headline"]}.txt`, bodyContent, (err)=>{
        if (err) {
            console.log(err);
        }
    });
});

app.get("/about", (req, res)=>{
    res.render("about.ejs");
});

app.get("/blog/:headline", (req, res)=> {
    let headline = req.params.headline;
    let content = fs.readFileSync(folderPath + headline, 'utf-8');
    res.render("post.ejs", {title: headline, body: content});
});

app.get("/contact", (req, res)=>{
    res.render("contact.ejs");
});

app.get("/post", (req, res)=>{
    res.render("post.ejs");
   
});

app.get("/blog", (req, res)=>{
    res.render("blog.ejs", getArticleData());
});

app.listen(PORT, ()=>{
    console.log(`Sever started on port ${PORT}`);
});
