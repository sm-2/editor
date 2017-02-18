(function () {
'use script';

angular.module('ShoppingListCheckOff',[])
.controller('ToBuyController',ToBuyController)
.controller('AlreadyBougthController',AlreadyBougthController)
.service('ShoppingListCheckOffService',ShoppingListCheckOffService);

ToBuyController.$inject = ['ShoppingListCheckOffService'];
function ToBuyController(ShoppingListCheckOffService){
  var toBuy = this;

  toBuy.itemsToBuy = ShoppingListCheckOffService.getToBuyItems();

  toBuy.buyItems = function (itemIndex) {
    ShoppingListCheckOffService.buyItems(itemIndex);
  };

}

AlreadyBougthController.$inject=['ShoppingListCheckOffService'];
function AlreadyBougthController(ShoppingListCheckOffService){
  var alreadyBougth = this;

  alreadyBougth.itemsBougth = ShoppingListCheckOffService.getAlreadyBougthItems();

}

function ShoppingListCheckOffService() {
  var service = this;

  var toBuy =[{ name: "cookies", quantity: 10 },{ name: "tomatoes", quantity: 6 },
      { name: "potatoes", quantity: 5 },{ name: "chips", quantity: 1 },
      { name: "fish", quantity: 2 },{ name: "carrot", quantity: 2 }];

  var alreadyBougth = [];

  service.getToBuyItems = function () {
    return toBuy;
  };

  service.getAlreadyBougthItems = function (){
    return alreadyBougth;
  };

  service.buyItems = function (itemIndex) {
    var item = toBuy.splice(itemIndex,1);
    alreadyBougth.push(item[0]);
  };

}

})();
