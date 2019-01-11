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
 * - student_name
 * - college_name
 * - program_name
 * 
 * Result after running this:
 * - New Student is enrolled
 * 
 */

'use strict';


const hlcClient = require('./../controller/composer/hlcClient.js');

var args = process.argv.slice(2);

if(args.length < 3) {
    console.log('---------');
    console.log('-- Please pass Student Name, College Name and Program Name as the arguments');
    console.log('Eg: node step_v.js "John Doe" CollegeNAME MBA');
    console.log('---------');
    return;
}

let DOB = new Date;
// Pass input argument as college_id to the method
let req = { body: { student_name: args[0], student_dob: DOB, college_name: args[1], program_name: args[2] } };

// Log Response
let res = {
    send: function (arg) {
        console.log(arg);
    }
};

// Call takeAdmission method
return hlcClient.takeAdmission(req, res).then(() => {
    //hlcClient.getStudentList(req, res);
});
