'use strict';
/**
 * Write your transction processor functions here
 */
var NS_UNIVERSITY   = 'org.gryphon.casestudy.university';
var NS_COLLEGE      = 'org.gryphon.casestudy.college';
var NS_STUDENT      = 'org.gryphon.casestudy.student';

/**
 * create a new certificate entry
 * @param {org.gryphon.casestudy.university.issueCertificate} args - student details
 * @transaction
 */
function issueCertificate(args) {
    var certificateId = 'CertificateID-' + Date.now().toString();
    var certificate;
    var _assetRegistry;
    return getAssetRegistry(NS_UNIVERSITY + '.Certificate')
        .then(function (assetRegistry) {
            var factory = getFactory();

            certificate = factory.newResource(NS_UNIVERSITY, 'Certificate', certificateId);
            certificate.issuedTo = args.studentName;
            certificate.programName = args.programName;
            certificate.issuedDate = new Date();
            certificate.certificateId = certificateId;
            return assetRegistry.add(certificate)
                .then(function (_res) {
                    return getParticipantRegistry(NS_STUDENT + '.Student');
                })
                .then(function (assetRegistry) {
                    _assetRegistry = assetRegistry;
                    return assetRegistry.get(args.studentID)
                    .then(function (certifiedStudent) {
                        certifiedStudent.certificateId = certificateId;

                    var event = factory.newEvent(NS_UNIVERSITY, 'certificateIssuedEvent');            
                    event.certificateId = certificateId;
                    emit(event);                                

                        return _assetRegistry.update(certifiedStudent)    
                    })
                .then(function (_res) {
                    return (_res);
                }).catch(
                    function (error) {
                            return (error);
                    });
                });
            });
}

/**
* approve affiliation of college
* @param {org.gryphon.casestudy.university.approveAffiliation} args - id of college
* @transaction
*/
function approveAffiliation(args) {
    var registry;
    return getParticipantRegistry(NS_COLLEGE + '.College')
        .then(function (assetRegistry) {
            registry = assetRegistry;
            return assetRegistry.get(args.memberId)
                .then(function (college) {
                    college.isApproved = 1;
                    return registry.update(college)
                        .then(function (_res) {
                            return (_res);
                        }).catch(
                            function (error) {
                                return (error);
                            })
                });
        });
}


/**
* Enroll Program to the college
* @param {org.gryphon.casestudy.college.enrollProgram} args - id of college
* @transaction
*/
function enrollProgram(args) {
    var registry;
    return getParticipantRegistry(NS_COLLEGE + '.College')
        .then(function (assetRegistry) {
            registry = assetRegistry;
            return assetRegistry.get(args.collegeId)
                .then(function (college) {
                    if (college.isApproved == 1) {
                        college.programs.push(args.programName)
                    }
                    return registry.update(college)
                        .then(function (_res) {
                            console.log(_res)
                            return (_res);
                        }).catch(
                            function (error) {
                                return (error);
                            })
                });
        });
}

/**
 * Student can enroll them to a College and Program
 * @param {org.gryphon.casestudy.student.enrollStudent} args - student details
 * @transaction
 */
function enrollStudent(args) {
    return getParticipantRegistry(NS_STUDENT + '.Student')
        .then(function (assetRegistry) {
            var factory = getFactory();
            var studentId = 'Student-' + Date.now().toString();
            var student = factory.newResource(NS_STUDENT, 'Student', studentId);
            student.name = args.name;
            student.dob = args.dob;
            student.memberId = studentId;
            student.programName = args.programName;
            student.collegeName = args.collegeName;
            return assetRegistry.add(student)
                .then(function (_res) {
                    return (_res);
                }).catch(
                    function (error) {
                        return (error);
                    });
        });
}

/**
* College can request Affiliation to the University
* @param {org.gryphon.casestudy.college.requestAffiliation} args - name of college
* @transaction
*/
function requestAffiliation(args) {
    return getParticipantRegistry(NS_COLLEGE + '.College')
        .then(function (assetRegistry) {
            var factory = getFactory();
            var collegeId = 'College-' + Date.now().toString();
            var college = factory.newResource(NS_COLLEGE, 'College', collegeId);
            college.name = args.name;
            college.memberId = collegeId;
            college.isApproved = 0;
            college.programs = [];
            return assetRegistry.add(college)
                .then(function (_res) {
                    return (_res);
                }).catch(
                    function (error) {
                        return (error);
                    });
        });
}