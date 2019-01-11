/**
 * Hyperledger Fabric with gryphon university casestudy
 * 
 * Demonstrates the building of Client App using composer
 * 1. Connect to the Network Using Network Admin Card
 * 2. Access Registries 
 * 3. Calling Transactions
 * 4. Create Participant
 * 5. Run Query
 * 6. Handling Event
 */

'use strict';

const fs = require('fs');
const path = require('path');
const _home = require('os').homedir();


var NS_UNIVERSITY = 'org.gryphon.casestudy.university';
var NS_COLLEGE = 'org.gryphon.casestudy.college';
var NS_STUDENT = 'org.gryphon.casestudy.student';

const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const cardIDForNetworkAdmin = 'admin@university_example';

/**
 * College Requests Affiliation to the university
 * @param {express.req} req - the inbound request object from the client
 *  req.body.college_name - the name of the college
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns void 
 * @function
 */

exports.requestAffiliation = function (req, res, next) {
    console.log('...... requestAffiliation .......');

    let college_name = req.body.college_name;
    console.log("req: " + college_name);
    let businessNetworkConnection = new BusinessNetworkConnection();
    return businessNetworkConnection.connect(cardIDForNetworkAdmin)
        .then(() => {
            let factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            const requestAffiliation = factory.newTransaction(NS_COLLEGE, 'requestAffiliation');
            requestAffiliation.name = college_name;
            return businessNetworkConnection.submitTransaction(requestAffiliation)
                .then(() => {
                    res.send({ "result": "Success" });
                })
                .catch((error) => {
                    console.log('requestAffiliation Transaction failed: text', error.message);
                    res.send({
                        'result': 'failed',
                        'error': ' failed on requestAffiliation transaction ' + error.message
                    });
                });
        })
        .catch((error) => {
            console.log('Business network connection failed: text', error.message);
            res.send({
                'result': 'failed',
                'error': ' requestAffiliation failed on on business network connection ' + error.message
            });
        });
};

/**
 * get College Records
 * @param {express.req} req - the inbound request object from the client
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns {Array} an array of colleges
 * @function
 */
exports.getCollegeList = function (req, res, next) {
    console.log('...... College List .......');
    let allColleges = new Array();
    let businessNetworkConnection = new BusinessNetworkConnection();
    return businessNetworkConnection.connect(cardIDForNetworkAdmin)
        .then(() => {
            return businessNetworkConnection.getParticipantRegistry(NS_COLLEGE + '.College')
                .then(function (registry) {
                    return registry.getAll()
                        .then((collegeList) => {
                            for (let each in collegeList) {
                                (function (_idx, _arr) {
                                    let _jsn = _arr[_idx];
                                    let jsn = {
                                        "id": _jsn.memberId,
                                        "name": _jsn.name,
                                        "is_approved": _jsn.isApproved,
                                        "programs": _jsn.programs
                                    };
                                    allColleges.push(jsn);
                                })(each, collegeList);
                            }
                            res.send({ 'result': 'success', 'college_list': allColleges });
                        })
                        .catch((error) => {
                            console.log('error with getAll Colleges', error);
                            res.send({ 'result': 'false', 'college_list': [] });
                        });
                })
                .catch((error) => {
                    console.log('error with getCollegeList', error);
                    res.send({ 'result': 'false', 'college_list': [] });
                });
        })
        .catch((error) => { console.log('error with business network Connect', error); });
};

/**
 * University approves College Affiliation
 * @param {express.req} req - the inbound request object from the client
 *  req.body.college_id - Unique ID of the college
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns result (Success / Failure)
 * @function
 */
