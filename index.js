const express = require('express');
const cookieParser = require('cookie-parser');//ye cookie manula authentication me jore h
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//used for session cookie
const session = require('express-session');//expression session passport js me
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const passportJWT = require('./config/passport-jwt-strategy');//ye file kb aaya api's me

const passportGoogle = require('./config/passport-google-oauth2-strategy');//ye social authn me aaya h
//ye whi download krne ke baad ka h(npm install connect-mongo isse kya hoga jb v server restart kroge tb logout ni mtlb cookie delte ni hoga baar)
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware'); // ye middle ware kaunsa h flash messages wala h

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));
app.use(express.urlencoded());//it will read post request
app.use(cookieParser());

app.use(express.static('./assets'));
//ye line jo neeche likhe h wo multer me aya wo photo ka routes h
//make the upload path avilable to the browser
app.use('/uploads', express.static(__dirname +'/uploads'));

app.use(expressLayouts);//ise hm route se pehledaalna hoga reason ki jo v view render hoga use btana hoga ki wo kisi layout ko belong krta h

//extract style and scripts from sub pages into the layout ye static file set kia h
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



//set up view engine
app.set('view engine', 'ejs');
app.set('views','./views');//contact list yhi line __dirname krke kia the bs usi ko aise v likh skte h

//mongo store is used to store the session cookie in the db
//we need to add middle ware which takes session cookies and encrypts it
app.use(session({
    name: 'sociobook',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,//when there is requst which is not initialised which means a session which is not initialised which further means user is not logged in, identity is not established, in that case do we want to store extra data in session cookie, No i dont thats y i set it to false
    resave: false,// in this case, identity is established or some sort of data is present in session cookie(session data)session data means users information, if that is being store, do i want to change it , rewrite the same thing again
    cookie: {//giving age to the cookie
        maxAge: (1000 * 60 * 100)

    },//mongo store is used to store the session cookie in the db
    store: new MongoStore(//ye kb kr rhe h jb hm npm install connect-mongo(ye islia kr rhe h taaki server jb restart kre cookie delte na ho)
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        
        },  //in case the connection is not established
        function(err){
            console.log(err || 'connect-mongodb set up ok');
        }
    )
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(flash());//this use session cookie thats y we have setted here after session n before routes 
app.use(customMware.setFlash);


//use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){console.log(`Error in running the server, ${err}`)};
    console.log(`Server is running on port: ${port}`);
});