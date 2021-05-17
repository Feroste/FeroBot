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


        // Attacker [working?]
        else
        {
            // If not in target room, move towards room
            if (creep.pos.roomName != target)
            {
                // find exit to target
                var exit = creep.room.findExitTo(target);
                // and move to exit
                creep.moveTo(creep.pos.findClosestByPath(exit));
            }

            // If in the right room
            else
            {
                let enemyspawn = creep.room.find(FIND_HOSTILE_SPAWNS);
                let spawnTarget = creep.pos.findClosestByPath(enemyspawn);
                
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
                else if (spawnTarget != undefined)
                {
                        let outcome = creep.attack(spawnTarget);
                        // Out of range Move to target
                        if (outcome == ERR_NOT_IN_RANGE) 
                        {
                            creep.moveTo(spawnTarget);
                        }
                }
                else
                {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
};