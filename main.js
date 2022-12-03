/*  
    This script runs every tick   
*/

// import controllers
const screepLogic = require('controller.creep');
const roomLogic = require('controller.room');
const data = require('memory.manager');
const visuals = require('visuals');

            //  //  //-----Main Loop START-----//  //  //
                module.exports.loop = function () 
{
    // Manage Interface
    data.mainInterface();
    // Draw HUD visuals
    visuals.drawGlobalVisuals();
               //------Register Creep Roles------//

    // Run logic for every creep in Game.creeps
    for (let name in Game.creeps) 
    {
        let creep = Game.creeps[name];  
        screepLogic.run(creep);
    }
    // Power Creep
    let shyft = Game.powerCreeps['Shyft'];
    if(shyft){screepLogic.powerCreep(shyft);}

               /////----- Room Logic -----//////
    
    // Run logic for every room in Game.rooms
    for (let room in Game.rooms)
    {
        let roomName = Game.rooms[room];
        roomLogic.run(roomName);
    }
                   
            // --- REGULAR LOG 50 ticks --- //
    if (Game.time % 50 == 0)
    {
        if(Memory.Interface.Visualizations.Logs === true)
        {
            console.log('// --- Status Report --- //');
            console.log(`Game Tick: ${Game.time}`);
                // if 10,000 cpu, make a pixel
                if (Game.cpu.bucket < 10000)
                {
                    let pixelpercent = Math.floor((Game.cpu.bucket/ 10000) * 100);
                    console.log(`Pixel Progress: ${pixelpercent}%`);
                }
                else
                {
                   console.log('!!! --- !!! MADE PIXEL !!! --- !!!');
                   Game.cpu.generatePixel();
                }
            console.log('// --- End   Report --- //')
        }
        else if(Game.cpu.bucket === 10000) {Game.cpu.generatePixel();}

            // ALSO CLEAR DEAD CREEPS FROM MEMORY
        // check for memory entries of died creeps by iterating over Memory.creeps
        for (let name in Memory.creeps) 
        {
            if (Game.creeps[name] === undefined) 
            {
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