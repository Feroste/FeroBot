module.exports = 
{
    // a function to run the logic for this role
    run: function(creep) 
    {
        // if not in target room
        if (creep.room.name != creep.memory.target) 
        {
            // find exit to target room
            var exit = creep.room.findExitTo(creep.memory.target);
            // move to exit
            creep.moveTo(creep.pos.findClosestByPath(exit));
        }
        else 
        {
            var controller = creep.room.controller;
            var owner = controller.owner;


            // Decide what to do based on owner of target room    THIS IS NOT WORKING
            switch (owner)
            {
                // If enemy room, attack
                default:
                    if(creep.claimController(controller) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(controller);
                    }
                    break;


                // If my room, sign it
                case 'Feroste':
                    if(creep.signController(controller, "Veni Vidi Vici") == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(controller);
                    }
                    break;

                // If neutral room, claim it
                case 'None':
                    if (creep.attackController(controller) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(controller);
                    }
                    break;
            }
        }
    }
};