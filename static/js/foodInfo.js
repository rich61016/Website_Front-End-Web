var apiUrl = "http://localhost:8080/";
var websiteUrl = "http://localhost:9000";

var storage = sessionStorage;
var UID = storage['auth'];
var storeId = storage['storeId'];
var menuUrl = apiUrl + "store/menu/";
var loginUrl = websiteUrl + "/auth/login.html";
var landingUrl = websiteUrl + "/store/landing.html"
var editFoodUrl = websiteUrl + "/store/menu/edit.html";
var menuListDiv = $('#menuListDiv');
var menuDivider = "<div class='ui divider'></div>";

$(document).ready(function() {
    checkLoginStatus();
    setMenu();
});

function checkLoginStatus() {
    if (!UID) {
        window.location.assign(loginUrl);
    }
}

function setMenu() {
    if (!storeId) {
        window.location.assign(landingUrl);
    } else {
        getMenuInfoAndDisplay();
    }
}

function getMenuInfoAndDisplay() {
    $.get(menuUrl + storeId, {}, function(data) {
        if (data.status == 200) {
            console.log(data.menuPayload);
            storage['menuPayload'] = data.menuPayload;
            displayMenu();
            setEditFoodButtonClickEventListener();
        }
    });
}

function displayMenu() {
    var menus = jQuery.parseJSON(storage['menuPayload']);
    var menuIndex = 1;
    for (var key = 0; key < menus.length; key++) {
        var menu = menus[key];
        if (menuIndex == 1) {
            setSingleMenu(menu);
        } else {
            menuListDiv.append(menuDivider);
            setSingleMenu(menu);
        }
    }
}

function setSingleMenu(menuInfo) {
    var foodPic;
    if (menuInfo.foodPicMdpi == null) {
        foodPic = "/static/images/5-1.png";
    } else {
        foodPic = "/static/images/" + menuInfo.foodPicMdpi;
    }
    var foodIntro;
    if (menuInfo.foodIntro == null) {
        foodIntro = '';
    } else {
        foodIntro = menuInfo.foodIntro;
    }
    var singleMenuDiv = 
    '<div class="row">' +
        '<div class="four wide column">' +
            '<img class="ui small rounded centered image" src="' + foodPic + '">' +
        '</div>' +
        '<div class="one column"></div>' +
        '<div class="seven wide column">' +
            '<div class="ui columns">' +
                '<div class="column">' +
                    '<div class="ui horizontal divided relaxed big list">' +
                        '<span class="item text-white">' + menuInfo.foodName + '</span>' +
                        '<span class="item text-warning">NT&dollar;' + menuInfo.foodPrice + '</span>' +
                        '<span class="item text-warning">單日' + menuInfo.foodLimit + '份</span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="ui divider"></div>' +
            '<div class="column">' +
                '<p class="text-warning">' + foodIntro + '</p>' +
            '</div>' +
        '</div>' +
        '<div class="four wide center aligned column">' +
            '<a data-foodId=' + menuInfo.foodId + ' class="large ui button warning custom-font-thin editButton">編輯</a>' +
            '<button data-foodId=' + menuInfo.foodId + ' class="large ui red button custom-font-thin">下架</button>' +
        '</div>' +
    '</div>';
    menuListDiv.append(singleMenuDiv);
}

function setEditFoodButtonClickEventListener() {
    $('a.editButton').click(function(e) {
        alert('click');
        e.preventDefault();
        storage['foodId'] = $(this).attr('data-foodId');
        storage.removeItem('menuPayload');
        window.location.assign(editFoodUrl);
        return false;
    })
}