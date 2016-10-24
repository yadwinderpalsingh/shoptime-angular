
function shoppingCart(cartName) {
    this.cartName = cartName;
    this.clearCart = false;
    this.clearUser = false;
    this.items = [];
    this.user = { province: 'ON'};
    // load items from local storage when initializing
    
    this.clearUserInfo();
    this.loadItems();
    this.loadUser();

    // save items to local storage when unloading
    var self = this;
    
    $(window).unload(function () {
        if (self.clearCart) {
            self.clearItems();
            self.clearUser();
        }
        self.saveItems();
        self.clearCart = false;
        this.clearUser = false;
    });
}

// load items from local storage
shoppingCart.prototype.loadItems = function () {
    var items = localStorage != null ? localStorage[this.cartName + "_items"] : null;
    if (items != null && JSON != null) {
        try {
            var items = JSON.parse(items);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.sku != null && item.name != null && item.image != null && item.price != null && item.quantity != null) {
                    item = new cartItem(item.sku, item.name, item.image, item.price, item.quantity);
                    this.items.push(item);
                }
            }
        }
        catch (err) {
            
        }
    }
}

// load User from local storage
shoppingCart.prototype.loadUser = function () {
    var user = localStorage != null ? localStorage[this.cartName + "_user"] : null;
    if (user != null && user != "undefined") {
        this.user = user;
    }
    else{
        this.user = { province: 'ON'};
    }
}

// save items to local storage
shoppingCart.prototype.saveItems = function () {
    if (localStorage != null && JSON != null) {
        localStorage[this.cartName + "_items"] = JSON.stringify(this.items);
    }
}

// save user to local storage
shoppingCart.prototype.saveUser = function (user) {
    if (localStorage != null && JSON != null) {
        localStorage[this.cartName + "_user"] = user;
    }
}

// adds an item to the cart
shoppingCart.prototype.addItem = function (sku, name, image, price, quantity) {
    quantity = this.toNumber(quantity);
    if (quantity != 0) {

        // update quantity for existing item
        var found = false;
        for (var i = 0; i < this.items.length && !found; i++) {
            var item = this.items[i];
            if (item.sku == sku) {
                found = true;
                item.quantity = this.toNumber(item.quantity + quantity);
                if (item.quantity <= 0) {
                    this.items.splice(i, 1);
                }
            }
        }

        // new item, add now
        if (!found) {
            var item = new cartItem(sku, name, image, price, quantity);
            this.items.push(item);
        }

        // save changes
        this.saveItems();
    }
}

//get tax 
shoppingCart.prototype.getTax = function(){
    var tax = 0;
    var province = this.user.province;
    var subTotal = this.getSubTotalPrice();
    if (province == 'AB') {
        tax = (subTotal * 0.05).toFixed(2);
    }
    else if (province == 'BC') {
        tax = (subTotal * 0.05).toFixed(2);
    }
    else if (province == 'MB') {
        tax = (subTotal * 0.05).toFixed(2);
    }
    else if (province == 'NB') {
        tax = (subTotal * 0.13).toFixed(2);
    }
    else if (province == 'NL') {
        tax = (subTotal * 0.13).toFixed(2);
    }
    else if (province == 'NS') {
        tax = (subTotal * 0.15).toFixed(2);
    }
    else if (province == 'ON') {
        tax = (subTotal * 0.13).toFixed(2);
    }
    else if (province == 'PE') {
        tax = (subTotal * 0.14).toFixed(2);
    }
    else if (province == 'QB') {
        tax = (subTotal * 0.05).toFixed(2);
    }
    else if (province == 'SK') {
        tax = (subTotal * 0.05).toFixed(2);
    }
    else if (province == 'YK') {
        tax = (subTotal * 0.05).toFixed(2);
    }
            
    return tax;
}


// get shipping charges
shoppingCart.prototype.getShippingCharges = function(){
    var shipping = 0;
    var subTotal = this.getSubTotalPrice();
            
    if (subTotal > 0 && subTotal < 25) {
        shipping = 3.00;
    }
    else if (subTotal > 25.01 && subTotal < 50) {
        shipping = 4.00;
    }
    else if (subTotal > 50.01 && subTotal < 75) {
        shipping = 5.00;
    }
    else if (subTotal > 75) {
        shipping = 6.00;
    }
    return shipping;
}

// get expected delivery date
shoppingCart.prototype.getExpectedDeliveryDate = function(){
   
    var deliveryDay = 0;
    var subTotal = this.getSubTotalPrice();
    if (subTotal > 0 && subTotal < 25) {
        deliveryDay = 1;
    }
    else if (subTotal > 25.01 && subTotal < 50) {
        deliveryDay = 3;
    }
    else if (subTotal > 50.01 && subTotal < 75) {
        deliveryDay = 1;
    }
    else if (subTotal > 75) {
        deliveryDay = 4;
    }
    
    var date = new Date();
            
    date.setDate(date.getDate() + deliveryDay);
    
    return date;
}

// get the sub total price for all items currently in the cart
shoppingCart.prototype.getSubTotalPrice = function (sku) {
    var total = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (sku == null || item.sku == sku) {
            total += this.toNumber(item.quantity * item.price);
        }
    }
    return total;
}

// get the total price for all items currently in the cart
shoppingCart.prototype.getTotalPrice = function (sku) {
    return parseFloat(this.getSubTotalPrice()) + parseFloat(this.getTax()) + parseFloat(this.getShippingCharges());
}

// get the total count for all items currently in the cart
shoppingCart.prototype.getTotalCount = function (sku) {
    var count = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (sku == null || item.sku == sku) {
            count += this.toNumber(item.quantity);
        }
    }
    return count;
}

// clear the cart
shoppingCart.prototype.clearItems = function () {
    this.items = [];
    this.saveItems();
}

// clear the user
shoppingCart.prototype.clearUserInfo = function () {
    this.user = { province: 'ON'};
    this.saveUser();
}

// clear reset the shop
shoppingCart.prototype.resetShop = function () {
    this.clearItems();
    this.clearUserInfo();
    window.location.href = 'index.html#/home';
}


shoppingCart.prototype.toNumber = function (value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
}

function cartItem(sku, name, image, price, quantity) {
    this.sku = sku;
    this.name = name;
    this.image = image;
    this.price = price * 1;
    this.quantity = quantity * 1;
}

