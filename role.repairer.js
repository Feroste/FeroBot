var subroutine = require('creep.subroutines');
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
            try
            {
                subroutine.repair(creep);
            }
            // if we can't
            catch
            {
                // look for construction sites
                roleBuilder.run(creep);
            }
        }
        
        // if creep is supposed to harvest energy from source
        else 
        {
            try 
            {
                subroutine.getFromStorage(creep);
            }
            catch
            {
                subroutine.harvest(creep);
            }
        }
    }
};