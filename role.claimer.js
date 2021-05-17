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
            var owner = controller.owner.username;

            // Decide what to do based on owner of target room
            switch (owner)
            {
                // If neutral, check for claim signal (creep.memory.claim = 1)
                default:
                    if (creep.memory.claim == 1)
                    {
                        // CLAIM
                        if(creep.claimController(controller) == ERR_NOT_IN_RANGE) 
                        {
                            creep.moveTo(controller);
                        }
                    }
                    else                                        // ADD A TRY CHECK IF INVALID NEUTRAL SO SWITCH TO ATTACK
                    {
                        // RESERVE [Currenty delete claim memory to reserve]
                        if(creep.reserveController(controller) == ERR_NOT_IN_RANGE) 
                        {
                            creep.moveTo(controller);
                        }
                    }
                    break;


                // If my room, sign it
                case 'Feroste':
                    if(creep.signController(controller, "Veni Vidi Vici") == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(controller);
                    }
                    break;

                // If ENEMY, attack [add names]
                case 'ENEMY':
                    if (creep.attackController(controller) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(controller);
                    }
                    break;
            }
        }
    }
};