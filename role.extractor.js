const subroutine = require('creep.subroutines');

module.exports = 
{
    // a function to run the logic for this role
    run: function(creep) 
    {
        
        if (creep.ticksToLive < 200 && _.sum(creep.carry) == 0)
        {
            creep.suicide();
        }
        
        
        if (creep.memory.extracting && creep.carryCapacity == _.sum(creep.carry)) 
        {
            creep.memory.extracting = false;
        }
        if (!creep.memory.extracting && 0 == _.sum(creep.carry)) 
        {
            creep.memory.extracting = true;
        }
        
        if (creep.memory.extracting) 
        {
            subroutine.extract(creep);
        } 
        else 
        {
            // if (creep.room.terminal && _.sum(creep.room.terminal.store) < 250000) {
            //     if (creep.transfer(creep.room.terminal, creep.memory.mineralType) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(creep.room.terminal);
            //     }
            // } 
            if (creep.room.storage) 
            {
                if (creep.transfer(creep.room.storage, creep.memory.mineralType) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(creep.room.storage);
                }
            }
        }
    }
};