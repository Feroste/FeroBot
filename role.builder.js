const subroutine = require('creep.subroutines');
var roleUpgrader = require('role.upgrader');

module.exports = 
{
    // a function to run the logic for this role
    run: function (creep) 
    {
        // if target is defined and creep is not in target room
            // Exclude long distance harvesters so they dont get confused when role changing
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target 
            && creep.memory.role != 'longDistanceHarvester') 
        {
            // move towards it
            subroutine.moveToRoom(creep);
        }

        // if creep is trying to complete a constructionSite but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) 
        {
            // switch state
            creep.memory.working = false;
            creep.say('Collecting');
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) 
        {
            // switch state
            creep.memory.working = true;
            creep.say('Building');
        }

        // if creep is supposed to complete a constructionSite
        if (creep.memory.working == true) 
        {
            try
            {
            subroutine.build(creep);
            }
            catch
            {
                roleUpgrader.run(creep);
            }
        }

        // if creep is supposed to get energy
        else 
        {
            try 
            {
                subroutine.getFromStorage(creep);
            }
            catch
            {
                subroutine.harvest(creep);
            }
        }
    }
};