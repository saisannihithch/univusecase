'use strict';


function requestAffiliation() {
    // Show Progress untill the task is complete
    document.getElementById('college_progress').innerHTML = '<img src="./icons/progress.gif"/>';

    // Get the attributes from the UI i.e College Name
    let college_name = document.getElementById('college_name').value;

    // Set the Payload for the Post restapi call
    let options = { 'college_name': college_name };
    {
        // Use Async ajax call to post a request to the Client App
        $.when($.post('/composer/client/requestAffiliation', options)).done(function (_res) {

            // End progress display
            document.getElementById('college_progress').innerHTML = '';

            // Update the UI with college list
            displayCollegeList();

            // Close the Modal Dialog
            closeModal();
        });
    }
}


/**
 * Display Colleges
 */
function displayCollegeList() {

    // Use Async ajax call to get a list of colleges from the Client App
    $.when($.get('composer/client/getCollegeList')).done(function (_res) {

        // Successful response received, lets check it on browser console
        console.log(_res.college_list);

        let _str = '';
        let _nstr = '';

        // We will now build the Table to be displayed in UI
        _str += '<table><tr><th>Name</th><th>isApproved</th></tr>';
        _res.college_list.forEach(function (_row) {
            // Check is college is approved or NOT aaproved by university
            let td = (_row.is_approved == 0) ? '<td class="red"> NOT APPROVED</td>' 
                    : '<td class="green"> APPROVED</td>';

            _str += '<tr><td>' + '<a href="#" onClick=enrollProgram("' + _row.id + '")>' 
                    + _row.name + '</a></td>' + td + '</tr>';
            if (_row.is_approved == 0) {
                _nstr += '<input type="checkbox" name="collegeIds" value="' 
                    + _row.id + '">' + _row.name + '</input></br>';
            }
        })
        _str += '</table>';

        // Display College List
        document.getElementById('college_list').innerHTML = _str;
        document.getElementById('approve_list').innerHTML = _nstr;
    });
}



function submitApproveAffiliation() {
    let options = {};
    let arr = '';
    document.getElementById('approval_progress').innerHTML = '<img src="./icons/progress.gif"/>';
    $("input:checkbox[name=collegeIds]:checked").each(function () {
        let options = {};
        options.college_id = $(this).val();
        {
            $.when($.post('/composer/client/approveAffiliation', options)).done(function (_res) {
                document.getElementById('approval_progress').innerHTML = '';
                let val = _res.result;
                displayCollegeList();
                closeModal();
            });
        }
    });
}




function submitEnrollProgram() {
    document.getElementById('program_progress').innerHTML = '<img src="./icons/progress.gif"/>';
    let options = {};
    options.program_name = document.getElementById('program_name').value;
    options.college_id = collegeId;
    {
        $.when($.post('/composer/client/enrollProgram', options)).done(function (_res) {
            document.getElementById('program_progress').innerHTML = '';
            let val = _res.result;
            displayCollegeList();
            closeModal();
        });
    }
}

function submitGenerateCertificate() {
    let options = {};
    let arr = '';
    document.getElementById('certificate_progress').innerHTML = '<img src="./icons/progress.gif"/>';
    $("input:checkbox[name=gen_cer_student]:checked").each(function () {
        let options = {};
        options.student_id = $(this).val();
        {
            $.when($.post('/composer/client/issueCertificate', options)).done(function (_res) {
                document.getElementById('certificate_progress').innerHTML = '';
                let val = _res.result;
                displayStudentList();
                closeModal();
            });
        }
    });
}


function submitTakeAdmission() {
    var selected_program = $("input[name=program]:checked").val();
    if (selected_program == null) {
        alert('No Program Selected');
        return;
    }

    let student_name = document.getElementById('student_name').value;
    let student_dob = document.getElementById('student_dob').value;

    let studentDob = new Date(student_dob);
    if (studentDob == null) {
        alert('Incorrect Date Format');
        return;
    }

    let val = selected_program.split('##');
    let arr = '';
    document.getElementById('admission_progress').innerHTML = '<img src="./icons/progress.gif"/>';
    let options = {};
    options.student_name = student_name;
    options.student_dob = studentDob;
    options.college_name = val[0];
    options.program_name = val[1];
    {
        $.when($.post('/composer/client/takeAdmission', options)).done(function (_res) {
            document.getElementById('admission_progress').innerHTML = '';
            let val = _res.result;
            displayStudentList();
            closeModal();
        });
    }
}

/**
 * get History
 */
function getHistorian() {
    $.when($.get('fabric/getHistory')).done(function (_res) {
        let _str = '<h4> HyperLedger Transaction Blocks: ' + _res.result + '</h4>';
        if (_res.result === 'success') {
            _str += '<h3>Total Blocks: ' + _res.history.length + '</h3>';
            _str += '<table id="tt"><tr><th>Transaction Hash</th><th>Transaction Type</th><th>TimeStamp</th></tr>';
            _res.history.sort(function (a, b) { return (b.transactionTimestamp > a.transactionTimestamp) ? -1 : 1; });
            for (let each in _res.history) {
                (function (_idx, _arr) {
                    let _row = _arr[_idx];
                    _str += '<tr><td>' + _row.transactionId + '</td><td>' + _row.transactionType + '</td><td>' + _row.transactionTimestamp + '</td></tr>';
                })(each, _res.history);
            }
            _str += '</table>';
        }
        else { _str += formatMessage(_res.message); }
        document.getElementById('historian').innerHTML = _str;
    });
}

