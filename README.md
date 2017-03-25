# botanic

## Don't update meteor please

## Installation notes

Need to install first

On Windows:

* Meteor (https://www.meteor.com/install)

* node.js (https://nodejs.org/en/)

* Windows Build Tools

```
npm install --global --production windows-build-tools
```

On Linux:

* Meteor

```
curl https://install.meteor.com/ | sh
```

* node.js

```
apt-get install npm
```

## After cloning this repository

```
meteor npm install
```

To run Meteor type:

```
npm start
```

## All code examples are written for Windows

#### Restore mongo database

Make sure to drop existing meteor database before restoring new dump

```
C:
cd "C:\Program Files\MongoDB\Server\3.2\bin"

mongorestore --host 127.0.0.1 --port 3001 "...\botanic\dump"
```

#### Dump mongo database

```
C:
cd "C:\Program Files\MongoDB\Server\3.2\bin"

mongodump --host 127.0.0.1 --port 3001 --out "...\botanic\dump"
```

#### Dump mongo collection

```
C:
cd "C:\Program Files\MongoDB\Server\3.2\bin"

mongodump --host 127.0.0.1 --port 3001 --db meteor --collection collection --out "...\botanic\dump"
```

#### Drop existing meteor database

```
X:
cd "X:\path\to\meteor\project"

meteor mongo
db.dropDatabase()
```