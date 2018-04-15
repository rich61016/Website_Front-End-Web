var apiUrl = "http://localhost:8080/";
var websiteUrl = "http://localhost:9000";

var storage = sessionStorage;
var UID = storage['auth'];
var authUrl = apiUrl + "member/auth/";
var getEmployeeUrl = apiUrl + "store/authorization/";
var deleteEmployeeUrl = apiUrl + "store/authorization/";
var createEmployeeUrl = apiUrl + "store/authorization/";
var loginUrl = websiteUrl + "/auth/login.html";
var storeMemberUrl = websiteUrl + "/store/authorization/member.html";
var storeHomeUrl = websiteUrl + "/store/home.html";

$(document).ready(function() {
    checkLoginStatus();
    setEmployees();
    setCreateEmployeeButtonClickEventListener();
    setStoreHomeButtonClickEventListener();
});

function checkLoginStatus() {
    if (UID) {
        $.get(authUrl + UID, {}, function(data) {
            if (data.status != 200) {
                storage.clear();
                window.location.assign(loginUrl);
            }
        })
    } else {
        storage.clear();
        window.location.assign(loginUrl);
    }
}

function setEmployees() {
    if (storage['authPayload']) {
        showEmployee();
        setDeleteEmployeeButtonClickEventListener();
    } else {
        $.get(getEmployeeUrl + storage['storeId'], {}, function(data) {
            if (data.status == 200) {
                if (data.authPayload != "null") {
                    storage['authPayload'] = data.authPayload;
                    showEmployee();
                    setDeleteEmployeeButtonClickEventListener();
                }
            }
        });
    }
}

function showEmployee() {
    var employees = jQuery.parseJSON(storage['authPayload']);
    var index = 0;
    for (var key = 0; key < employees.length; key ++) {
        var employee = employees[key];
        if (index != 0) {
            $('#employeeListDiv').append('<div class="ui divider"></div>');
        }
        var employeeDiv = 
            '<div class="row">' +
                '<div class="four wide column">' +
                    '<img class="ui small circular centered image" src="/static/images/defaultEmployee.png">' +
                '</div>' +
                '<div class="one column"></div>' +
                '<div class="seven wide column">' +
                    '<div class="ui horizontal divided relaxed big list">' +
                        '<span class="item text-white">' + employee.storeUserName + '</span>' +
                        '<span class="item text-warning">' + employee.storeUserCellphone + '</span>' +
                    '</div>' +
                '</div>' +
                '<div class="four wide center aligned column">' +
                    '<button data-userId="' + employee.storeUser + '" class="large ui red button custom-font-thin deleteEmployee">刪除</button>' +
                '</div>' +
            '</div>';
        $('#employeeListDiv').append(employeeDiv);
        index++;
    }
}

function setDeleteEmployeeButtonClickEventListener() {
    $('button.deleteEmployee').click(function(e) {
        e.preventDefault();
        console.log($(this).attr('data-userId') + " " + storage['storeId']);
        $.ajax({
            url : deleteEmployeeUrl + storage['storeId'] + "/" + $(this).attr('data-userId'),
            type : 'DELETE',
            contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
            success : function() {
                storage.removeItem('authPayload');
                window.location.assign(storeMemberUrl);
            }
        });
    });
}

function setCreateEmployeeButtonClickEventListener() {
    $('#createEmployee').click(function(e) {
        e.preventDefault();
        $.ajax({
            url : createEmployeeUrl,
            type : 'POST',
            contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
            data : {
                storeUserCellphone : $('#userCellphone').val(),
                storeId : storage['storeId']
            },
            success : function() {
                storage.removeItem('authPayload');
                window.location.assign(storeMemberUrl);
            }
        });
    });
}

function setStoreHomeButtonClickEventListener() {
    $('#storeHomeButton').click(function(e) {
        e.preventDefault();
        storage.removeItem('authPayload');
        window.location.assign(storeHomeUrl);
    });
}