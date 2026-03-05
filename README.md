# KDict
A translation web service using Bing Translator API

## Project Overview

This is a **local translation web service** that uses Bing Translator API to translate text. It also integrates with WeChat (Weixin) public account as a translation bot.

## Features

| Feature | Description |
|---------|-------------|
| **Translation API** | HTTP GET endpoint `/api/:word` - translate English to Chinese |
| **WeChat Bot** | WeChat public account integration for instant translation |
| **History Storage** | MongoDB stores translation history |
| **Web Server** | Node.js + Express, listening on port 80 |

## API Endpoints

### 1. Direct HTTP API
```
GET /api/:word
```
Example: `GET /api/hello` returns Chinese translation

### 2. WeChat Integration
```
GET /wechat
```
WeChat public account callback endpoint - users send English text and receive Chinese translation

## Tech Stack

- **Runtime**: Node.js
- **Web Framework**: Express
- **Database**: MongoDB (stores translation history)
- **Translation**: Bing Translator API (via `bing-translate` library)
- **WeChat SDK**: wechat npm package

## Development Environment Setup

### Windows:

1. Start MongoDB
```
$ "C:\Program Files\MongoDB\Server\3.0\bin\mongod.exe" --dbpath C:\test\data
```

2. Start Node server
```
$ node translate_api.js
```

### Linux:

```bash
# Install dependencies
npm install

# Start MongoDB (if local)
mongod --dbpath /path/to/data

# Start the service
node translate_api.js
```

### Debug Node.js in Chrome Dev Tools

1. Install node inspector
  ```
  $ npm install -g node-inspector
  ```
2. Start application
  ```
  $ node --debug yourApp.js
  ```
  or, to pause on the first line:
  ```
  $ node --debug-brk yourApp.js
  ```
3. Start the inspector
  ```
  $ node-inspector &
  ```

Then we can debug our node code in Chrome dev tools.

## Configuration Required

Before running, you need to configure:

1. `client_id_secret.json` - Bing Translator API credentials
2. `wechat_app_config.json` - WeChat public account configuration

## Project Structure

```
KDict/
├── translate_api.js          # Main application entry
├── bing-translate-master/    # Bing translation library
├── openshift_host_code/      # OpenShift deployment config
├── node_modules/            # Dependencies
├── .gitignore
├── package.json
└── README.md
```

## License

MIT
