var roleBuilder = require('role.builder');

module.exports = 
{
    // a function to run the logic for this role
    run: function(creep) 
    {
        // if creep is trying to repair something but has no energy left
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
            creep.say('Repairing');
        }

        // if creep is supposed to repair something
        if (creep.memory.working == true) 
        {
            // find closest structure with less than max hits
            // Exclude walls because they have too many max hits
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, 
            {
                filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
                        && s.structureType != STRUCTURE_RAMPART
            });

            // if we find one
            if (structure != undefined) 
            {
                // try to repair it, if it is out of range
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) 
                {
                    // move towards it
                    creep.moveTo(structure);
                }
            }
            // if we can't fine one
            else 
            {
                // look for construction sites
                roleBuilder.run(creep);
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

            if (container != undefined)
            {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(container);
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
                    creep.moveTo(source);
                }
            }
        }
    }
};