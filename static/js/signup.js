var apiUrl = "http://localhost:8080/";
/* var websiteUrl = "http://localhost:9000"; */

var storage = sessionStorage;
var UID = storage['auth'];
var authUrl = apiUrl + "member/auth/";
var signupUrl = apiUrl + "member/signup";
var storeLandingUrl = websiteUrl + "/store/landing.html";
var signupButton = $('#signupButton');
var signupForm = $('.ui.form');
var signupName = $('#signupName');
var signupCellphone = $('#signupCellphone');
var signupPassword = $('#signupPassword');
var ConfirmPassword = $('#confirmPassword');
var signupEmail = $('#signupEmail');
var errorMessageDiv = $('.ui.error.message');

$(document).ready(function () {
    checkLoginStatus();
    setformValidationRules();
    setSubmitButtonClickEventListener();
});

function checkLoginStatus() {
    if (UID) {
        $.get(authUrl + UID, {}, function(data) {
            if (data.status == 200) {
                storage['userName'] = data.user.userName;
                storage['userAvatar'] = data.user.userAvatar;
                window.location.assign(storeLandingUrl);
            }
        })
    }
}

function setformValidationRules() {
    signupForm.form({
        fields: {
            signupName: {
                identifier: 'signupName',
                rules: [
                    {
                        type: 'empty',
                        prompt: '請輸入您的大號'
                    }
                ]
            },
            signupCellphone: {
                identifier: 'signupCellphone',
                rules: [
                    {
                        type: 'empty',
                        prompt: '要提供電話，店家才找得到你R'
                    },
                    {
                        type: 'regExp',
                        value: '/^[09]{2}[0-9]{2}-[0-9]{6}$/',
                        prompt: '這號碼好像不太對喔'
                    }
                ]
            },
            signupPassword: {
                identifier: 'signupPassword',
                rules: [
                    {
                        type: 'empty',
                        prompt: '請輸入別人不好猜，但還能記得住的密碼'
                    },
                    {
                        type: 'minLength[3]',
                        prompt: '密碼起碼{ruleValue}個字，別人比較不好猜吧'
                    }
                ]
            },
            confirmPassword: {
                identifier: 'confirmPassword',
                rules: [
                    {
                        type: 'match[signupPassword]',
                        prompt: '兩次輸入的密碼好像不太一樣'
                    }
                ]
            },
            signupEmail: {
                identifier: 'signupEmail',
                rules: [
                    {
                        type: 'empty',
                        prompt: '拜偷給一下信箱啦'
                    },
                    {
                        type: 'regExp',
                        value: '/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/',
                        prompt: '真的有這種信箱嗎'
                    }
                ]
            }
        },
        inline : true,
        on: 'blur'
    });
}

function setSubmitButtonClickEventListener() {
    signupButton.click(function (e) {
        e.preventDefault();
        if (signupForm.form('is valid')) {
            $.ajax({
                url : signupUrl,
                type : 'POST',
                data: {
                    userName : signupName.val(),
                    userCellphone : signupCellphone.val(),
                    userPassword : signupPassword.val(),
                    userEmail : signupEmail.val()
                },
                contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
                success: function(data) {
                    if (data.status == 200) {
                        clearErrorMessage();
                        alert('success');
                        storage['userId'] = data.auth.userId;
                        storage['auth'] = data.auth.userUuid;
                        storage['userName'] = data.user.userName;
                        storage['userAvatar'] = data.user.userAvatar;
                        window.location.assign(storeLandingUrl);
                    } else {
                        setErrorMessage();
                        return false;
                    }
                }
            });
        }
    })
}

function setErrorMessage() {
    if (errorMessageDiv.html() == "") {
        errorMessageDiv.toggle();
        errorMessageDiv.html('註冊失敗了orz，請稍後再試');
    }
}

function clearErrorMessage() {
    if (errorMessageDiv.html() != "") {
        errorMessageDiv.toggle();
        errorMessageDiv.html('');
    }
}