# Screeps

    Make sure to add your room to memory watch paths so you can edit creep numbers, energy limit, etc
        ex. rooms.N11E22

    Claim a room
        ex.   Game.rooms.ROOMNAME.memory.claimRoom = 'W12N21'
    Buy energy
        ex. Game.market.createOrder('buy',RESOURCE_ENERGY,.4,250000,'W39N59')
    Manual Creep
    Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {target: 'E14S22', role: 'harvester', working: false})

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

    
    To-Do
    ==============================
    -claimer still not working correctly
    
    - Combat AI [|||--]
    - DEFCON system [|||--]
    - Lab Functionality [|----]
    - Factory functionality [-----]
    - Pickup dropped energy [-----]
    - Whitelist / Traitor code [-----]
    - Full Claim room functionality [|||--]
    - Fallback methods for resource management [||||-]

    - Empire [|---------]



    1.0.1 update Log
    ==============================
    -- Added a room spawning queue to handle multiple spawns
    -- Miners now suicide when their container is missing instead of crashing entire colony
    -- Fixed errors with fresh respawn

    1.0.2 update Log
    ==============================
    -- Removed Dynamic energy cap (default cap 2000)
    -- If there are no creeps spawn a harvester with whats available
    -- Automated claimer tasks by controller owner (attack,claim,sign)
    -- Normalized codebase
    -- Miners will now spawn with just 550 energy available
    
    1.0.3 update Log
    ==============================
    -- Attack role now functions regardless of flag so they can be spawned elsewhere
        -- still need to pass flag into attack role instead of declaring so defenders dont run off
    -- DEFCON system now spawns defenders (attackFlag is for now Use at own risk)
    -- If no harvesters or lorries look for a miner and spawn a lorry, else harvester with whats available
    -- Changed pixel generation to work with new update

    1.0.4 update Log
    ==============================
    -- Fixed a TypeError when moving through a room with no controller [hallways]
    -- Attacker role now uses target memory to determine behavior, attackers spawned with flags are independent of those spawned with DEFCON
    -- Changed room initialization to a base set of workers 1 harvester/builder/upgrader/repairer, 5 work/carry/move cap.
        this will help make claiming new rooms more seemless later as a room can be self sufficient with just a spawn ASAP
        -- added newSpawn variable to be used for sending help to a freshly claimed room


    .
