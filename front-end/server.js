const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');

app.use(express.static('build'));
app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));

app.get("*", function(request, response) {
    response.sendFile(path.join(__dirname + "/build/index.html"));
});
