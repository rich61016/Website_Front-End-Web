var apiUrl = "http://localhost:8080/";
var websiteUrl = "http://localhost:9000";
var geocodingKey = "AIzaSyATgrc7VameHyfmHjOKh7ldTiwuag6uxCc";

var storage = sessionStorage;
var UID = storage['auth'];
var userId = storage['userId'];
var authUrl = apiUrl + "member/auth/";
var createStoreUrl = apiUrl + "store/landing/";
var storeLandingUrl = websiteUrl + "/store/landing.html";
var loginUrl = websiteUrl + "/auth/login.html";
var geocodingBaseUrl = "https://maps.googleapis.com/maps/api/geocode/";
var createStoreForm = $('.ui.form');
var createStoreButton = $('#createStoreButton');
var storeNameInput = $('#storeName');
var storeAddressInput = $('#storeAddress');
var storePhoneInput = $('#storePhone');
var storeEmailInput = $('#storeEmail');
var storeOpenHourInput = $('#storeOpenHour');
var storeAreaInput = $('#twzipcode');
var storeOperateTypeInput = $('.ui.dropdown');
var storeIntroInput = $('#storeIntro');
var storeLat, storeLng;

$(document).ready(function() {
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
            }
        })
    } else {
        window.location.assign(loginUrl);
    }
}

function setformValidationRules() {
    createStoreForm.form({
        fields: {
            storeName: {
                identifier: 'storeName',
                rules: [
                    {
                        type: 'empty',
                        prompt: '請輸入貴寶號'
                    }
                ]
            },
            storeAddress: {
                identifier: 'storeAddress',
                rules: [
                    {
                        type: 'empty',
                        prompt: '沒有地址我們該去哪裡吃飯？'
                    }
                ]
            },
            storePhone: {
                identifier: 'storePhone',
                rules: [
                    {
                        type: 'empty',
                        prompt: '有聯絡電話才好聯絡感情啊'
                    }
                ]
            },
            storeEmail: {
                identifier: 'storeEmail',
                rules: [
                    {
                        type: 'empty',
                        prompt: '這樣有錢賺我們才好通知你啦'
                    },
                    {
                        type: 'email',
                        prompt: '這信箱好像不太對...'
                    }
                ]
            },
            storeOpenHour: {
                identifier: 'storeOpenHour',
                rules: [
                    {
                        type: 'empty',
                        prompt: '沒有營業時間，客人撲空怎麼辦？'
                    }
                ]
            },
            storeOperateType: {
                identifier: 'storeOperateType',
                rules: [
                    {
                        type: 'empty',
                        prompt: '麻煩選擇一下接單模式喔'
                    }
                ]
            }
        },
        inline : true,
        on: 'blur'
    });
}

function setSubmitButtonClickEventListener() {
    createStoreButton.click(function(e) {
        e.preventDefault();
        getStoreLatLngAndCreateStore();
    })
}

function getStoreLatLngAndCreateStore() {
    geocodingUrl = geocodingBaseUrl + "json?address=" + storeAddressInput.val() + "&key=" + geocodingKey;
    $.get(geocodingUrl, {}, function(data) {
        console.log(data.status);
        if (data.status == "OK") {
            console.log(data.results[0].geometry.location.lat);
            storeLat = data.results[0].geometry.location.lat;
            storeLng = data.results[0].geometry.location.lng;
            createStore();
        }
    });
}

function createStore() {
    $.ajax({
        url: createStoreUrl + userId,
        type: 'POST',
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
        data: {
            storeName : storeNameInput.val(),
            storeAddress : storeAddressInput.val(),
            storeLatitude : parseFloat(storeLat),
            storeLongitude : parseFloat(storeLng),
            storePhone : storePhoneInput.val(),
            storeEmail : storeEmailInput.val(),
            storeOpenHour : storeOpenHourInput.val(),
            storeArea : parseInt(storeAreaInput.twzipcode('get', 'zipcode')),
            storeOperateType : storeOperateTypeInput.dropdown('get value'),
            storeIntro : storeIntroInput.val()
        },
        success: function(data) {
            alert('success');
            window.location.assign(storeLandingUrl);
        }
    });
}