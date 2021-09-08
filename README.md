# Screeps

    Make sure to add your room to memory watch paths so you can edit creep numbers, energy limit, etc
        ex. rooms.N11E22

    'attackFlag' = sends a number of melee attackers to the room

    Claim a room
        ex.   Game.rooms.ROOMNAME.memory.claimRoom = 'W12N21'
        ex.   Game.rooms.ROOMNAME.memory.reserveRoom0 = 'W21N12'

    Buy energy
        ex. Game.market.createOrder('buy',RESOURCE_ENERGY,.4,250000,'W39N59')
    Manual Creep
    Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {target: 'E14S22', role: 'harvester', working: false})


    ================================================================================
    --------------------------------------------------------------------------------
    ================================================================================
                                        Features
    - Automatic start
    - Range of basic creep subroutines
    - Role orientated creeps
    - Progressive body building
    - DEFCON system
    - Easy Claim
    - Light Energy Economy
    - Path visuals
    ================================================================================
    --------------------------------------------------------------------------------
    ================================================================================
    .
