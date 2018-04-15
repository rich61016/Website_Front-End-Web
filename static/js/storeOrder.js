var apiUrl = "http://localhost:8080/";
var websiteUrl = "http://localhost:9000";

var storage = sessionStorage;
var UID = storage['auth'];
var authUrl = apiUrl + "member/auth/";
var getOrdersUrl = apiUrl + "store/order/";
var confirmOrderUrl = apiUrl + "store/order/confirm";
var finishOrderUrl = apiUrl + "store/order/finish";
var blackListUrl = apiUrl + "store/order/blackList";
var loginUrl = websiteUrl + "/auth/login.html";
var landingUrl = websiteUrl + "/store/landing.html";
var storeHomeUrl = websiteUrl + "/store/home.html";
var noOrderDiv = "<div class='text-white'>無訂單</div>";

$(document).ready(function() {
    checkLoginStatus();
    setOrders();

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
        storage.clear();
        window.location.assign(loginUrl);
    }
}

function setOrders() {
    if (storage['storeId']) {
        $.get(getOrdersUrl + storage['storeId'], {}, function(data) {
            if (data.status == 200) {
                storage['orderPayload'] = data.orderPayload;
                splitPayload();
                showOrders();
            }
        })
    } else {
        window.location.assign(landingUrl);
    }
}

function splitPayload() {
    if (storage['orderPayload'] != "null") {
        var orderPayload = jQuery.parseJSON(storage['orderPayload']);
        storage['orderedOrders'] = JSON.stringify(orderPayload.ordered);
        storage['unfinishedOrders'] = JSON.stringify(orderPayload.unfinished);
        storage['finishedOrders'] = JSON.stringify(orderPayload.finished);
    }
}

function showOrders() {
    showOrderedOrder();
    setConfirmOrderButtonClickEventListener();
    showUnfinishedOrder();
    setFinishOrderButtonClickEventListener();
    showFinishedOrder();
    setBlackListButtonClickEventListener();
}

function showOrderedOrder() {
    var orderedOrderStackableDiv = $('div.ui.tab[data-tab="ordered"] > div.ui.stackable.grid');
    removeChildrenOfDiv(orderedOrderStackableDiv);
    var orderedOrders = jQuery.parseJSON(storage['orderedOrders'])[0].ordered_orders;
    if (orderedOrders.length > 0) {
        for (var key = 0; key < orderedOrders.length; key++) {
            var orderedOrder = orderedOrders[key];
            var orderNote = orderedOrder.orderNote;
            if (orderNote == null) {
                orderNote = "";
            }
            var orderedOrderRowDiv =
                "<div class='row orderRow' data-order='" + orderedOrder.orderId + "'>" +
                    "<div class='four wide center aligned column'>" + 
                        "<div class='row'>" +
                            "<p class='ui horizontal bulleted list'>" +
                                "<span class='item text-white'>" + orderedOrder.orderUserName + "</span>" +
                                "<span class='item text-white'>" + new Date(orderedOrder.orderTime).toLocaleDateString() + "</span>" +
                            "</p>" +
                        "</div>" +
                        "<div class='row'>" +
                            "<span class='text-warning'>" + orderedOrder.orderUserCellphone + "</span>" +
                        "</div>" +
                        "<div class='row'>" +
                            "<span class='text-warning'>" + orderNote + "</span>" +
                        "</div>" +
                    "</div>" + 
                    "<div class='eight wide column orderDetail' data-order='" + orderedOrder.orderId + "'>" + 
                    "</div>" + 
                    "<div class='four wide center aligned column'>" + 
                        "<button class='large ui button warning confirmOrderButton' data-order='" + orderedOrder.orderId + "'>確認接單</button>" +
                    "</div>" + 
                "</div>";
            orderedOrderStackableDiv.append(orderedOrderRowDiv);
            for (var detailKey = 0; detailKey < orderedOrder.orderDetails.length; detailKey++) {
                var orderedOrderDetail = orderedOrder.orderDetails[detailKey];
                var orderedOrderDetailRowDiv = 
                    "<div class='row'>" +
                        "<div class='ui horizontal bulleted list'>" +
                            "<span class='item text-white'>" + orderedOrderDetail.foodName + "</span>" +
                            "<span class='item text-white'>" + orderedOrderDetail.orderQuantity + "</span>" +
                            "<span class='item text-warning'>NT&dollar;" + orderedOrderDetail.foodPrice + "</span>" +
                        "</div>" +
                    "</div>";
                $('div.orderDetail[data-order="' + orderedOrder.orderId + '"]').append(orderedOrderDetailRowDiv);
            }
        }
    } else {
        orderedOrderStackableDiv.append(noOrderDiv);
    }
}

