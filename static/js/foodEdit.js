var apiUrl = "http://localhost:8080/";
var websiteUrl = "http://localhost:9000";

var storage = sessionStorage;
var UID = storage['auth'];
var authUrl = apiUrl + "member/auth/"
var foodInfoUrl = apiUrl + "store/menu/food/";
var editFoodUrl = apiUrl + "store/menu/food/"
var loginUrl = websiteUrl + "/auth/login.html";
var storeHomeUrl = websiteUrl + "/store/home.html";

$(document).ready(function() {
    checkLoginStatus();
    setFoodInfo();
    setSubmitButtonClickEventListener();
    setStoreHomeButtonClickEventListener();
});

function checkLoginStatus() {
    if (UID) {
        $.get(authUrl + UID, {}, function(data) {
            if (data.status != 200) {
                storage.clear();
                window.location.assign(loginUrl);
            }
        });
    } else {
        window.location.assign(loginUrl);
    }
}

function setFoodInfo() {
    $.get(foodInfoUrl + storage['foodId'], {}, function(data) {
        if (data.status == 200) {
            storage['foodPayload'] = data.foodPayload;
            console.log(storage['foodPayload']);
            displayFoodInfo();
        }
    });
}

function displayFoodInfo() {
    var food = jQuery.parseJSON(storage['foodPayload']);
    $('#foodName').val(food.foodName);
    $('#foodPrice').val(food.foodPrice);
    $('#foodLimit').val(food.foodLimit);
    $('.ui.dropdown').dropdown('set selected', food.foodType);
    $('#foodIntro').val(food.foodIntro);
}

function setSubmitButtonClickEventListener() {
    
    var submitType;
    if (storage['foodId']) {
        submitType = 'PUT';
    } else {
        editFoodUrl += storage['storeId'];
        submitType = 'POST';
    }
    $('#submitButton').click(function () {
        $.ajax({
            url : editFoodUrl,
            type : submitType,
            contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
            data : {
                foodId : storage['foodId'],
                foodName : $('#foodName').val(),
                foodPrice : $('#foodPrice').val(),
                foodLimit : $('#foodLimit').val(),
                foodType : $('.ui.dropdown').dropdown('get value'),
                foodIntro : $('#foodIntro').val()
            },
            success : function(data) {
                if (data.status == 200) {
                    console.log('successfully edited');
                    storage.removeItem('foodPayload');
                    storage['foodPayload'] = data.foodPayload;
                    displayFoodInfo()
                } else {
                    alert('failed');
                }
            }
        });
    });
}

function setStoreHomeButtonClickEventListener() {
    $('#storeHomeButton').click(function(e) {
        e.preventDefault();
        storage.removeItem('foodId');
        storage.removeItem('foodPayload');
        window.location.assign(storeHomeUrl);
    });
}