/**
 * Display Students
 */
function displayStudentList() {
    $.when($.get('composer/client/getStudentList')).done(function (_res) {
        console.log(_res.student_list);
        let _str = '';
        let _nstr = '';
        _str += '<table><tr><th>Name</th><th>Certificate ID</th></tr>';
        _res.student_list.forEach(function (_row) {
            let cid = (_row.certificateId == null) ? '...' : _row.certificateId;
            _str += '<tr><td>' + _row.name + '</td><td>' + cid + '</td></tr>';
        })
        _str += '</table>';
        document.getElementById('student_list').innerHTML = _str;
    });
}

let collegeId = null;
function enrollProgram(id) {
    collegeId = id;
    var appendthis = ("<div class='modal-overlay js-modal-close'></div>");
    $("body").append(appendthis);
    $(".modal-overlay").fadeTo(500, 0.7);
    var modalBox = $(this).attr('data-modal-id');
    $('#' + 'enrollProgram').fadeIn($(this).data());
}

function approveAffiliation() {
    var appendthis = ("<div class='modal-overlay js-modal-close'></div>");
    $("body").append(appendthis);
    $(".modal-overlay").fadeTo(500, 0.7);
    var modalBox = $(this).attr('data-modal-id');
    $('#' + 'approveAffiliation').fadeIn($(this).data());
}

function takeAdmission() {
    console.log('takeAdmission......');
    $.when($.get('composer/client/getCollegeList')).done(function (_res) {
        let _str = '';
        _str += '<table><tr><th>College</th><th>Programs</th></tr>';
        _res.college_list.forEach(function (_row) {
            if (_row.is_approved == 1) {
                let _pro_str = '<table>';
                _row.programs.forEach(function (_pro) {
                    _pro_str += '<tr><td><input type="radio" name="program" value="' + _row.name + '##' + _pro + '">' + _pro + '</input></td></tr>';
                })
                _str += '<tr class="mark"><td>' + _row.name + '</td><td>' + _pro_str + '</table></td>' + '</tr>';
            }
        })
        _str += '</table>';
        document.getElementById('admission_list').innerHTML = _str;
    });

    var appendthis = ("<div class='modal-overlay js-modal-close'></div>");
    $("body").append(appendthis);
    $(".modal-overlay").fadeTo(500, 0.7);
    var modalBox = $(this).attr('data-modal-id');
    $('#' + 'takeAdmission').fadeIn($(this).data());
}


function generateCertificate() {
    console.log('generateCertificate......');
    $.when($.get('composer/client/getStudentList')).done(function (_res) {
        let _str = '';
        _str += '<table><tr><th>Select</th><th>Student ID</th><th>Student Name</th></tr>';
        _res.student_list.forEach(function (_row) {
            if (_row.certificateId == null) {
                _str += '<tr><td><input type="checkbox" name="gen_cer_student" value="' + _row.id + '"></input></td><td>' + _row.id + '</td><td>' + _row.name + '</td></tr>';
            }
        })
        _str += '</table>';
        document.getElementById('student_cer_list').innerHTML = _str;
    });

    var appendthis = ("<div class='modal-overlay js-modal-close'></div>");
    $("body").append(appendthis);
    $(".modal-overlay").fadeTo(500, 0.7);
    var modalBox = $(this).attr('data-modal-id');
    $('#' + 'generateCertificate').fadeIn($(this).data());
}

function verifyCertificate() {
    let public_id = document.getElementById('verify_cer_id').value;
    if (public_id == '') {
        alert('Please Enter valid Public ID');
        return;
    }

    /*
        let options = { id: public_id };
        document.getElementById('verify_progress').innerHTML = '<img src="./icons/progress.gif"/>';
        $.when($.get('composer/client/getCertificateById', options)).done(function (_res) {
            console.log(res.certificates);
        });
    */

    document.getElementById('verify_progress').innerHTML = '<img src="./icons/progress.gif"/>';
    $.when($.get('composer/client/getStudentList')).done(function (_res) {
        let list = _res.student_list;
        var result = null;
        list.forEach(function (v) {
            console.log(v);
            if (v.certificateId == public_id) {
                result = v;
            }
        });
        console.log(result);

        if (result == null) {
            alert('Certificate Validation Failed - No such certificate found!');
            closeModal();
            return;
        }

        document.getElementById('_student_name_').innerHTML = result.name;
        document.getElementById('_program_name_').innerHTML = result.program;
        document.getElementById('_date_of_issue').innerHTML = Date().toString().split('2018')[0] + '2018';
        document.getElementById('__cer_id__').innerHTML = public_id;

        document.getElementById('verify_progress').innerHTML = '';
        closeModal();
        displayCertificate();
    });
}

function displayCertificate() {
    var appendthis = ("<div class='modal-overlay js-modal-close'></div>");
    $("body").append(appendthis);
    $(".modal-overlay").fadeTo(500, 0.7);
    var modalBox = $(this).attr('data-modal-id');
    $('#' + 'certificate').fadeIn($(this).data());
}
