const subroutine = require('creep.subroutines')

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
            // find closest spawn, extension or tower which is not full
            let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, 
            {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_EXTENSION
                             || (s.structureType == STRUCTURE_TOWER && s.energy <= 700)
                             || (s.structureType == STRUCTURE_LAB && s.energy <= 1700))
                             && s.energy < s.energyCapacity
            });

            if (structure == undefined && creep.room.terminal != undefined && creep.room.terminal.store[RESOURCE_ENERGY] < 20000)
            {
                structure = creep.room.terminal;
            }
            else if (structure == undefined && creep.room.storage != undefined && creep.room.storage.store[RESOURCE_ENERGY] < 750000) 
            {
                structure = creep.room.storage;
            }

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
            
            else
            {

                
            }
        }
        // if creep is supposed to get energy
        else 
        {
            // find closest container
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, 
            {
                filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 300
            });

            if (container == undefined) 
            {
                container = creep.room.storage;
            }

            // if one was found
            if (container != undefined) 
            {
                // try to withdraw energy, if the container is not in range
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    // move towards it
                    creep.moveTo(container, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                }
            }
        }
    }
};