var roleBuilder = require('role.builder');

module.exports = 
{
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function(creep) 
    {
        // if creep is trying to repair something but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) 
        {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) 
        {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to repair something
        if (creep.memory.working == true) 
        {
            // find all walls in the room
            var walls = creep.room.find(FIND_STRUCTURES, 
            {
                filter: (s) => s.structureType == STRUCTURE_WALL
            });

            var target = undefined;

            // loop with increasing percentages
            for (let percentage = 0; percentage <= 1; percentage = percentage + 0.0001)
            {
                // find a wall with less than percentage hits
                for (let wall of walls) 
                {
                    if (wall.hits / wall.hitsMax < percentage) {
                        target = wall;
                        break;
                    }
                }

                // if there is one
                if (target != undefined) 
                {
                    // break the loop
                    break;
                }
            }

            // if we find a wall that has to be repaired
            if (target != undefined) 
            {
                // try to repair it, if not in range
                if (creep.repair(target) == ERR_NOT_IN_RANGE) 
                {
                    // move towards it
                    creep.moveTo(target, {visualizePathStyle: {stroke:'grey', lineStyle: 'solid', opacity: .5}});
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
};