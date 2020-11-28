/*  
    Claim a room
        ex.   Game.spawns.Spawn1.memory.claimRoom = 'W12N21'

    Flags
    -----------------
    'attackFlag' = sends a number of melee attackers to the room
    'attack2Flag' = send a number of ranged attackers to the room

    [WIP] Yellow = claim
            yellow/black = reserve
    [WIP] Red = attack
            red/blue = ranged attack
    [WIP] Green = send workers to this room
    [WIP] Purple = long distance harvest (place on source)
*/

// import controllers
const screeps = require('creep.controller');
const autorooms = require('room.controller');
const spawnLogic = require('spawn.controller');
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
        if(Game.structures[id].structureType == STRUCTURE_TOWER){
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

                //////////---Spawn Logic---//////////

    // Find all my spawns
    for (let spawnName in Game.spawns)
    {
        // select spawn
        let spawn = Game.spawns[spawnName];
        // run logic
        spawnLogic.run(spawn);
    }
                   
            // --- PRINT REGULAR LOG 10 ticks --- //
    if (Game.time % 10 == 0 )
    {
        console.log('// --- Status Report --- //');
        console.log('Bucketed CPU: ' + Game.cpu.bucket);
            // if more than 7500 cpu, make a pixel
            if (Game.cpu.bucket > 7500)
            {
                console.log('!!! --- !!! MADE PIXEL !!! --- !!!');
                Game.cpu.generatePixel();
            }
            else
            {
                let pixelpercent = Math.floor(((Game.cpu.bucket - 2500) / 5000) * 100);
                console.log('Pixel Progress: ' + pixelpercent + '%');
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