function setConfirmOrderButtonClickEventListener() {
    $('button.confirmOrderButton').click(function(e) {
        e.preventDefault();
        $.ajax({
            url : confirmOrderUrl,
            type : 'PUT',
            contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
            data : {
                orderId : $(this).attr('data-order')
            },
            success : function(data) {
                if (data.status == 200) {
                    storage.removeItem['orderPayload'];
                    storage.removeItem['orderedOrders'];
                    storage.removeItem['unfinishedOrders'];
                    storage.removeItem['finishedOrders']
                    storage['orderPayload'] = data.orderPayload;
                    splitPayload();
                    showOrders();
                }
            }
        });
    });
}

function showUnfinishedOrder() {
    var unfinishedOrderStackableDiv = $('div.ui.tab[data-tab="unfinished"] > div.ui.stackable.grid');
    removeChildrenOfDiv(unfinishedOrderStackableDiv);
    var unfinishedOrders = jQuery.parseJSON(storage['unfinishedOrders'])[0].unfinished_orders;
    var unconfirmedStoreOrders = jQuery.parseJSON(storage['unfinishedOrders'])[1].unconfirmed_store_orders;
    if (unfinishedOrders.length > 0) {
        for (var key = 0; key < unfinishedOrders.length; key++) {
            var unfinishedOrder = unfinishedOrders[key];
            var orderNote = unfinishedOrder.orderNote;
            if (orderNote == null) {
                orderNote = "";
            }
            var unfinishedOrderDiv = 
                "<div class='row orderRow' data-order='" + unfinishedOrder.orderId + "'>" +
                    "<div class='four wide center aligned column'>" +
                        "<div class='row'>" +
                            "<p class='ui horizontal bulleted list'>" +
                                "<span class='item text-white'>" + unfinishedOrder.orderUserName + "</span>" +
                                "<span class='item text-white'>" + new Date(unfinishedOrder.orderTime).toLocaleDateString() + "</span>" +
                            "</p>" +
                        "</div>" +
                        "<div class='row'>" +
                            "<span class='text-warning'>" + unfinishedOrder.orderUserCellphone + "</span>" +
                        "</div>" +
                        "<div class='row'>" +
                            "<span class='text-warning'>" + orderNote + "</span>" +
                        "</div>" +
                    "</div>" +
                    "<div class='eight wide column orderDetail' data-order='" + unfinishedOrder.orderId + "'>" +
                    "</div>" +
                    "<div class='four wide center aligned column'>" +
                        "<p class='text-white'>" + unfinishedOrder.orderConfirmUserName + "</p>" + 
                        "<button class='large ui button warning finishOrderButton' data-order='" + unfinishedOrder.orderId + "'>出貨完成</button>" +
                    "</div>" +
                "</div>";
            unfinishedOrderStackableDiv.append(unfinishedOrderDiv);
            for (var detailKey = 0; detailKey < unfinishedOrder.orderDetails.length; detailKey++) {
                var unfinishedOrderDetail = unfinishedOrder.orderDetails[detailKey];
                var unfinishedOrderDetailRowDiv = 
                    "<div class='row'>" +
                        "<div class='ui horizontal bulleted list'>" +
                            "<span class='item text-white'>" + unfinishedOrderDetail.foodName + "</span>" +
                            "<span class='item text-white'>" + unfinishedOrderDetail.orderQuantity + "</span>" +
                            "<span class='item text-warning'>NT&dollar;" + unfinishedOrderDetail.foodPrice + "</span>" +
                        "</div>" +
                    "</div>";
                $('div.orderDetail[data-order="' + unfinishedOrder.orderId + '"]').append(unfinishedOrderDetailRowDiv);
            }
        }
    } else if (unconfirmedStoreOrders.length > 0) {
        for (var key = 0; key < unconfirmedStoreOrders.length; key++) {
            var unconfirmedStoreOrder = unconfirmedStoreOrders[key];
            var orderNote = unconfirmedStoreOrder.orderNote;
            if (orderNote == null) {
                orderNote = "";
            }
            var unconfirmedStoreOrderDiv = 
                "<div class='row orderRow' data-order='" + unconfirmedStoreOrder.orderId + "'>" +
                    "<div class='four wide center aligned column'>" +
                        "<div class='row'>" +
                            "<p class='ui horizontal bulleted list'>" +
                                "<span class='item text-white'>" + unconfirmedStoreOrder.orderUserName + "</span>" +
                                "<span class='item text-white'>" + new Date(unconfirmedStoreOrder.orderTime).toLocaleDateString() + "</span>" +
                            "</p>" +
                        "</div>" +
                        "<div class='row'>" +
                            "<span class='text-warning'>" + unconfirmedStoreOrder.orderUserCellphone + "</span>" +
                        "</div>" +
                        "<div class='row'>" +
                            "<span class='text-warning'>" + orderNote + "</span>" +
                        "</div>" +
                    "</div>" +
                    "<div class='eight wide column orderDetail' data-order='" + unconfirmedStoreOrder.orderId + "'>" +
                    "</div>" +
                    "<div class='four wide center aligned column'>" +
                        "<p class='text-white'>" + unconfirmedStoreOrder.orderConfirmUserName + "</p>" + 
                        "<button class='large ui button warning finishOrderButton' data-order='" + unconfirmedStoreOrder.orderId + "'>出貨完成</button>" +
                    "</div>" +
                "</div>";
            unfinishedOrderStackableDiv.append(unconfirmedStoreOrderDiv);
            for (var detailKey = 0; detailKey < unconfirmedStoreOrder.orderDetails.length; detailKey++) {
                var unconfirmedStoreOrderDetail = unconfirmedStoreOrder.orderDetails[detailKey];
                var unconfirmedStoreOrderDetailRowDiv = 
                    "<div class='row'>" +
                        "<div class='ui horizontal bulleted list'>" +
                            "<span class='item text-white'>" + unconfirmedStoreOrderDetail.foodName + "</span>" +
                            "<span class='item text-white'>" + unconfirmedStoreOrderDetail.orderQuantity + "</span>" +
                            "<span class='item text-warning'>NT&dollar;" + unconfirmedStoreOrderDetail.foodPrice + "</span>" +
                        "</div>" +
                    "</div>";
                $('div.orderDetail[data-order="' + unconfirmedStoreOrder.orderId + '"]').append(unconfirmedStoreOrderDetailRowDiv);
            }
        }
    } else {
        unfinishedOrderStackableDiv.append(noOrderDiv);
    }
}