exports.approveAffiliation = function (req, res, next) {
    console.log('...... approveAffiliation .......');

    let college_id = req.body.college_id;
    console.log("college_id: " + college_id);

    let businessNetworkConnection = new BusinessNetworkConnection();
    return businessNetworkConnection.connect(cardIDForNetworkAdmin)
        .then(() => {
            let factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            const approveAffiliation = factory.newTransaction(NS_UNIVERSITY, 'approveAffiliation');
            approveAffiliation.memberId = college_id;
            return businessNetworkConnection.submitTransaction(approveAffiliation)
                .then(() => {
                    res.send({ "result": "Success" });
                })
                .catch((error) => {
                    console.log(' approveAffiliation Transaction failed: text', error.message);
                    res.send({
                        'result': 'failed',
                        'error': ' failed on requestAffiliation transaction ' + error.message
                    });
                });
        })
        .catch((error) => {
            console.log('Business network connection failed: text', error.message);
            res.send({
                'result': 'failed',
                'error': ' approveAffiliation failed on on business network connection ' + error.message
            });
        });
};

/**
 * College Starts new Programs / Courses
 * @param {express.req} req - the inbound request object from the client
 *  req.body.college_id - Unique ID of the college
 *  req.body.program_name - Name of new Program
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns result (Success / Failure)
 * @function
 */

exports.enrollProgram = function (req, res, next) {
    console.log('...... enrollProgram .......');

    let college_id = req.body.college_id;
    let program_name = req.body.program_name;
    console.log("college_id: " + college_id);
    console.log("program_name: " + program_name);

    let businessNetworkConnection = new BusinessNetworkConnection();
    return businessNetworkConnection.connect(cardIDForNetworkAdmin)
        .then(() => {
            let factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            const enrollProgram = factory.newTransaction(NS_COLLEGE, 'enrollProgram');
            enrollProgram.programName = program_name;
            enrollProgram.collegeId = college_id;
            return businessNetworkConnection.submitTransaction(enrollProgram)
                .then(() => {
                    res.send({ "result": "Success" });
                })
                .catch((error) => {
                    console.log('enrollProgram Transaction failed: text', error.message);
                    res.send({
                        'result': 'failed',
                        'error': ' failed on enrollProgram transaction ' + error.message
                    });
                });
        })
        .catch((error) => {
            console.log('Business network connection failed: text', error.message);
            res.send({
                'result': 'failed',
                'error': ' enrollProgram failed on on business network connection ' + error.message
            });
        });
};



/**
 * Student can take admission now
 * @param {express.req} req - the inbound request object from the client
 *  req.body.student_name - Unique ID of the college
 *  req.body.student_dob - Unique ID of the college
 *  req.body.college_name - Unique ID of the college
 *  req.body.program_name - Name of new Program
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns result (Success / Failure)
 * @function
 */
exports.takeAdmission = function (req, res, next) {

    let student_name = req.body.student_name;
    let student_dob = req.body.student_dob;
    let college_name = req.body.college_name;
    let program_name = req.body.program_name;

    console.log("student_name: " + student_name);
    console.log("student_dob: " + student_dob);
    console.log("college_name: " + college_name);
    console.log("program_name: " + program_name);

    let businessNetworkConnection = new BusinessNetworkConnection();
    return businessNetworkConnection.connect(cardIDForNetworkAdmin)
        .then(() => {
            let factory = businessNetworkConnection.getBusinessNetwork().getFactory();

            const enrollStudent = factory.newTransaction(NS_STUDENT, 'enrollStudent');
            enrollStudent.name = student_name;
            enrollStudent.dob = new Date();
            enrollStudent.collegeName = college_name;
            enrollStudent.programName = program_name;
            return businessNetworkConnection.submitTransaction(enrollStudent)
                .then(() => {
                    res.send({ "result": "Success" });
                    console.log(' enrollStudent Transaction Success......');
                })
                .catch((error) => {
                    console.log('enrollStudent Transaction failed: text', error.message);
                    res.send({ 'result': 'failed', 
                    'error': ' failed on enrollStudent transaction ' + error.message });
                });
        })
        .catch((error) => {
            console.log('Business network connection failed: text', error.message);
            res.send({ 'result': 'failed', 
            'error': ' enrollStudent failed on on business network connection ' + error.message });
        });
};




