
//defininig the openCart function
function openCart() {
    document.getElementById("cart").className = "cart";
}

//defining closeCart function
function closeCart() {
    document.getElementById("cart").className = "cart-closed";
}

//defining showRedeem function
function showCoupon() {
    document.getElementById("coupon-redeem").className = "coupon-redeem";
    document.getElementById("coupon-ask").className = "cart__footer__coupon-ask-closed";
}


let current = 'vegetables'; //just giving it the first id to avoid 404
//defining openSubMenu functions
function openSubMenu(id) {

    console.log(`Now Current: ${current}`);

    //closing the currentActive Submenu
    document.getElementById(`${current}-sub`).className = "side-nav__sub-closed";
    document.getElementById(current).className = "side-nav__main";

    //opening the clicked submenu
    document.getElementById(`${id}-sub`).className = "side-nav__sub";
    document.getElementById(id).className = "side-nav__main-open";

    current = id;
    console.log(current);
}



//defining shamimBhaiSayHi
function shamimBhaiSayHi() {
    console.log('Hello From Shamim Bhai');
}


//defining sidebar trigger for desktop
let count = 0;
function sidebarTriggerDesktop() {

     console.log('Desktop Toogle Triggered');

    if(count % 2 == 0) {
        document.getElementById("sidebar").className = "sidebar-off";
        document.getElementById("main-contents").className = "main-contents-off";
    } else {
        document.getElementById("sidebar").className = "sidebar";
        document.getElementById("main-contents").className = "main-contents";
    }

    count++;
}



//defining sidebar trigger for mobile
let countMobile = 0;
function sidebarTriggerMobile() {

     console.log('Mobile Toogle Triggered');

    if(countMobile % 2 == 0) {
        document.getElementById("sidebar").className = "sidebar-mobile";
        //document.getElementById("main-contents").className = "main-contents-off";
    } else {
        document.getElementById("sidebar").className = "sidebar";
        //document.getElementById("main-contents").className = "main-contents";
    }

    countMobile++;
}


//defining openMobileSearch
function openMobileSearch() {
    console.log('openMobileSearch Triggered');
    
    document.getElementById("search-mobile").className = "search-mobile";
}


//defining closeMobileSearch
function closeMobileSearch() {
    console.log('closeMobileSearch Triggered');

    document.getElementById("search-mobile").className = "search-mobile-closed";
}