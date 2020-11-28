module.exports = 
{
    run: function(creep) 
    {
        
        
        // Check for attackFlag
            let dest = Game.flags.attack2Flag;
        
        // Check to see if in the same room
        if (dest != undefined && creep.pos.roomName == dest.pos.roomName) 
        {
            let hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
            let target = creep.pos.findClosestByRange(hostiles);
            
            if (target != undefined)
            {
                    let outcome = creep.rangedAttack(target);
                    // Out of range Move to target
                    if (outcome == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(target);
                    }
            }
            
            // No target, Move to flag
            else
            {
                creep.moveTo(dest);
            }
        }
        
        // If not in same room, Move to flag
        else if (dest != undefined) 
        {
            creep.moveTo(dest);
        }
    }
};