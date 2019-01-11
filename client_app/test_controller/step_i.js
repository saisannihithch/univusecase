/**
 * Testing Client App - Step i
 * 
 * Preconditions:- 
 * 1. university_example is already deployed by running scripy buildAndDeploy.sh
 * 
 * Input Arguments:
 * - Name of the College
 * 
 * Result after running this:
 * - New College is ADDED
 * - College is_approved flag is 0
 * 
 */

'use strict';


const hlcClient = require('./../controller/composer/hlcClient.js');

// Emulate Request Body with input: college_name
let req = { body: { college_name: '#CollegeNAME' } };

// Log Response
let res = {
    send: function (arg) {
        console.log(arg);
    }
};

// Call requestAffiliation method
return hlcClient.requestAffiliation(req, res)