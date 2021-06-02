//ye worker create hua h after creating a config file
//we created a worker which is going to send those emails for us instead of sending via controller
const queue = require('../config/kue');

const commentMailer = require('../mailers/comments_mailer');

queue.process('emails', function(job, done){
    console.log('emails worker is processing a job', job.data);
    commentMailer.newComment(job.data);

    done();
});