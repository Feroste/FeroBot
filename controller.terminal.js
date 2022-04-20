module.exports = 
{
    run: function(room)
    {
            //----------//  EXECUTE DEALS  //----------//

        if (room.terminal && (Game.time % 200 == 0)) 
        {
            // PROTECTION MONEY
            if(room.terminal.store[RESOURCE_LEMERGIUM] >= 1000)
            {
                room.terminal.send(RESOURCE_LEMERGIUM, room.terminal.store[RESOURCE_LEMERGIUM], 'W38S51', 'Protection Money');
                console.log('Resources sent');
            }
        }

        else if (room.terminal && Game.time % 20 == 0)
        {
            // BUY EXCESS ENERGY IN BATCHES
            if (room.storage.store[RESOURCE_ENERGY] < 50000 && room.terminal.store[RESOURCE_ENERGY] < 150000)
            {
                let orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_ENERGY &&
                                                    order.type == ORDER_SELL &&
                                                    Game.market.calcTransactionCost(5000, room.name, order.roomName) < 2500);
                console.log('--------------------------');
                console.log('Energy SELL orders found: ' + orders.length);
                if (orders.length)
                {
                    orders.sort(function(a,b){return b.price - a.price});
                    console.log('Best price: ' + orders[0].price);
                    if (orders[0].price < 5)
                    {
                        let result = Game.market.deal(orders[0].id, 5000, room.name);
                        if (result == 0)
                        {
                            console.log('Order completed successfully');
                        }
                    }
                }
                console.log('--------------------------');
            }
            // SELL EXCESS ENERGY IN BATCHES
            else if (room.storage.store[RESOURCE_ENERGY] > 500000 && room.terminal.store[RESOURCE_ENERGY] > 50000)
            {
                let orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_ENERGY &&
                                                    order.type == ORDER_BUY &&
                                                    Game.market.calcTransactionCost(5000, room.name, order.roomName) < 2500);
                console.log('--------------------------');
                console.log('Energy BUY orders found: ' + orders.length);
                if (orders.length)
                {
                    orders.sort(function(a,b){return b.price - a.price});
                    console.log('Best price: ' + orders[0].price);
                    if (orders[0].price > 3)
                    {
                        let result = Game.market.deal(orders[0].id, 5000, room.name);
                        if (result == 0)
                        {
                            console.log('Order completed successfully');
                        }
                    }
                }
                console.log('--------------------------');
            }

            // SELL EXCESS KEANIUM IN BATCHES
            else if (room.terminal.store[RESOURCE_KEANIUM] > 10000 && room.terminal.store[RESOURCE_ENERGY] > 25000)
            {
                let orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_KEANIUM &&
                    order.type == ORDER_BUY &&
                    Game.market.calcTransactionCost(5000, room.name, order.roomName) < 5000);
                console.log('--------------------------');
                console.log('Keanium buy orders found: ' + orders.length);
                if(orders.length)
                {
                    orders.sort(function(a,b){return b.price - a.price});
                    console.log('Best price: ' + orders[0].price);
                    if (orders[0].price > 0.19)
                    {
                        let result = Game.market.deal(orders[0].id, 5000, room.name);
                        if (result == 0)
                        {
                            console.log('Order completed successfully');
                        }
                    }
                }
                console.log('--------------------------');
            }
        }
    }
};