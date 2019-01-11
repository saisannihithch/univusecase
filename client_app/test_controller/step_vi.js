/**
 * Testing Client App - Step v
 * 
 * Preconditions:- 
 * 1. university_example is already deployed by running scripy buildAndDeploy.sh
 * 2. Atleast one college is added for affiliation. (step_i.js is executed)
 * 3. College where program is being added has to be approved by University (step_iii.js is executed)
 * 4. College should have enrolled the program (step_iv.js is executed)
 * 
 * Input Arguments:
 * - None
 * 
 * Result after running this:
 * - List of all Student
 * 
 */

'use strict';


const hlcClient = require('./../controller/composer/hlcClient.js');

// No inputs needed
let req = { };

// Log Response
let res = {
    send: function (arg) {
        console.log(arg);
    }
};

// Call getStudentList method
hlcClient.getStudentList(req, res);
