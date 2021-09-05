const subroutine = require('creep.subroutines');

module.exports = 
{
    run: function(creep) 
    {

        // Target is assigned in creep memory
        var target = creep.memory.target;

        // Defender
        if (target == -1)
        {
            let hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
            let target = creep.pos.findClosestByPath(hostiles);

            if (target != undefined)
            {
                    let outcome = creep.attack(target);
                    // Out of range Move to target
                    if (outcome == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(target);
                    }
            }
        }

        // Attacker
        else
        {
            // if not in target room
            if (creep.memory.target != undefined && creep.room.name != creep.memory.target) 
            {
                // move towards it
                subroutine.moveToRoom(creep);
            }

            // If in the right room
            else
            {
                subroutine.attack(creep);
            }
        }
    }
};