const WSServer = require('../chat-server');  //we simply point to the root of the local project, which will find the package.json file which in turn points to your index.js file


new WSServer.wsserver(8000);