function setFinishOrderButtonClickEventListener() {
    $('button.finishOrderButton').click(function(e) {
        e.preventDefault();
        $.ajax({
            url : finishOrderUrl,
            type : 'PUT',
            contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
            data : {
                orderId : $(this).attr('data-order')
            },
            success : function(data) {
                if (data.status == 200) {
                    storage.removeItem['orderPayload'];
                    storage.removeItem['orderedOrders'];
                    storage.removeItem['unfinishedOrders'];
                    storage.removeItem['finishedOrders']
                    storage['orderPayload'] = data.orderPayload;
                    splitPayload();
                    showOrders();
                }
            }
        });
    });
}

function showFinishedOrder() {
    var finishedOrderStackableDiv = $('div.ui.tab[data-tab="finished"] > div.ui.stackable.grid');
    removeChildrenOfDiv(finishedOrderStackableDiv);
    var unconfirmedUserOrders = jQuery.parseJSON(storage['finishedOrders'])[0].unconfirmed_user_orders;
    var finishedOrders = jQuery.parseJSON(storage['finishedOrders'])[1].finished_orders;
    if (unconfirmedUserOrders.length > 0) {
        for (var key = 0; key < unconfirmedUserOrders.length; key++) {
            var unconfirmedUserOrder = unconfirmedUserOrders[key];
            var orderTime = new Date(unconfirmedUserOrder.orderTime).toLocaleDateString();
            var unconfirmedUserOrderDiv = 
                "<div class='row orderRow' data-order='" + unconfirmedUserOrder.orderId + "'>" +
                    "<div class='four wide center aligned column'>" + 
                        "<div class='row'>" +
                            "<p class='ui horizontal bulleted list'>" +
                                "<span class='item text-white'>" + unconfirmedUserOrder.orderUserName + "</span>" +
                                "<span class='item text-white'>" + orderTime + "</span>" +
                            "</p>" +
                        "</div>" +
                        "<div class='row'>" +
                            "<span class='text-warning'>" + unconfirmedUserOrder.orderUserCellphone + "</span>" +
                        "</div>" +
                    "</div>" + 
                    "<div class='eight wide column orderDetail' data-order='" + unconfirmedUserOrder.orderId + "'></div>" + 
                    "<div class='four wide center aligned column'>" + 
                        "<button class='large ui red button custom-font-thin blackListButton' data-order='" + unconfirmedUserOrder.orderId + "'>黑名單</button>" +
                    "</div>" + 
                "</div>";
            finishedOrderStackableDiv.append(unconfirmedUserOrderDiv);
            for (var detailKey = 0; detailKey < unconfirmedUserOrder.orderDetails.length; detailKey++) {
                var unconfirmedUserOrderDetail = unconfirmedUserOrder.orderDetails[detailKey];
                var unconfirmedUserOrderDetailRowDiv = 
                    "<div class='row'>" +
                        "<div class='ui horizontal bulleted list'>" +
                            "<span class='item text-white'>" + unconfirmedUserOrderDetail.foodName + "</span>" +
                            "<span class='item text-white'>" + unconfirmedUserOrderDetail.orderQuantity + "</span>" +
                            "<span class='item text-warning'>NT&dollar;" + unconfirmedUserOrderDetail.foodPrice + "</span>" +
                        "</div>" +
                    "</div>";
                $('div.orderDetail[data-order="' + unconfirmedUserOrder.orderId + '"]').append(unconfirmedUserOrderDetailRowDiv);
            }
        }
    } else if (finishedOrders.length > 0) {
        for (var key = 0; key < finishedOrders.length; key++) {
            var finishedOrder = finishedOrders[key];
            var orderTime = new Date(finishedOrder.orderTime).toLocaleDateString();
            var finishedOrderDiv = 
                "<div class='row orderRow' data-order='" + finishedOrder.orderId + "'>" +
                    "<div class='four wide center aligned column'>" + 
                        "<div class='row'>" +
                            "<p class='ui horizontal bulleted list'>" +
                                "<span class='item text-white'>" + finishedOrder.orderUserName + "</span>" +
                                "<span class='item text-white'>" + orderTime + "</span>" +
                            "</p>" +
                        "</div>" +
                        "<div class='row'>" +
                            "<span class='text-warning'>" + finishedOrder.orderUserCellphone + "</span>" +
                        "</div>" +
                    "</div>" + 
                    "<div class='eight wide column orderDetail' data-order='" + finishedOrder.orderId + "'></div>" + 
                    "<div class='four wide center aligned column'>" + 
                        "<button class='large ui red button custom-font-thin blackListButton' data-order='" + finishedOrder.orderId + "'>黑名單</button>" +
                    "</div>" + 
                "</div>";
            finishedOrderStackableDiv.append(finishedOrderDiv);
            for (var detailKey = 0; detailKey < finishedOrder.orderDetails.length; detailKey++) {
                var finishedOrderDetail = finishedOrder.orderDetails[detailKey];
                var finishedOrderDetailRowDiv = 
                    "<div class='row'>" +
                        "<div class='ui horizontal bulleted list'>" +
                            "<span class='item text-white'>" + finishedOrderDetail.foodName + "</span>" +
                            "<span class='item text-white'>" + finishedOrderDetail.orderQuantity + "</span>" +
                            "<span class='item text-warning'>NT&dollar;" + finishedOrderDetail.foodPrice + "</span>" +
                        "</div>" +
                    "</div>";
                $('div.orderDetail[data-order="' + finishedOrder.orderId + '"]').append(finishedOrderDetailRowDiv);
            }
        }
    } else {
        finishedOrderStackableDiv.append(noOrderDiv);
    }
}

