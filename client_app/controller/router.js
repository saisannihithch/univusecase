'use strict';

let express = require('express');
let router = express.Router();
let format = require('date-format');

let hlcClient = require('./composer/hlcClient');

module.exports = router;
/**
 * This is a request tracking function which logs to the terminal window each request coming in to the web serve and
 * increments a counter to allow the requests to be sequenced.
 * @param {express.req} req - the inbound request object from the client
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 *
 * @function
 */
router.use(function(req, res, next) {
    console.log('...');
    console.log('........');
    console.log('..............');
    console.log(format.asString('hh:mm:ss.SSS', new Date())+'::............ '+req.url+' .............');
    console.log('req: ' + JSON.stringify(req.body, null, 4) );
    next(); // make sure we go to the next routes and don't stop here

    function afterResponse() {
        res.removeListener('finish', afterResponse);

        console.log('<<<<< ****** >>>>>');
        console.log('res: ' + (res.statusCode==200)? 'Transaction Success' : 'Transaction Failed' );
        console.log('<<<<< ****** >>>>>');
        console.log('........');
        console.log('...');
            
    }    
    res.on('finish', afterResponse);    
});

router.get('/fabric/getHistory', hlcClient.getHistory);
router.post('/composer/client/requestAffiliation*', hlcClient.requestAffiliation);
router.post('/composer/client/enrollProgram*', hlcClient.enrollProgram);
router.get('/composer/client/getCollegeList*', hlcClient.getCollegeList);
router.get('/composer/client/getStudentList*', hlcClient.getStudentList);
router.post('/composer/client/takeAdmission*', hlcClient.takeAdmission);
router.post('/composer/client/approveAffiliation*', hlcClient.approveAffiliation);
router.post('/composer/client/issueCertificate*', hlcClient.issueCertificate);
router.get('/composer/client/getCertificateById*', hlcClient.getCertificateById);
