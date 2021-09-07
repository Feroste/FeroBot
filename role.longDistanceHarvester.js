var roleChange = require('role.builder');

module.exports = 
{
    // a function to run the logic for this role
    run: function(creep) 
    {
        // Check to see if the creep should switch states
        subroutine.checkWorking(creep);

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) 
        {
            // if in home room
            if (creep.room.name == creep.memory.home) 
            {
                // find closest spawn, extension or tower which is not full
                var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, 
                {
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN
                                 || s.structureType == STRUCTURE_EXTENSION
                                 || (s.structureType == STRUCTURE_TOWER && s.energy < 700))
                                 && s.energy < s.energyCapacity
                });

                // if we found one
                if (structure != undefined) 
                {
                    // try to transfer energy, if it is not in range
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
                        // move towards it
                        creep.moveTo(structure);
                    }
                }
                
                // if full on energy, store
                else
                {
                        
                        if (creep.room.storage != undefined)
                        {
                            structure = creep.room.storage;
                                if (creep.room.storage.store[RESOURCE_ENERGY] < 300000)
                                {
                                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                                    {
                                        // move towards it
                                        creep.moveTo(structure);
                                    }
                                }
                                else
                                {
                                    roleChange.run(creep);
                                }
                        }
                        // if storage is full
                        else
                        {
                            roleChange.run(creep);
                        }
                    }
                
                }
            // if not in home room...
            else 
            {
                // find exit to home room
                var exit = creep.room.findExitTo(creep.memory.home);
                // and move to exit
                creep.moveTo(creep.pos.findClosestByPath(exit));
            }
        }
        // if creep is supposed to harvest energy from source
        else 
        {
            // if in target room
            if (creep.room.name == creep.memory.target) 
            {
                // find source
                var source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex];

                // try to harvest energy, if the source is not in range
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) 
                {
                    // move towards the source
                    creep.moveTo(source);
                }
            }
            // if not in target room
            else 
            {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.target);
                // move to exit
                creep.moveTo(creep.pos.findClosestByPath(exit));
            }
        }
    }
};