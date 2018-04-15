var apiUrl = "http://localhost:8080/";
var websiteUrl = "http://localhost:9000";
var geocodingKey = "AIzaSyATgrc7VameHyfmHjOKh7ldTiwuag6uxCc";

var storage = sessionStorage;
var UID = storage['auth'];
var storeInfoUrl = apiUrl + "store/info/"
var loginUrl = websiteUrl + "/auth/login.html";
var geocodingBaseUrl = "https://maps.googleapis.com/maps/api/geocode/";
var storeInfo = storage['storeInfo'];
var submitButton = $('#submitButton');
var storeLat, storeLng;

$(document).ready(function() {
    checkLoginStatus();
    setStoreInfo();
    setSubmitButtonClickEventListener();
});

function checkLoginStatus() {
    if (!UID) {
        window.location.assign(loginUrl);
    }
}

function setStoreInfo() {
    if (storeInfo) {
        showStoreInfo();
    } else {
        $.get(storeInfoUrl + storage['storeId'], {}, function(data) {
            if (data.status == 200) {
                alert('success');
                storage['storeInfo'] = data.storePayload;
                showStoreInfo()
            }
        });
    }
};

function showStoreInfo() {
    var store = jQuery.parseJSON(storage['storeInfo']);
    $('#storeName').val(store.storeName);
    $('#storeAddress').val(store.storeAddress);
    $('#storePhone').val(store.storePhone);
    $('#storeEmail').val(store.storeEmail);
    $('#storeOpenHour').val(store.storeOpenHour);
    $('#storeIntro').val(store.storeIntro);
    $('.ui.dropdown').dropdown('set selected', store.storeOperateType);
}

function setSubmitButtonClickEventListener() {
    submitButton.click(function(e) {
        e.preventDefault();
        getStoreLatLngAndUpdateStore();
    });
}

function getStoreLatLngAndUpdateStore() {
    geocodingUrl = geocodingBaseUrl + "json?address=" + $('#storeAddress').val() + "&key=" + geocodingKey;
    $.get(geocodingUrl, {}, function(data) {
        console.log(data.status);
        if (data.status == "OK") {
            console.log(data.results[0].geometry.location.lat);
            storeLat = data.results[0].geometry.location.lat;
            storeLng = data.results[0].geometry.location.lng;
            updateStoreInfo();
        }
    });
}

function updateStoreInfo() {
    $.ajax({
        url : storeInfoUrl,
        type : 'PUT',
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
        data : {
            storeId : storage['storeId'],
            storeName : $('#storeName').val(),
            storeAddress : $('#storeAddress').val(),
            storeLatitude : parseFloat(storeLat),
            storeLongitude : parseFloat(storeLng),
            storePhone : $('#storePhone').val(),
            storeEmail : $('#storeEmail').val(),
            storeOpenHour : $('#storeOpenHour').val(),
            storeIntro : $('#storeIntro').val(),
            storeOperateType : $('.ui.dropdown').dropdown('get value')
        },
        success : function(data) {
            if (data.status == 200) {
                alert('success');
                storage.removeItem('storeInfo');
                storage['storeInfo'] = data.storePayload;
                showStoreInfo();
            } else {
                alert('failed');
                showStoreInfo();
            }
        }
    });
}