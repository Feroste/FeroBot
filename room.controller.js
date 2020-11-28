module.exports = 
{
    run: function(room)
    {
        // Initialize room variables
        if (room.my && room.memory.energyLimit == undefined)
        {
            room.memory.minHarvesters = 1;
            room.memory.minUpgraders = 0;
            room.memory.minBuilders = 0;
            room.memory.minRepairers = 0;
            room.memory.minLorries = 0;
            room.memory.minWallRepairers = 0;
            room.memory.minExtractor = 0;
            room.memory.energyLimit = 500;
        }
        // Dynamic Energy Limit
        switch(room.controller.level)
        {
            case 1:
                room.memory.energyLimit = 500;
                break;
            case 2:
                room.memory.energyLimit = 500;
                break;
            case 3:
                room.memory.energyLimit = 500;
                break;
            case 4:
                room.memory.energyLimit = 500;
                break;
            case 5:
                room.memory.energyLimit = 1000;
                break;
            case 6:
                room.memory.energyLimit = 2000;
                break;
            case 7:
                room.memory.energyLimit = 2000;
                break;
            case 8:
                room.memory.energyLimit = 2000;
                break;
        }

        // ----- // DEFCON SYSTEM // ----- //
        let enemies = room.find(FIND_HOSTILE_CREEPS);

        switch(room.memory.defcon)
        {
            // DEFCON 0 - No hostiles
            default:
                room.memory.defcon = 0;
                break;
            case 0:
                // Normal Operations
                delete room.memory.combatTicks;
                delete room.memory.manTowers;

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
                    room.memory.defcon = 0;
                }

                break;
                
            // DEFCON 2 - 4+ hostiles or L1 for 200 ticks
            case 2:
                // Spawn 2 defenders [WIP]


                // Check defcon level
                if (enemies.length > 5 || room.memory.combatTicks > 700)
                {
                    room.memory.defcon = 3;
                }
                else if (enemies.length < 4)
                {
                    room.memory.defcon = 2;
                }
                
                break;
                
            // DEFCON 3 - 6+ hostiles or L2 for 500 ticks
            case 3:
                // Spawn 2 more defenders [WIP]



                // Check defcon level
                if (enemies.length > 1000) // TEMP SETTING
                {
                    room.memory.defcon = 4;
                }
                else if (enemies.length < 6)
                {
                    room.memory.defcon = 2;
                }
                
                break;
                
            // DEFCON 4 - 10+ hostiles or imporant structure destroyed       [WIP]
            case 4:
                // ACTIVATE SAFE MODE

                break;
        }
    }
};