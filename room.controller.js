const spawnLogic = require('spawn.controller');

module.exports = 
{
    run: function(room)
        {
        
    if (room.controller != undefined)
    {
            // Initialize room variables
            if (room.memory.energyLimit == undefined && room.controller.my)
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
                room.memory.newSpawn = 1;
            }


            if (room.controller.my)
            {
                        //////////---Spawn Logic---//////////


            let roomSpawns = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_SPAWN});
            if (room.memory.queue >= roomSpawns.length)
            {
                room.memory.queue = 0;
            }
                spawnLogic.run(roomSpawns[room.memory.queue]);





                // ----- // DEFCON SYSTEM // ----- //
                let enemies = room.find(FIND_HOSTILE_CREEPS);

                switch(room.memory.defcon)
                {
                    // DEFCON 0 - No hostiles
                    default:
                        room.memory.defcon = 0;
                        room.memory.defenders = 0;
                        break;
                    case 0:
                        // Normal Operations
                        delete room.memory.combatTicks;
                        delete room.memory.manTowers;
                        room.memory.defenders = 0;

                        // Check defcon level
                        if (enemies.length > 0)
                        {
                            room.memory.defcon = 1;
                            room.memory.combatTicks = 0;
                        }
                        break;

                    //----------------------------
                        
                    // DEFCON 1 - Up to 3 hostiles
                    case 1:
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

                        // Check defcon level
                        if (enemies.length > 3 || room.memory.combatTicks > 200)
                        {
                            room.memory.defcon = 2;
                        }
                        else if (!enemies.length)
                        {
                            room.memory.defenders = 0;
                            room.memory.defcon = 0;
                        }

                        break;
                        
                    // DEFCON 2 - 4+ hostiles or L1 for 200 ticks
                    case 2:
                        // Spawn 1 more defender
                        room.memory.defenders = 2;


                        // Check defcon level
                        if (enemies.length > 5 || room.memory.combatTicks > 700)
                        {
                            room.memory.defcon = 3;
                        }
                        else if (enemies.length < 4)
                        {
                            room.memory.defenders = 1;
                            room.memory.defcon = 1;
                        }
                        
                        break;
                        
                    // DEFCON 3 - 6+ hostiles or L2 for 500 ticks
                    case 3:
                        // Spawn 2 more defenders
                        room.memory.defenders = 4;


                        // Check defcon level
                        if (enemies.length > 10) // IMPORTANT STRUCTURE????
                        {
                            room.memory.defcon = 3;     // 4
                        }
                        else if (enemies.length < 6)
                        {
                            room.memory.defenders = 2;
                            room.memory.defcon = 2;
                        }
                        
                        break;
                        
                    // DEFCON 4 - 10+ hostiles or       imporant structure destroyed       [WIP]
                    case 4:
                        // ACTIVATE SAFE MODE
                        
                        break;
                }
            }
        }
    }
};