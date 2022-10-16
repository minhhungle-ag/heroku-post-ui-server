const app = require("express")();

app.use((req, res) => {
  res.status(200).json({
    message: "Start server",
  });
});

module.exports = app;
