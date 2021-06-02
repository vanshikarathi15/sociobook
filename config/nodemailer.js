const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path');

//this is the part which send th emails
//transporter is object which will be attached to nodemailer
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,//587 q use kr rhe h bcz we will be using tls which is highest form of security
    secure: false,
    auth: {
        user: 'punjneel',
        pass:'darbhanga'
    }
});

// render templatee defines whenever i m going to send an html email where the file will be placed  inside views 
let renderTemplate = (data, relativePath) => {
    let mailHTML;//where i will be storing all html is going to be send in mail
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),// mailers will carry all html elements, this reative path is place where this function is being called
        data,
        function(err, template){
            if(err){console.log('error in rendering template', err); return}

            mailHTML = template;
        }
    )
    return mailHTML;
}


module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}

