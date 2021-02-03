const { createService } = require("./quotes-service.js");
const app = createService();

app.listen(3000);
