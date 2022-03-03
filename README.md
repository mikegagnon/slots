php -S localhost:8000

## Here is how I setup Babel

I followed some of these steps: https://ccoenraets.github.io/es6-tutorial/setup-babel/

    npm init
    npm install babel-cli babel-core --save-dev
    npm install babel-preset-es2015 --save-dev
    npm install npm-watch

### Then, I did some copy and paste on package.json

    "scripts": {
        "build": "babel --presets es2015 source/ -d js/",
        "watch": "npm-watch"
    },

and

    "watch": {
        "build": "source/*.js"
    }