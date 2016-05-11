var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: GLOBAL.conf.mail.service,
    auth: GLOBAL.conf.mail.auth
});

var mail = {
    send: function (to, subject, html) {
        console.log('transporter', transporter, GLOBAL.conf.mail);   
        console.log('send mail from : ' + GLOBAL.conf.mail.sendFrom + ' to : ' + to + ' about : ' + subject);
        transporter.sendMail({
            from: GLOBAL.conf.mail.sendFrom,
            to: to,
            subject: subject,
            html: html
        }, function (error, info) {
            if (error) {
                console.log('error', error);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });
    },
};

module.exports = mail;