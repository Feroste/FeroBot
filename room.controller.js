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
        if (room.memory.energyLimit === undefined || room.memory.reset === true)
        {
            room.memory =
            {
                defcon:
                {
                    level: 0,
                    defenders: 0
                },
                jobs:
                {
                    storeJobs: 1,
                    repairJobs: 1,
                    buildJobs: 1,
                    upgradeJobs: 1,
                    lorryJobs: 0,
                    wallRepairJobs: 0,
                    scientistJobs: 0,
                },
                sources:{},
                energyLimit: 1000,
                queue: 0,
                reset: false
            }

            // Source function
            //sources = room.find()
        }

        // Flag handling [NOT IMPLEMENTED]
        let flags =
        {
            attackFlags: _.filter(Game.flags, f => f.color === COLOR_RED),
            claimFlags: _.find(Game.flags, {filter: (f) => f.color == COLOR_YELLOW}),
            helpFlags: _.find(Game.flags, {filter: (f) => f.color == COLOR_GREEN}),
            harvestFlags: _.find(Game.flags, {filter: (f) => f.color == COLOR_PURPLE})
        }

        //////////---Spawn Logic---//////////

        // Find Spawns
        let roomSpawns = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_SPAWN});
        if (room.memory.queue >= roomSpawns.length)
        {
            // If queue is more than number of spawns, reset it
            room.memory.queue = 0;
        }

        if (roomSpawns[room.memory.queue] != undefined)
        {
            // Run logic on queued spawn
            spawnLogic.run(roomSpawns[room.memory.queue]);
        }

        //----------//  TURRET CONTROL  //----------//
        
        // Find towers in the room
        let roomTowers = room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER});

        for(let t in roomTowers)
        {
            // Run logic for each of them
            towerLogic.run(roomTowers[t]);
        }

        // ----- // DEFCON SYSTEM // ----- //

        // Check how bad it is and react accordingly
        checkDefcon();

        // Defcon function
        function checkDefcon()
        {
            
            // Check defcon level       Still no lvl 4  
            // IMPORTANT STRUCTURE????

            // Find enemies in room
            let enemies = room.find(FIND_HOSTILE_CREEPS);

            switch(true)
            {
                // DEFCON 3 - 5+ hostiles or L2 for 1000 ticks
                case (enemies.length > 4 || room.memory.defcon.combatTicks > 1000):
                    // Spawn 2 more defenders
                    room.memory.defcon.defenders = 4;
                    room.memory.defcon.level = 3;

                    // Increase combat ticks
                    room.memory.defcon.combatTicks += 1;
                break;
    
                // DEFCON 2 - 3+ hostiles or L1 for 300 ticks
                case (enemies.length > 2 || room.memory.defcon.combatTicks > 300):
                    // Spawn 1 more defender
                    room.memory.defcon.defenders = 2;
                    room.memory.defcon.level = 2;

                    // Increase combat ticks
                    room.memory.defcon.combatTicks += 1;
                break;

                // DEFCON 1 - Up to 2 hostiles
                case (enemies.length > 0):
                    room.memory.defcon.level = 1;              
                    // Spawn 1 defender
                    room.memory.defcon.defenders = 1;
    
                    // Prioritize Towers [WIP]
                    room.memory.defcon.manTowers = 1;
    
                    // Spawn a wall repairer if none
                    // if(numberOfWallRepairers = 0)
                    // {
                    //     room.createCustomCreep(1000, 'wallRepairer');
                    // }
    
                    // Increase combat ticks
                    room.memory.defcon.combatTicks += 1;
                break;

                // DEFCON 0 - No hostiles
                default:
                    room.memory.defcon.combatTicks = 0;  
                    delete room.memory.defcon.manTowers;
                    room.memory.defcon.defenders = 0;
                    room.memory.defcon.level = 0;
                break;
            }
        }
    }
};