/**
 * Returns the list of Students
 * @param {express.req} req - the inbound request object from the client
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns result array of students
 * @function
 */
exports.getStudentList = function (req, res, next) {
    console.log('...... Student List .......');

    let allStudents = new Array();
    let businessNetworkConnection = new BusinessNetworkConnection();
    return businessNetworkConnection.connect(cardIDForNetworkAdmin)
        .then(() => {
            return businessNetworkConnection.getParticipantRegistry(NS_STUDENT + '.Student')
                .then(function (registry) {
                    return registry.getAll()
                        .then((studentList) => {
                            for (let each in studentList) {
                                (function (_idx, _arr) {
                                    let _jsn = _arr[_idx];
                                    let jsn = {
                                        "id": _jsn.memberId,
                                        "name": _jsn.name,
                                        "certificateId": _jsn.certificateId,
                                        "program": _jsn.programName
                                    };
                                    allStudents.push(jsn);
                                })(each, studentList);
                            }
                            res.send({ 'result': 'success', 'student_list': allStudents });
                        })
                        .catch((error) => { console.log('error with getAll Students', error); });
                })
                .catch((error) => { console.log('error with getStudentList', error); });
        })
        .catch((error) => { console.log('error with business network Connect', error); });
};


/**
 * University issues a certificate to Student
 * @param {express.req} req - the inbound request object from the client
 *  req.body.student_name - Unique ID of the college
 *  req.body.student_dob - Unique ID of the college
 *  req.body.college_name - Unique ID of the college
 *  req.body.program_name - Name of new Program
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns result (Success / Failure)
 * @function
 */
exports.issueCertificate = function (req, res, next) {
    console.log('...... issueCertificate .......');

    let student_id = req.body.student_id;
    console.log("student_id: " + student_id);

    let businessNetworkConnection = new BusinessNetworkConnection();
    return businessNetworkConnection.connect(cardIDForNetworkAdmin)
        .then(() => {
            return businessNetworkConnection.getParticipantRegistry(NS_STUDENT + '.Student')
                .then(function (registry) {
                    return registry.get(student_id)
                        .then((student) => {

                            let factory = businessNetworkConnection.getBusinessNetwork().getFactory();

                            const issueCertificate = factory.newTransaction(NS_UNIVERSITY, 'issueCertificate');
                            issueCertificate.studentID = student_id;
                            issueCertificate.studentName = student.name;
                            issueCertificate.programName = student.programName;
                            console.log(student.name);
                            console.log(student.programName);
                            return businessNetworkConnection.submitTransaction(issueCertificate)
                                .then(() => {
                                    res.send({ "result": "Success" });
                                })
                                .catch((error) => {
                                    console.log('issueCertificate Transaction failed: text', error.message);
                                    res.send({ 'result': 'failed', 
                                    'error': ' failed on issueCertificate transaction ' + error.message });
                                });
                        })
                        .catch((error) => {
                            console.log('issueCertificate Transaction failed: text', error.message);
                            res.send({ 'result': 'failed', 
                            'error': ' failed on getParticipant registry' + error.message });
                        });
                })
                .catch((error) => {
                    console.log('issueCertificate Transaction failed: text', error.message);
                    res.send({ 'result': 'failed', 
                    'error': ' failed on issueCertificate transaction ' + error.message });
                });
        })
        .catch((error) => {
            console.log('Business network connection failed: text', error.message);
            res.send({ 'result': 'failed', 'error': ' issueCertificate failed on on business network connection ' + error.message });
        });
};

/**
 * Anyone can search for the certificate details with certificate ID
 * @param {express.req} req - the inbound request object from the client
 *  req.body.id - Unique ID of the Certificate
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns result (Success / Failure)
 * @function
 */
