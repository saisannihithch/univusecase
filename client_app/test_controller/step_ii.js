/**
 * Testing Client App - Step ii
 * 
 * Preconditions:- 
 * 1. university_example is already deployed by running scripy buildAndDeploy.sh
 * 2. Atleast one college is added for affiliation. (step_i.js is executed)
 * 
 * Input Arguments:
 * - NONE
 * 
 * Result after running this:
 * - List of all colleges
 * 
 */

'use strict';


const hlcClient = require('./../controller/composer/hlcClient.js');

// No inputs needed fot this method
let req = { };

// Log Response
let res = {
    send: function (arg) {
        console.log(arg);
    }
};

// Call getCollegeList method
return hlcClient.getCollegeList(req, res)