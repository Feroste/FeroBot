# Screeps

    Make sure to add your room to memory watch paths so you can edit creep numbers, energy limit, etc
        ex. rooms.N11E22

    Claim a room
        ex.   Game.rooms.ROOMNAME.memory.claimRoom = 'W12N21'
    Buy energy
        ex. Game.market.createOrder('buy',RESOURCE_ENERGY,.4,250000,'W39N59')
    Manual Creep
    Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {target: 'E12S21', role: 'harvester', working: false})

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






    1.0.1 update Log
    ==============================
    -- Added a room spawning queue to handle multiple spawns
    -- Miners now suicide when their container is missing instead of crashing entire colony
    -- Fixed errors with fresh respawn

    
    To-Do
    ==============================
    - Combat AI
    - finish Autorooms
    - Fallback methods for resource management
    - Full Claim room functionality
    - Lab Functionality
    - Factory functionality
    - Finish DEFCON system
    - Whitelist / Traitor code
    - Pickup dropped energy