exports.getCertificateById = function (req, res, next) {
    console.log('...... getCertificateById .......');

    let certificateId = req.query.id;
    console.log('certificateId is: ' + certificateId);

    let allCertificates = new Array();
    let businessNetworkConnection = new BusinessNetworkConnection();
    return businessNetworkConnection.connect(cardIDForNetworkAdmin)
        .then(() => {
            return businessNetworkConnection.query('selectCertificate', { id: certificateId })
                .then((certificateList) => {
                    for (let each in certificateList) {
                        (function (_idx, _arr) {
                            let _jsn = _arr[_idx];
                            let jsn = { "id": _jsn.certificateId, 
                            "student": _jsn.issuedTo, 
                            "issued_date": _jsn.issuedDate, 
                            "program": _jsn.programName, };
                            allCertificates.push(jsn);
                        })(each, certificateList);
                    }
                    if (allCertificates.length > 0) {
                        res.send({ 'result': 'success', 'certificates': allCertificates });
                    } else {
                        res.send({ 'result': 'failed', 'certificates': allCertificates });
                    }
                })
                .catch((error) => { console.log('error with certificateById', error); });
        })
        .catch((error) => { console.log('error with business network Connect', error); });
};



/**
 * Subscribe for Event
 * @param {express.req} req - the inbound request object from the client
 *  req.body.id - Unique ID of the Certificate
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns result (Success / Failure)
 * @function
 */

 let bRegistered = false;
 exports.subscribeForEvents = function (req, res, next)
 {
    console.log('...... subscribeForEvents .......');

    if (bRegistered) { res.send('Already Registered'); }
    else{
        bRegistered = true;
        let businessNetworkConnection = new BusinessNetworkConnection();
        businessNetworkConnection.setMaxListeners(50);
        return businessNetworkConnection.connect(cardIDForNetworkAdmin)
        .then(() => {
            // using the businessNetworkConnection, start monitoring for events. 
            // when an event is provided, call the _monitor function, passing in 
            // the al_connection, f_connection and event information
            businessNetworkConnection.on('event', (event) => {_monitor(event); });
            res.send('event registration complete');
        }).catch((error) => {
            // if an error is encountered, log the error and send it back to the requestor
            console.log(method+' business network connection failed'+error.message);
            res.send(method+' business network connection failed'+error.message);
        });
    }
 };

/**
 * Subscribe for Event
 * @param req - Blockchain events
 * @function
 */

function _monitor(_event)
{
    let method = '_monitor';
    console.log(method+ ' _event received: '+_event.$type);

    // Can use Socket.io to connect to UI
    // io.emit(_event.name, _event.value);

    if(_event.$type != 'certificateIssuedEvent') {    
        // Probable Action: Fetch Certifcate & Student Details and Send Email
        // sendEmail(subject, message);    
    }
}



/**
 * get Historian Records
 * @param {express.req} req - the inbound request object from the client
 *  req.body.registry: _string - type of registry to search;
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns {Array} an array of members
 * @function
 */
exports.getHistory = function(req, res, next) {
    let allHistory = new Array();
    let businessNetworkConnection;
    let ser;
    let archiveFile = fs.readFileSync(path.join(path.dirname(require.main.filename),'dist','university_example.bna'));

    return BusinessNetworkDefinition.fromArchive(archiveFile)
    .then((bnd) => {
        ser = bnd.getSerializer();
        businessNetworkConnection = new BusinessNetworkConnection();
        return businessNetworkConnection.connect(cardIDForNetworkAdmin)
            .then(() => {
                return businessNetworkConnection.getRegistry('org.hyperledger.composer.system.HistorianRecord')
                .then(function(registry){
                    return registry.getAll()
                    .then ((history) => {
                        for (let each in history)
                            { (function (_idx, _arr)
                                { let _jsn = _arr[_idx];
                                allHistory.push(ser.toJSON(_jsn));
                            })(each, history);
                        }
                        res.send({'result': 'success', 'history': allHistory});
                    })
                    .catch((error) => {console.log('error with getAll History', error);});
                })
                .catch((error) => {console.log('error with getRegistry', error);});
            })
            .catch((error) => {console.log('error with business network Connect', error);});
    })
    .catch((error) => {console.log('error with admin network Connect', error);});
};
