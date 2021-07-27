const subroutine = require('creep.subroutines');

module.exports = 
{
    // a function to run the logic for this role
    run: function(creep) 
    {
        
        // if not in target room
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target) 
        {
            // move towards it
            subroutine.moveToRoom(creep);
        }
        
        else
        {
            
            // if creep is bringing energy to the controller but has no energy left
            if (creep.memory.working == true && creep.carry.energy == 0) 
            {
                // switch state
                creep.memory.working = false;
                creep.say('Collecting');
            }
            // if creep is harvesting energy but is full
            else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) 
            {
                // switch state
                creep.memory.working = true;
                creep.say('Upgrading');
            }

            // if creep is supposed to transfer energy to the controller
            if (creep.memory.working == true) 
            {
                subroutine.upgrade(creep);
            }


            // if creep is supposed to harvest energy from source
            else 
            {

                let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => (s.structureType == STRUCTURE_STORAGE &&
                                s.store[RESOURCE_ENERGY] > 2000)
                                || (s.structureType == STRUCTURE_CONTAINER &&
                                s.store[RESOURCE_ENERGY] >1000)
                });


                if(creep.room.terminal != undefined && creep.room.terminal.store[RESOURCE_ENERGY] > 50000)
                {
                    if (creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(creep.room.terminal, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                    } 
                }


                else if (container != undefined)
                {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(container, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                    }
                }
                else
                {
                    // find closest source
                    var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                    const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                    // try to harvest energy, if the source is not in range
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) 
                    {
                        // move towards the source
                        creep.moveTo(source, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                    }
                }
            }
        }
    }
};