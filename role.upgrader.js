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
            
            // Check to see if the creep should switch states
            subroutine.checkWorking(creep);

            // if creep is supposed to transfer energy to the controller
            if (creep.memory.working == true) 
            {
                subroutine.upgrade(creep);
            }


            // if creep is supposed to harvest energy from source
            else 
            {
                if(creep.room.terminal != undefined && creep.room.terminal.store[RESOURCE_ENERGY] > 50000)
                {
                    if (creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(creep.room.terminal, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                    } 
                }

                else try 
                {
                    subroutine.getFromStorage(creep);
                }

                catch
                {
                    subroutine.harvest(creep);
                }
            }
        }
    }
};