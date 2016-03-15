# KDict
a translation web service using Bing Translator API

Development Environment Setup:

Windows:

1. start MongoDB
$ "C:\Program Files\MongoDB\Server\3.0\bin\mongod.exe" --dbpath C:\test\data
2. start Node server
$ node translate_api.js

Debug Node.js in Chrome Dev tools

1. Install node inspector
$ npm install -g node-inspector

2. Start application
$ node --debug yourApp.js

or, to pause your script on the first line:

$ node --debug-brk yourApp.js

3. Start the inspector
$ node-inspector &

Then we can debug our node code in Chrome dev tools.

