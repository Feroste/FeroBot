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
            subroutine.claim(creep);
        }
    }
};