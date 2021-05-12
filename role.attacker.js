module.exports = 
{
    run: function(creep) 
    {

        let flag = Game.flags.attackFlag;

        // Check for attackFlag and move towards the room
        if (flag != undefined && creep.pos.roomName != flag.pos.roomName)
        {
                creep.moveTo(flag);
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
            else if (flag != undefined)
            {
                creep.moveTo(flag);
            }
        }
    }
};