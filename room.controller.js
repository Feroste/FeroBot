const spawnLogic = require('spawn.controller');
const towerLogic = require('tower.controller');

module.exports = 
{
    run: function(room)
    {
        
        if (room.controller == undefined || !room.controller.my)
        {
            return;
        }
        // Initialize room variables
        if (room.memory.energyLimit == undefined)
        {
            room.memory.minHarvesters = 1;
            room.memory.minUpgraders = 1;
            room.memory.minBuilders = 1;
            room.memory.minRepairers = 1;
            room.memory.minLorries = 0;
            room.memory.minWallRepairers = 0;
            room.memory.minExtractor = 0;
            room.memory.energyLimit = 1000;
            room.memory.queue = 0;
            room.memory.defcon = 0;
            room.memory.defenders = 0;
        }

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

        // ----- // DEFCON SYSTEM // ----- //

        // Find enemies in room
        let enemies = room.find(FIND_HOSTILE_CREEPS);
        // Check how bad it is and react accordingly
        checkDefcon();

        // Defcon function
        function checkDefcon()
        {
            
            // Check defcon level       Still no lvl 4  
            // IMPORTANT STRUCTURE????


            if (enemies.length > 4 || room.memory.combatTicks > 1000)
            // DEFCON 3 - 5+ hostiles or L2 for 1000 ticks
            {
                // Spawn 2 more defenders
                room.memory.defenders = 4;
                room.memory.defcon = 3;
            }
            else if (enemies.length > 2 || room.memory.combatTicks > 300)
            // DEFCON 2 - 3+ hostiles or L1 for 500 ticks
            {
                // Spawn 1 more defender
                room.memory.defenders = 2;
                room.memory.defcon = 2;
            }
            else if (enemies.length > 0)            
            // DEFCON 1 - Up to 2 hostiles
            {
                room.memory.defcon = 1;              
                // Spawn 1 defender
                room.memory.defenders = 1;

                // Prioritize Towers [WIP]
                room.memory.manTowers = 1;

                // Spawn a wall repairer if none
                // if(numberOfWallRepairers = 0)
                // {
                //     room.createCustomCreep(1000, 'wallRepairer');
                // }

                // Increase combat ticks

                room.memory.combatTicks = room.memory.combatTicks + 1;
            }
            else if (!enemies.length)             
            // DEFCON 0 - No hostiles
            {
                room.memory.combatTicks = 0;  
                delete room.memory.manTowers;
                room.memory.defenders = 0;
                room.memory.defenders = 0;
                room.memory.defcon = 0;
            }
        }
    }
};