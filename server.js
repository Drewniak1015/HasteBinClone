const express = require("express");
const mongoose = require("mongoose");
const Document = require("./models/Document");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public")); // uwzglednienie wszystkiego co jest w folderze public
app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost/wastebin", {});

app.get("/", (req, res) => {
  const code = `Welcone to WasteBin! 

Use the commands in the top right corner
to create a new file to share with others.`;

  res.render("code-display", {
    code: code,
    LineNumbers: code.split("\n").length,
  });
});
app.get("/new", (req, res) => {
  res.render("new", {});
});

app.post("/save", async (req, res) => {
  const value = req.body.value;
  try {
    const document = await Document.create({ value });
    res.redirect(`/${document.id}`);
  } catch (e) {
    res.render("new", { value });
  }
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Document.findById(id);
    res.render("code-display", {
      code: document.value,
      LineNumbers: document.value.split("\n").length,
    });
  } catch (e) {
    res.redirect("/");
  }
});
app.listen(3000);
