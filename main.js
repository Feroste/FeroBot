/*  
    This script runs every tick
*/

// import controllers
const screeps = require('creep.controller');
const autorooms = require('room.controller');
const structures =
{
    tower: require('structure.tower')
}

            //  //  //-----Main Loop START-----//  //  //
                module.exports.loop = function () 
{
    
           //----------//  TURRET CONTROL  //----------//

    for(let id in Game.structures)
    {
        if(Game.structures[id].structureType == STRUCTURE_TOWER)
        {
            structures.tower.run(Game.structures[id])
        }
    }
               //------Register Creep Roles------//

    // for every creep name in Game.creeps
    for (let name in Game.creeps) 
    {
        // get the creep object
        let creep = Game.creeps[name];  
        screeps.run(creep);
    }

               /////----- Room Logic -----//////
    
    // for every room in Game.rooms
    for (let room in Game.rooms)
    {
        // select room
        let roomName = Game.rooms[room];
        // run logic
        autorooms.run(roomName);
    }
                   
            // --- PRINT REGULAR LOG 50 ticks --- //
    if (Game.time % 50 == 0 )
    {
        console.log('// --- Status Report --- //');

        console.log('Bucketed CPU: ' + Game.cpu.bucket);
        console.log('Game Tick: ' + Game.time);



            // if 10,000 cpu, make a pixel
            if (Game.cpu.bucket < 10000)
            {
                let pixelpercent = Math.floor((Game.cpu.bucket/ 10000) * 100);
                console.log('Pixel Progress: ' + pixelpercent + '%');
            }
            else
            {
               console.log('!!! --- !!! MADE PIXEL !!! --- !!!');
               Game.cpu.generatePixel();
            }
        console.log('// --- End   Report --- //')
    }

            // CLEAR DEAD CREEPS FROM MEMORY
    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) 
    {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) 
        {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }
};