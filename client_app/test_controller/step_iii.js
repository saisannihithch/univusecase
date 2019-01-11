/**
 * Testing Client App - Step iii
 * 
 * Preconditions:- 
 * 1. university_example is already deployed by running scripy buildAndDeploy.sh
 * 2. Atleast one college is added for affiliation. (step_i.js is executed)
 * 
 * Input Arguments:
 * - college_id
 * 
 * Result after running this:
 * - College is_approved flag is 1
 * 
 */

'use strict';


const hlcClient = require('./../controller/composer/hlcClient.js');

var args = process.argv.slice(2);

if(args.length == 0) {
    console.log('---------');
    console.log('-- Please pass #CollegeID as the argument');
    console.log('Eg: node step_iii.js College-1523857299940');
    console.log('---------');
    return;
}

// Pass input argument as college_id to the method
let req = { body: { college_id: args[0] } };

// Log Response
let res = {
    send: function (arg) {
        console.log(arg);
    }
};
{
    
}
// Call approveAffiliation method
hlcClient.approveAffiliation(req, res).then(() => {
    hlcClient.getCollegeList(req, res);
    return;
});
