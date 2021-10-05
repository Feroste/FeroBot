/*  
    This script runs every tick   
*/

// import controllers
const screepLogic = require('creep.controller');
const roomLogic = require('room.controller');

            //  //  //-----Main Loop START-----//  //  //
                module.exports.loop = function () 
{

    // Main interface for interactions
    if (Memory.Interface === undefined || Memory.Interface.reset === true)
    {
        Memory.Interface =
        {
            sendAttacker: null,
            sendHelp: null,
            claimRoom: null,
            visualizations: 
            {
                creepReports: false,
                paths: true
            },
            reset: false
        }
    }
               //------Register Creep Roles------//

    // for every creep in Game.creeps
    for (let name in Game.creeps) 
    {
        // select creep
        let creep = Game.creeps[name];  
        // run logic
        screepLogic.run(creep);
    }

               /////----- Room Logic -----//////
    
    // for every room in Game.rooms
    for (let room in Game.rooms)
    {
        // select room
        let roomName = Game.rooms[room];
        // run logic
        roomLogic.run(roomName);
    }
                   
            // --- PRINT REGULAR LOG 50 ticks --- //
    if (Game.time % 50 == 0 )
    {
        console.log('// --- Status Report --- //');

        console.log(`Bucketed CPU: ${Game.cpu.bucket}`);
        console.log(`Game Tick: ${Game.time}`);
            // if 10,000 cpu, make a pixel
            // if (Game.cpu.bucket < 10000)
            // {
            //     let pixelpercent = Math.floor((Game.cpu.bucket/ 10000) * 100);
            //     console.log(`Pixel Progress: ${pixelpercent}%`);
            // }
            // else
            // {
            //    console.log('!!! --- !!! MADE PIXEL !!! --- !!!');
            //    Game.cpu.generatePixel();
            // }
        console.log('// --- End   Report --- //')

            // ALSO CLEAR DEAD CREEPS FROM MEMORY
        // check for memory entries of died creeps by iterating over Memory.creeps
        for (let name in Memory.creeps) 
        {
            // checking if the creep is still alive
            if (Game.creeps[name] === undefined) 
            {
                // if not, delete the memory entry
                delete Memory.creeps[name];
            }
        }

            // Clear old rooms
        for (let room in Memory.rooms)
        {
            if (Game.rooms[room] === undefined)
            {
                delete Memory.rooms[room];
            }
        }
    }
};