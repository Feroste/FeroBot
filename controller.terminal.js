const memoryManager = require("./memory.manager");

module.exports = 
{
    run: function(room)
    {
        let terminal = room.terminal;
        let orders = {};

        // Execute on deals and send resources every 25 ticks
        if (room.terminal && Game.time % 25 === 0)
        {
            switch(true)
            {
                // Exit if Terminal is Empty or on Cooldown
                case (terminal.store.getUsedCapacity() === 0 || terminal.cooldown > 0):
                    break;
            
                // Send Protection Money
                case (terminal.store[RESOURCE_LEMERGIUM] >= 1000):
                    terminal.send(RESOURCE_LEMERGIUM, terminal.store[RESOURCE_LEMERGIUM], 'W38S51', 'Protection Money');
                    if(Memory.Interface.Visualizations.Logs)
                    {console.log('!!!Resources sent!!!');}
                    break;

                // Buy Energy in Batches
                case (room.storage.store[RESOURCE_ENERGY] < 50000 && terminal.store[RESOURCE_ENERGY] < 150000):
                    orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_ENERGY &&
                        order.type == ORDER_SELL &&
                        Game.market.calcTransactionCost(5000, room.name, order.roomName) < 2500);

                    var price = 5
                    if (orders.length)
                    {
                        orders.sort(function(a,b){return b.price - a.price});

                        if (Memory.Interface.Visualizations.Logs)
                        {
                            console.log('--------------------------');
                            console.log('Energy SELL orders found: ' + orders.length);
                            
                            console.log('Best price: ' + orders[0].price);
                            if (orders[0].price < price)
                            {
                                let result = Game.market.deal(orders[0].id, 5000, room.name);
                                if (result == 0)
                                {
                                console.log('Purchase completed successfully for ' + room.name);
                                }
                            }
                            console.log('--------------------------');
                        }
                        else if (orders[0].price < price)
                        {
                            Game.market.deal(orders[0].id, 5000, room.name);
                        }
                    }

                    break;

                // Send Energy to Main Room 
                //&& Game.rooms["W37S48"].storage[RESOURCE_ENERGY] < 500000 && Game.rooms["W37S48"].terminal.store.getFreeCapacity >= 20000
                case(room.name != "W37S48" && room.terminal.store[RESOURCE_ENERGY] > 40000):
                    terminal.send(RESOURCE_ENERGY, 20000, 'W37S48', 'REMOTE ENERGY POOL');
                    if(Memory.Interface.Visualizations.Logs)
                    {console.log("!!!ENERGY SENT!!!");}
                    break;

                // Sell Energy in Batches
                case (room.storage.store[RESOURCE_ENERGY] > 700000 && terminal.store[RESOURCE_ENERGY] > 50000):
                    orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_ENERGY &&
                        order.type == ORDER_BUY &&
                        Game.market.calcTransactionCost(5000, room.name, order.roomName) < 2500);

                    var price = 3
                    if (orders.length)
                    {
                        orders.sort(function(a,b){return b.price - a.price});

                        if (Memory.Interface.Visualizations.Logs)
                        {
                            console.log('--------------------------');
                            console.log('Energy BUY orders found: ' + orders.length);
                            
                            console.log('Best price: ' + orders[0].price);
                            if (orders[0].price > price)
                            {
                                let result = Game.market.deal(orders[0].id, 5000, room.name);
                                if (result == 0)
                                {
                                console.log('Sale completed successfully for ' + room.name);
                                }
                            }
                            console.log('--------------------------');
                        }
                        else if (orders[0].price > price)
                        {
                            Game.market.deal(orders[0].id, 5000, room.name);
                        }
                    }
                    break;
            }
        }
        else
        {
            orders = Game.market.orders;

            // switch(true)
            // {
            //     case (room.storage.store[RESOURCE_ENERGY] < 100000 && room.memory)
            // }
        }
    }
};