const subroutine = require('creep.subroutines');

module.exports =
{
    // Interface Memory Template
    mainInterface: function()
    {
        // Main interface for interactions
        if (Memory.Interface === undefined || Memory.Interface.Reset.Interface === true)
        {
            Memory.Interface =
            {
                Commands:
                {
                    COMMAND: 'ROOMNAME',
                    Explore: null,
                    Attack: null,
                    Help: null,
                    Claim: null,
                    Reserve: null
                },
                Visualizations: 
                {
                    Logs: true,
                    Reports: false,
                    Paths: true
                },
                Reset:
                {
                    RESET_WARNING: 'CAN BREAK COLONY',
                    Interface: false,
                    Rooms: false,
                    Creeps: false,
                }
            }
        }
    },

    // Room Memory Template
    roomMemory: function(room)
    {
        // Initialize room variables
        if (room.memory.energyLimit === undefined || room.memory.reset === true)
        {
            room.memory =
            {
                defcon:
                {
                    level: 0,
                    defenders: 0,
                    combatTicks: 0
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
                sources: room.find(FIND_SOURCES),
                energyLimit: 1000,
                turretSupport: 10000,
                queue: 0,
                reset: false
            }
        }

        // RESET ROOMS
        if (Memory.Interface.Reset.Rooms === true)
        {
            for (let roomName in Game.rooms)
            {
                let room = Game.rooms[roomName];
                room.memory.reset = true;
            }
            Memory.Interface.Reset.rooms = false;
        }

        // Interface commands
        var distanceLimit = 8; // Distance rooms will spawn for

        switch(true)
        {
            // Explore
            case (Memory.Interface.Commands.Explore != null && Game.map.getRoomLinearDistance(room.name, Memory.Interface.Commands.Explore) <= distanceLimit):
                room.memory.explore = Memory.Interface.Commands.Explore;
                Memory.Interface.Commands.Explore = null;
                break;
            // Attack
            case (Memory.Interface.Commands.Attack != null && Game.map.getRoomLinearDistance(room.name, Memory.Interface.Commands.Attack) <= distanceLimit):
                room.memory.attack = Memory.Interface.Commands.Attack;
                Memory.Interface.Commands.Attack = null;
                break;
            // Help
            case (Memory.Interface.Commands.Help != null && Game.map.getRoomLinearDistance(room.name, Memory.Interface.Commands.Help) <= distanceLimit):
                room.memory.help = Memory.Interface.Commands.Help;
                Memory.Interface.Commands.Help = null;
                break;
            // Claim
            case (Memory.Interface.Commands.Claim != null && Game.map.getRoomLinearDistance(room.name, Memory.Interface.Commands.Claim) <= distanceLimit):
                room.memory.claim = Memory.Interface.Commands.Claim;
                Memory.Interface.Commands.Claim = null;
                break;
            // Reserve
            case (Memory.Interface.Commands.Reserve != null && Game.map.getRoomLinearDistance(room.name, Memory.Interface.Commands.Reserve) <= distanceLimit):
                room.memory.reserve = Memory.Interface.Commands.Reserve;
                Memory.Interface.Commands.Reserve = null;
                break;
        }


    },

    // Defcon function
    checkDefcon: function(room)
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
                if (room.memory.defcon.combatTicks > 50)
                {room.memory.defcon.defenders = 1;}
                
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
    },

    // Creep Memory Template
    creepMemory: function(creep)
    {
        // Check working
        subroutine.checkWorking(creep);

        // Initialize creep variables for work creeps
        if (creep.memory.homeRoom === undefined || creep.memory.reset === true)
        {
            spawnRole = creep.memory.role;
            if (spawnRole === undefined) {spawnRole = 'harvester';}
            targetRoom = creep.memory.targetRoom;
            if (targetRoom === undefined) {targetRoom = creep.pos.roomName;}
            creep.memory =
            {
                homeRoom: creep.pos.roomName,
                targetRoom: targetRoom,
                role: spawnRole,
                job: null,
                working: false,
                reset: false
            }
        }
        
        // RESET CREEPS
        if (Memory.Interface.Reset.Creeps === true)
        {
            for (let name in Game.creeps)
            {
                let creep = Game.creeps[name];
                creep.memory.reset = true;
            }
            Memory.Interface.Reset.Creeps = false;
        }
    }
};