function setBlackListButtonClickEventListener() {
    $('button.blackListButton').click(function(e) {
        e.preventDefault();
        $.ajax({
            url : blackListUrl,
            type : 'PUT',
            contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
            data : {
                orderId : $(this).attr('data-order')
            },
            success : function(data) {
                if (data.status == 200) {
                    storage.removeItem['orderPayload'];
                    storage.removeItem['orderedOrders'];
                    storage.removeItem['unfinishedOrders'];
                    storage.removeItem['finishedOrders']
                    storage['orderPayload'] = data.orderPayload;
                    splitPayload();
                    showOrders();
                }
            }
        });
    });
}

function removeChildrenOfDiv(parentDiv) {
    if (parentDiv.children().length > 0) {
        while (parentDiv.children().length >= 1) {
            parentDiv.children().remove();
        }
    }
}

function setPeriodText(period) {
    switch (period) {
        case "A":
        return "0000-0100";
        break;
        case "B":
        return "0100-0200";
        break;
        case "C":
        return "0200-0300";
        break;
        case "D":
        return "0300-0400";
        break;
        case "E":
        return "0400-0500";
        break;
        case "F":
        return "0500-0600";
        break;
        case "G":
        return "0600-0700";
        break;
        case "H":
        return "0700-0800";
        break;
        case "I":
        return "0800-0900";
        break;
        case "J":
        return "0900-1000";
        break;
        case "K":
        return "1000-1100";
        break;
        case "L":
        return "1100-1200";
        break;
        case "M":
        return "1200-1300";
        break;
        case "N":
        return "1300-1400";
        break;
        case "O":
        return "1400-1500";
        break;
        case "P":
        return "1500-1600";
        break;
        case "Q":
        return "1600-1700";
        break;
        case "R":
        return "1700-1800"
        break;
        case "S":
        return "1800-1900";
        break;
        case "T":
        return "1900-2000";
        break;
        case "U":
        return "2000-2100";
        break;
        case "V":
        return "2100-2200";
        break;
        case "W":
        return "2200-2300";
        break;
        case "X":
        return "2300-0000";
        break;
        default:
        return "";
        break;
    }
}

function setStoreHomeButtonClickEventListener() {
    $('#storeHomeButton').click(function(e) {
        e.preventDefault();
        storage.removeItem('orderedOrders');
        storage.removeItem('unfinishedOrders');
        storage.removeItem('finishedOrders');
        window.location.assign(storeHomeUrl);
    });
}