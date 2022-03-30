const spawnLogic = require('controller.spawn');
const towerLogic = require('controller.tower');
const terminalLogic = require('controller.terminal');
const linkLogic = require('controller.link');
const data = require('memory.manager');
const visuals = require('visuals');

module.exports = 
{
    run: function(room)
    {
        // Only run for my rooms
        if (room.controller == undefined || !room.controller.my)
        {return;}
        
        // Manage room Memory
        data.roomMemory(room);
        // Draw room visuals
        visuals.drawRoomVisuals(room);
        //////////---Spawn Logic---//////////

            // Find Spawns
        let roomSpawns = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_SPAWN});
        if (room.memory.queue >= roomSpawns.length)
        {
            // If queue is more than number of spawns, reset it
            room.memory.queue = 0;
        }
        // Make sure there is a spawn in the room
        if (roomSpawns[room.memory.queue] != undefined)
        {
            // Run logic on queued spawn
            spawnLogic.run(roomSpawns[room.memory.queue]);
        }

        //----------//  TURRET CONTROL  //----------//
        
        // Find towers in the room
        let roomTowers = room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER});
        // Run logic for each of them
        for(let t in roomTowers)
        {
            towerLogic.run(roomTowers[t]);
        }

        //---------// Terminal Control //--------//
        terminalLogic.run(room);

        //---------//   Link Control   //--------//
        linkLogic.run(room);

        // ----- // DEFCON SYSTEM // ----- //
        // Check how bad it is and react accordingly
        data.checkDefcon(room);
    }
};