var subroutine = require('creep.subroutines');
var roleBuilder = require('role.builder');

module.exports = 
{
    // a function to run the logic for this role
    run: function(creep) 
    {
        // Check to see if the creep should switch states
        subroutine.checkWorking(creep);

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