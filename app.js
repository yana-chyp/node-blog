let express = require("express")
let app = express()
let PORT = process.env.PORT || 3000
let path = require('path')
let mongoose = require("mongoose")
let methodOverride = require("method-override")
let Post = require('./models/postModel')

let db = "mongodb+srv://yanachyp:<password>@cluster0.hjgqt.mongodb.net/Node-blog"
mongoose.connect(db)

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(express.urlencoded({extended: false}))
app.use(methodOverride("_method"))


app.get("/", (req, res) => {
    res.render('index', {title: 'Головна'})
})

app.get("/add-post", (req, res) => {
    res.render('add-post', {title: 'Додайте новий допис'})
})

app.post("/add-post", (req, res) => {
    let {title, author, content} = req.body
    let post = new Post({title, author, content})
    post
        .save()
        .then( () => res.redirect("/posts"))
        .catch( (error) => {
            console.log(error)
            res.render("error")
        })
})


app.get("/posts", (req, res) => {
    Post
        .find()
        .then((posts) => res.render("posts", {title: "Дописи", posts}))
        .catch((error) => {
            console.log(error)
            res.render("error")
        })
})

app.get("/edit-post/:id", (req, res) => {
    let id = req.params.id
    Post.findById(id)
        .then((post) => 
            res.render("edit-post", {title: post.title, id: post._id, post})
        )
        .catch((error) => {
            console.log(error)
            res.render("error")
        })
})

app.put("/edit-post/:id", (req, res) => {
    let id = req.params.id
    const {title, author, content} = req.body
    Post.findByIdAndUpdate(id, {title, author, content})
        .then(() => res.redirect("/posts"))
        .catch((error) => {
            console.log(error)
            res.render(createPath("error"))
        })
})


app.delete("/posts/:id", (req, res) => {
    let id = req.params.id
    Post.findByIdAndDelete(id)
        .then((posts) => res.render("posts", {title: "Posts", posts}))
        .catch((error) => {
            console.log(error)
            res.render("error")
        })
})

app.listen(PORT, () => {
    console.log(`server has started on PORT ${PORT}...`)
})