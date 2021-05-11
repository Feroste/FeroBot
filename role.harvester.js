let roleChange = require('role.builder');

module.exports = 
{
    // a function to run the logic for this role
    run: function(creep) 
    {
        // if in target room
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target) 
        {
            // find exit to target room
            var exit = creep.room.findExitTo(creep.memory.target);
            // move to exit
            creep.moveTo(creep.pos.findClosestByPath(exit));
        }
        
        else
        {
            
            // if creep is bringing energy to the spawn or an extension but has no energy left
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
                creep.say('Working');
            }
    
            // if creep is supposed to transfer energy to the spawn or an extension
            if (creep.memory.working == true) 
            {
                // find closest spawn or extension which is not full
                let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, 
                {
                    // the second argument for findClosestByPath is an object which takes
                    // a property called filter which can be a function
                    // we use the arrow operator to define it
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN
                                 || s.structureType == STRUCTURE_EXTENSION
                             //    || (s.structureType == STRUCTURE_TOWER && s.energy < 310)
                                 )
                                 && s.energy < s.energyCapacity
                });
    
                // if we found one
                if (structure != undefined) 
                {
                    // try to transfer energy, if it is not in range
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
                        // move towards it
                        creep.moveTo(structure, {visualizePathStyle: {stroke:'yellow', lineStyle: 'solid', opacity: .5}});
                    }
                }
                // else upgrade
                else 
                {
                    roleChange.run(creep);
                }
            }
    
    
    
            // if creep is supposed to harvest energy from source
            else 
            {
                let container = creep.pos.findClosestByPath(FIND_STRUCTURES, 
                {
                    filter: s => (s.structureType == STRUCTURE_STORAGE &&
                                 s.store[RESOURCE_ENERGY] > 2000)
                                 || (s.structureType == STRUCTURE_CONTAINER &&
                                 s.store[RESOURCE_ENERGY] >1000)
                });
                let tombstones = creep.pos.findClosestByRange(FIND_TOMBSTONES);
                let dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);


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
                    let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
             
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