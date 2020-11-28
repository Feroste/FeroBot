module.exports = 
{
    run: function(creep) 
    {
        // Check for attackFlag
            let flag = Game.flags.attackFlag;
        
        // Check to see if in the same room
        if (flag != undefined && creep.pos.roomName == flag.pos.roomName) 
        {

            let newspawn = creep.room.find(FIND_HOSTILE_SPAWNS);
            let spawnTarget = creep.pos.findClosestByPath(newspawn);
            
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
            
            // No target, Move to flag
            else
            {
                creep.moveTo(flag);
            }
        }
        
        // If not in same room, Move to flag
        else if (flag != undefined) 
        {
            creep.moveTo(flag);
        }
    }
};