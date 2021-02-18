const express = require("express");
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");

dotenv.config();



app.use("/static", express.static("public"));

app.set("view engine", "ejs");

//connexion à la mongoose js 
var mongoDB = 'mongodb://'+process.env.MONGO_DB_HOST+':'+ process.env.MONGO_DB_PORT +'/'+process.env.MONGO_DB_DATABASE;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});


app.get('/',(req, res) => {
    TodoTask.find({}, (err, tasks) => {

        res.render("todo.ejs", { todoTasks: tasks });
    });
});


//POST
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });

    try {
        await todoTask.save().exec();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
        }
    });

//UPDATE
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
            });
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
            res.redirect("/");
        });
    });

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
            res.redirect("/");
        });
    });

app.use(express.urlencoded({ extended: true }));




app.listen(3000, () => console.log("Server Up and running"));
