import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";


// DB connection
import "./database/db.js";

// DB migrations (JUST RUN, NO IMPORT VARIABLE)
import "./database/migrate.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ ERP Backend running on http://localhost:${PORT}`);
});
