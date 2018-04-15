$(document).ready(function () {
    initializeTabDivs();
    initializeDropdown();
    initializeZipcodeDropdown();
});

// Semantic UI Tabs Initialize
function initializeTabDivs() {
    var tabDivs = $('.tabular.menu .item');
    if (tabDivs.length > 0) {
        tabDivs.tab();
    }
}

// Semantic UI Dropdown Initialize
function initializeDropdown() {
    var dropdown = $('.ui.dropdown');
    if (dropdown.length > 0) {
        dropdown.dropdown();
    }
}

// TWZipcode Initialize
function initializeZipcodeDropdown() {
    var zipcodeDiv = $('#twzipcode');
    if (zipcodeDiv.length > 0) {
        zipcodeDiv.twzipcode({
            countySel: "臺北市", // 城市預設值, 字串一定要用繁體的 "臺", 否則抓不到資料
            districtSel: "大安區", // 地區預設值
            zipcodeIntoDistrict: true, // 郵遞區號自動顯示在地區
            css: ["city menu field", "menu field"], // 自訂 "城市"、"地區" class 名稱 
            countyName: "storeCity", // 自訂城市 select 標籤的 name 值
            districtName: "storeArea", // 自訂地區 select 標籤的 name 值
            zipcodeName: "zipcode"
        });
    }
}