module.exports = 
{
    run: function(room)
    {
            //----------//  EXECUTE DEALS  //----------//
        if (room.terminal && (Game.time % 200 == 0)) 
        {
            // PROTECTION MONEY
            if(room.terminal && room.terminal.store[RESOURCE_LEMERGIUM] >= 1000)
            {
                Game.rooms['W37S48'].terminal.send(RESOURCE_LEMERGIUM, room.terminal.store[RESOURCE_LEMERGIUM], 'W38S51', 'Protection Money');
                console.log('Resources sent');
            }

            else if (room.terminal.store[RESOURCE_ENERGY] > 25000)
            {
                let orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_ENERGY &&
                                                    order.type == ORDER_BUY &&
                                                    Game.market.calcTransactionCost(1000, room.name, order.roomName) < 750);
                console.log('--------------------------');
                console.log('Energy buy orders found: ' + orders.length);
                orders.sort(function(a,b){return b.price - a.price});
                console.log('Best price: ' + orders[0].price);
                if (orders[0].price > 0.19)
                {
                    let result = Game.market.deal(orders[0].id, 1000, room.name);
                    if (result == 0)
                    {
                        console.log('Order completed successfully');
                    }
                }
                console.log('--------------------------');
            }
        }
    }
};