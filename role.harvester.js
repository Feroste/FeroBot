const subroutine = require('creep.subroutines');
let roleChange = require('role.builder');

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
                // try storing
                try
                {
                subroutine.store(creep);
                }
                // else switch hats
                catch
                {
                    roleChange.run(creep);
                }
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