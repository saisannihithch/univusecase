/**
 * Testing Client App - Step iv
 * 
 * Preconditions:- 
 * 1. university_example is already deployed by running scripy buildAndDeploy.sh
 * 2. Atleast one college is added for affiliation. (step_i.js is executed)
 * 3. College where program is being added has to be approved by University (step_iii.js is executed)
 * 
 * Input Arguments:
 * - college_id
 * - program_name
 * 
 * Result after running this:
 * - New Program is added to the College
 * 
 */

'use strict';


const hlcClient = require('./../controller/composer/hlcClient.js');

var args = process.argv.slice(2);

if(args.length == 0) {
    console.log('---------');
    console.log('-- Please pass #CollegeID and Program Name as the argument');
    console.log('Eg: node step_iv.js College-1523857299940 M.B.A ');
    console.log('---------');
    return;
}

if(args.length == 1) {
    console.log('---------');
    console.log('-- Please pass Program Name as the second argument');
    console.log('Eg: node step_iv.js College-1523857299940 M.B.A ');
    console.log('---------');
    return;
}

// Pass input argument as college_id to the method
let req = { body: { college_id: args[0], program_name: args[1] } };

// Log Response
let res = {
    send: function (arg) {
        
        if(arg.college_list == null) {
            console.log(arg);
        } else {
            arg.college_list.forEach(college => {
                console.log('Programs Enrolled for ' + college.id + ': ' + college.programs);
            });
        }
    }
};

// Call enrollProgram method
return hlcClient.enrollProgram(req, res).then(() => {
    hlcClient.getCollegeList(req, res);
});
