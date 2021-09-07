var roleBuilder = require('role.builder');
var subroutine = require('creep.subroutines');

module.exports = 
{
    run: function(creep) 
    {
        // Check to see if the creep should switch states
        subroutine.checkWorking(creep);

        // if creep is supposed to repair something
        if (creep.memory.working == true) 
        {
            try
            {
                subroutine.wallRepair(creep);
            }
            // if we can't find one
            catch 
            {
                // Switch hats
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