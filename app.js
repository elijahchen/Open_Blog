let express     = require("express"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    app         = express();

// MONGOOSE MODEL CONFIGURATION
mongoose.connect("mongodb://user:testapp@ds129050.mlab.com:29050/ecdata");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:
        {
            type: Date,
            default: Date.now
        }
});
let Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTING
app.get("/", function (req, res) {
   res.redirect("blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function (err, blogs) {
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: blogs});
        }
    })
});

//NEW ROUTE
app.get("/blogs/new", function (req, res) {
    res.render("new");
});

//CREATE ROUTE
app.get("/blogs/create", function (req, res) {
    //Create blog
    Blog.create(req.body.blog, function (err, newBlog) {
        if(err){
            res.render("new");
        } else {
            //Redirect
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if(err){
            res.redirect("/");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});
// EDIT ROUTE
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if(err){
            res.redirect("/");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

app.listen(3000, process.env.IP, function () {
    console.log("SERVER STARTED");
});