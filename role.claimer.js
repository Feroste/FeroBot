module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if in target room
        if (creep.room.name != creep.memory.target) {
            // find exit to target room
            var exit = creep.room.findExitTo(creep.memory.target);
            // move to exit
            creep.moveTo(creep.pos.findClosestByPath(exit));
        }
        else {
            
            // ATTACK AND BLOCK ENEMY CONTROLLER
            // if (creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            //     // move towards the controller
            //     creep.moveTo(creep.room.controller);
            // }
            
            // SIGN ROOM
            // if(creep.room.controller) {
            //     if(creep.signController(creep.room.controller, "Veni Vidi Vici") == ERR_NOT_IN_RANGE) {
            //             creep.moveTo(creep.room.controller);
            //     }
            // }
            
            // CLAIM NEUTRAL ROOM
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // move towards the controller
                creep.moveTo(creep.room.controller);
            }
            
            
            else {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};