/**
 * Testing Client App - Step vii
 * 
 * Preconditions:- 
 * 1. university_example is already deployed by running scripy buildAndDeploy.sh
 * 2. Atleast one college is added for affiliation. (step_i.js is executed)
 * 3. College where program is being added has to be approved by University (step_iii.js is executed)
 * 4. College should have enrolled the program (step_iv.js is executed)
 * 5. Student have taken admission (step_v.js is executed)
 * 
 * Input Arguments:
 * - certificate_id
 * 
 * Result after running this:
 * - A certificate of completion is awarded to student
 * 
 */

'use strict';


const hlcClient = require('./../controller/composer/hlcClient.js');

var args = process.argv.slice(2);

if(args.length < 1) {
    console.log('---------');
    console.log('-- Please pass #CertificateID as the argument');
    console.log('Eg: node step_viii.js CertificateID-1523948684198');
    console.log('---------');
    return;
}

// Pass input argument as id to the method
let req = { query: { id: args[0] } };

// Log Response
let res = {
    send: function (arg) {
        console.log(arg);
    }
};

// Call getCertificateById method
hlcClient.getCertificateById(req, res);