![Logo][logo-url]

# botanic

![Language][language-url] ![Meteor][meteor-url] ![License][license-url] ![Version][version-url] ![Done][done-url] ![Maintenance][maintenance-url]

### A Meteor SPA web application for botanic garden management

##### This project was developed for *Group project* classes at Electronics, Telecommunications and Informatics faculty of Gdańsk University of Technology. It was intended for [Gdańsk Medicinal Botanic Garden](http://www.orl.gumed.edu.pl/). The name group project is a little bit misleading, because this software was made only by me.

##### Have plans to improve this project in spare time.

## Main features

- Botanic is made as single-page application (SPA)
- REST API
- [Blaze](http://blazejs.org/) template engine is used
- Semantic UI as CSS library
- Main page is available in two languages: Polish and English
- All data is updating in real time (Meteor Reactivity)
- Users can order seeds from Index seminum list and check order status
- All forms are validated before submitting
- Posibility of generating reports and plants labels in PDF
- Validating inserted plant data with [GBIF API](http://www.gbif.org/developer/summary)
- User roles (permissions)
- [Papertrail](https://papertrailapp.com/) logs

## Screenshots

<img src="screenshots/image1.png" alt="Main page" width="285" height="172" /> <img src="screenshots/image2.png" alt="Index seminum" width="285" height="172" /> <img src="screenshots/image3.png" alt="Index seminum in English" width="285" height="172" />
<img src="screenshots/image4.png" alt="Index seminum in order state" width="285" height="172" /> <img src="screenshots/image5.png" alt="Index seminum after chosing seeds" width="285" height="172" /> <img src="screenshots/image6.png" alt="Index seminum when no seeds are chosen" width="285" height="172" />
<img src="screenshots/image7.png" alt="Index seminum order form" width="285" height="172" /> <img src="screenshots/image8.png" alt="Index seminum empty order form" width="285" height="172" /> <img src="screenshots/image9.png" alt="Index seminum correct order" width="285" height="172" />
<img src="screenshots/image10.png" alt="Correct checking of order status" width="285" height="172" /> <img src="screenshots/image11.png" alt="Uncorrect checking of order status" width="285" height="172" /> <img src="screenshots/image12.png" alt="Index plantarum" width="285" height="172" />
<img src="screenshots/image13.png" alt="Login page" width="285" height="172" /> <img src="screenshots/image14.png" alt="Register page" width="285" height="172" /> <img src="screenshots/image15.png" alt="User account page" width="285" height="172" />
<img src="screenshots/image16.png" alt="Seeds orders page" width="285" height="172" /> <img src="screenshots/image17.png" alt="Seeds orders report preview" width="285" height="172" /> <img src="screenshots/image18.png" alt="Seeds order details" width="285" height="172" />
<img src="screenshots/image19.png" alt="Changing order status" width="285" height="172" /> <img src="screenshots/image20.png" alt="Order PDF preview" width="285" height="172" /> <img src="screenshots/image21.png" alt="Canceling seeds order" width="285" height="172" />
<img src="screenshots/image22.png" alt="Plants page" width="285" height="172" /> <img src="screenshots/image23.png" alt="Adding new plant" width="285" height="172" /> <img src="screenshots/image24.png" alt="Editing plant data" width="285" height="172" />
<img src="screenshots/image25.png" alt="Plant details page" width="285" height="172" /> <img src="screenshots/image26.png" alt="Plant label preview" width="285" height="172" /> <img src="screenshots/image27.png" alt="Seeds page" width="285" height="172" />
<img src="screenshots/image28.png" alt="Adding gathered seeds" width="285" height="172" /> <img src="screenshots/image29.png" alt="Editing seeds record" width="285" height="172" /> <img src="screenshots/image30.png" alt="Seeds record details" width="285" height="172" />
<img src="screenshots/image31.png" alt="Gardens page" width="285" height="172" /> <img src="screenshots/image32.png" alt="Adding new garden" width="285" height="172" /> <img src="screenshots/image33.png" alt="Editing garden data" width="285" height="172" />
<img src="screenshots/image34.png" alt="Seeds record details" width="285" height="172" /> <img src="screenshots/image35.png" alt="News page" width="285" height="172" /> <img src="screenshots/image36.png" alt="Adding new news" width="285" height="172" />
<img src="screenshots/image37.png" alt="News help modal" width="285" height="172" /> <img src="screenshots/image38.png" alt="News preview modal" width="285" height="172" /> <img src="screenshots/image39.png" alt="Editing news" width="285" height="172" />
<img src="screenshots/image40.png" alt="Created news preview" width="285" height="172" /> <img src="screenshots/image41.png" alt="Users page" width="285" height="172" /> <img src="screenshots/image42.png" alt="Papertrail logs" width="285" height="172" />

## Used libraries/modules

- [accounts-password](https://atmospherejs.com/meteor/accounts-password)
- [session](https://atmospherejs.com/meteor/session)
- [reactive-dict](https://atmospherejs.com/meteor/reactive-dict)
- [check](https://atmospherejs.com/meteor/check)
- [http](https://atmospherejs.com/meteor/http)
- [meteortoys:allthings](https://atmospherejs.com/meteortoys/allthings)
- [natestrauser:publish-performant-counts](https://atmospherejs.com/natestrauser/publish-performant-counts)
- [meteorhacks:ssr](https://atmospherejs.com/meteorhacks/ssr)
- [alanning:roles](https://atmospherejs.com/alanning/roles)
- [perak:joins](https://atmospherejs.com/perak/joins)
- [kadira:blaze-layout](https://atmospherejs.com/kadira/blaze-layout)
- [kadira:flow-router](https://atmospherejs.com/kadira/flow-router)
- [nimble:restivus](https://atmospherejs.com/nimble/restivus)
- [aldeed:geocoder](https://atmospherejs.com/aldeed/geocoder)
- [momentjs:moment](https://atmospherejs.com/momentjs/moment)
- [rzymek:moment-locale-pl](https://atmospherejs.com/rzymek/moment-locales)
- [fourseven:scss](https://atmospherejs.com/fourseven/scss)
- [less](https://atmospherejs.com/meteor/less)
- [semantic:ui](https://atmospherejs.com/semantic/ui)
- [natestrauser:animate-css](https://atmospherejs.com/natestrauser/animate-css)
- [dropzone.js](https://www.npmjs.com/package/dropzone)
- [clipboard.js](https://www.npmjs.com/package/clipboard)
- [phantom.js](https://www.npmjs.com/package/phantom)
- [spin.js](https://www.npmjs.com/package/spin)
- [webshot](https://www.npmjs.com/package/webshot)
- [winston](https://www.npmjs.com/package/winston)

## [Documentation](docs/)

Documentation is in form of three PDF files that cover analysing, planning and realization of this project. Unfortunately it's only available in Polish language.

- [Project analysis](docs/1_Analiza_projektowa.pdf)
- [Application project](docs/2_Projekt_systemu.pdf)
- [System introduction](docs/3_Przedstawienie_systemu.pdf)

## Installation notes

Need to install first

On Windows:
- [node.js](https://nodejs.org/en/)
- [Meteor](https://www.meteor.com/install)
- Windows Build Tools `npm install -g --production windows-build-tools`

On Linux:
- Meteor `curl https://install.meteor.com/ | sh`
- node.js `apt-get install npm`

## After cloning this repository

In the project directory type in cmd/terminal:

```
meteor npm install
```

To run application type in cmd/terminal:

```
npm start
```

[logo-url]: public/images/logo.png "Logo"
[license-url]: https://img.shields.io/badge/license-Apache%202-blue.svg?style=flat "License"
[version-url]: https://img.shields.io/badge/version-1.0.0-brightgreen.svg?style=flat "Version"
[maintenance-url]: https://img.shields.io/maintenance/no/2017.svg?style=flat "Maintenance"
[language-url]: https://img.shields.io/badge/language-JavaScript-lightgrey.svg?style=flat "Language"
[done-url]: https://img.shields.io/badge/done-01.2017-yellow.svg?style=flat "Done"
[meteor-url]: https://img.shields.io/badge/Meteor-1.4.2.3-de4f4f.svg?style=flat "Meteor"
