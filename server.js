// Root entry for hosts whose Node.js app panel expects `server.js`
// (e.g. Hostinger "Entry file"). It only loads the real bootstrap,
// server/start.js, which registers tsx and starts the Express server in
// server/index.ts. Static import, no top-level await, so LiteSpeed's
// require()-based launcher can load it.
import "./server/start.js"
