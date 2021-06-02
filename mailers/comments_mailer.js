const nodeMailer = require('../config/nodemailer');

// create a function which will send mail
//this is another way of exporting a metho issepehle dusre tarike se krte the
// whenever a new comment is made i need this function to be called kahan se hoga comments controller
exports.newComment = (comment) => {
    console.log("Inside new comment mailer", comment);
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');


    nodeMailer.transporter.sendMail({
        from: 'punjneel@gmail.com',
        to: comment.user.email,
        subject: "New Comment Published",
        html: htmlString
    }, (err, info) => {
        if(err){
            console.log("error in sending email", err);
            return;
        }
        // console.log("Message sent ", info);
        return;
    });
}