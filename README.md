# Screeps

    Make sure to add your rooms and 'Interface' to memory watch paths so you can edit creep numbers, energy limit, and issue commands, etc.
        ex. rooms.N11E22
        ex. Interface

    'attackFlag' = sends a number of melee attackers to the room

    Buy energy
        ex. Game.market.createOrder('buy',RESOURCE_ENERGY,.4,250000,'W39N59')
    Manual Creep
    Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {target: 'E14S22', role: 'harvester', working: false})


    ================================================================================
    --------------------------------------------------------------------------------
    ================================================================================
                                        Features
    - Automatic start
    - Command Interface with multiroom support
    - Range of basic creep subroutines
    - Role orientated creeps
    - Progressive body building
    - DEFCON system
    - Easy Claim
    - Light Energy Economy (Storage, links, terminal)
    - Path visuals and HUD
    ================================================================================
    --------------------------------------------------------------------------------
    ================================================================================
    .
