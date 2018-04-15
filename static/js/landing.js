var apiUrl = "http://localhost:8080/";
var websiteUrl = "http://localhost:9000";

var storage = sessionStorage;
var UID = storage['auth'];
var logoutUrl = apiUrl + "member/auth";
var storeAuthUrl = apiUrl + "store/landing/"
var loginUrl = websiteUrl + "/auth/login.html";
var indexUrl = websiteUrl + "/index.html";
var storeHomeUrl = websiteUrl + "/store/home.html";
var navbar = $('.ui.secondary.stackable.menu');
var loggedInDiv = 
    '<div class="mobile-item custom-mobile-hide right menu" hidden>' + 
        '<div class="ui dropdown item">' + 
            '<div id="userImgDiv" class="text">' + 
                '<img id="userImg" class="ui avatar image">' +
            '</div>' + 
            '<i class="dropdown icon text-white"></i>' + 
            '<div class="menu">' + 
                '<a id="logoutButton" class="item custom-font-thin">登出</a>' + 
            '</div>' + 
        '</div>' + 
    '</div>';
var defaultAvatar = "/static/images/defaultAvatar.png";
var navbarMenuIcon = $('.ui.toggle.icon');
var navbarMenuItem = $('.mobile-item');
var mainContainer = $('.ui.main.container');
var storeDivider = '<div class="ui divider"></div>';
var storeListDiv = $('#storeListDiv');

$(document).ready(function() {
    clearStoreId();
    checkLoginStatus();
    setCollapsableNavbarMenu();
    setStoresDiv();
    
});

function clearStoreId() {
    storage.removeItem('storeId');
}

function checkLoginStatus() {
    if (UID) {
        createLoggedInSection();
    } else {
        window.location.assign(loginUrl);
    }
}

function createLoggedInSection() {
    navbar.append(loggedInDiv);
    setLoggedInDivInfo();
    setLogoutButtonClickEventListener();
}

function setLoggedInDivInfo() {
    var userImg = $('#userImg');
    userImg.attr('alt', storage['userName']);
    if (storage['userAvatar'] == 'null') {
        userImg.attr('src', defaultAvatar);
    } else {
        userImg.attr('src', storage['userAvatar']);
    }
    var userNameSpan = "<span class='text-warning'> " + storage['userName'] + "</span>";
    var userImgDiv = $('#userImgDiv');
    userImgDiv.append(userNameSpan);
}

function setLogoutButtonClickEventListener() {
    var logoutButton = $('#logoutButton');
    logoutButton.click(function() {
        $.ajax({
            url : logoutUrl + "/" + UID,
            type : 'DELETE',
            contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
            success : function(data) {
                if (data.status == 200) {
                    storage.clear();
                    window.location.assign(indexUrl);
                } else {
                    alert('logout unsuccessful');
                    return false;
                }
            }
        });
    });
}

function setCollapsableNavbarMenu() {
    navbarMenuIcon.click(function () {
        navbarMenuItem.toggleClass('custom-mobile-hide');
        navbarMenuIcon.toggleClass('custom-collapse-navbar-button-top');
        if (mainContainer.css('padding-top') == '120px') {
            mainContainer.attr('style', 'padding-top: 296px !important');
        } else {
            mainContainer.attr('style', 'padding-top: 120px !important');
        }
    });
}

function setStoresDiv() {
    $.get(storeAuthUrl + storage['userId'], {}, function(data) {
        if (data.status == 200) {
            storage['landing'] = data.landing;
            extractPayloadToStoresDiv();
            setStoreLinkClickEventListener();
        }
    {}})
}

function extractPayloadToStoresDiv() {
    var stores = storage['landing']; // 字串
    var temp = jQuery.parseJSON(stores); // 陣列物件
    var index = 1;
    for (var key = 0; key < temp.length; key++) {
        var store = temp[key]; // 陣列元素物件
        if (index == 1) {
            setSingleStore(store);
        } else {
            storeListDiv.append(storeDivider);
            setSingleStore(store);
        }
        index++;
    }
}

function setSingleStore(storeInfo) {
    var storeName = storeInfo['storeName'];
    var storeLogo;
    if (storeInfo.storeLogo == 'defaultStore.png') {
        storeLogo = "/static/images/defaultStore.png";
    } else {
        storeLogo = "/static/images/" + storeInfo.storeLogo;
    }
    var storeId = storeInfo['storeId'];
    var singleStoreDiv =
        '<a class="item" data-storeName="' + storeName + '" data-store="' + storeId + '" href="/store/home.html">' +
            '<div bordered rounded class="ui tiny circular image" data-store="' + storeId + '">' +
                '<img src="' + storeLogo + '" data-store="' + storeId + '">' +
            '</div>' +
            '<div class="middle aligned content" data-store="' + storeId + '">' +
                '<p class="header text-warning" data-store="' + storeId + '">' + storeName + '</p>'+
            '</div>' +
        '</a>';
    storeListDiv.append(singleStoreDiv);
}

function setStoreLinkClickEventListener() {
    $('a.item').click(function(e) {
        alert('clicked');
        e.preventDefault();
        storage['storeId'] = $(this).attr('data-store');
        storage['storeName'] = $(this).attr('data-storeName');
        storage.removeItem('landing');
        alert($(this).attr('data-store'));
        window.location.assign(storeHomeUrl);
        return false;
    });
}