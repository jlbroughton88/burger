var express = require("express");

var app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "burgers_db",
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

//DONE
//==========================================================================================================
// Render current burgers
app.get("/", function (req, res) {
  connection.query("SELECT * FROM burgers;", function (err, data) {
    if (err) {
      return res.status(500).end();
    }
    res.render("index", { burgers: data })
  });
});



//==========================================================================================================
// Create a new burger
app.post("/burgers", function (req, res) {
  connection.query("INSERT INTO burgers (burger_name) VALUES (?)", [req.body.burger_name], function (err, result) {
    if (err) {
      return res.status(500).end();
    }

    res.redirect("/")
  })
})




//==========================================================================================================
// Get burgers after creating
app.get("/", function (req, res) {
  connection.query("SELECT * FROM burgers (burger_name) VALUES (?);", function (err, data) {
    if (err) {
      throw err
    }
    res.render("index", { burgers: data })
  });
});




//==========================================================================================================
// Update a burger's "devoured" status
app.put("/burgers/:id", function (req, res) {
  connection.query("UPDATE burgers SET devoured = 1 WHERE id = ?", [req.params.id], function (err, result) {
    if (err) {
      return res.status(500).end();
    }
    // CHECK THIS CHANGED ROWS VARIABLE, LIKELY NOT RIGHT
    else if (result.changedRows === 0) {
      return res.status(404).end();
    }
    res.status(200).end();
  })
})




//==========================================================================================================
// Remove a burger
app.delete("/burgers/:id", function (req, res) {
  connection.query("DELETE FROM burgers WHERE id = ?", [req.params.id], function (err, result) {
    if (err) {
      return res.status(500).end();
    }
    else if (result.affectedRows === 0) {
      return res.status(404).end();
    }
    res.status(200).end();

  })
})

app.listen(PORT, function () {
  console.log("Server listening at http://localhost:" + PORT)
})