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
            // find exit to target room
            var exit = creep.room.findExitTo(creep.memory.target);
            // move to exit
            creep.moveTo(creep.pos.findClosestByPath(exit));
            // return the function to not do anything else
            return;
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
            // find closest constructionSite
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            // if one is found
            if (constructionSite != undefined) 
            {
                // try to build, if the constructionSite is not in range
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) 
                {
                    // move towards the constructionSite
                    creep.moveTo(constructionSite, {visualizePathStyle: {stroke:'green', lineStyle: 'solid', opacity: .5}});
                }
            }
            // if no constructionSite is found
            else 
            {
                // go upgrading the controller
                roleUpgrader.run(creep);
            }
        }
        // if creep is supposed to get energy
        else 
        {
            // find closest container
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, 
            {
                filter: s => (s.structureType == STRUCTURE_STORAGE &&
                             s.store[RESOURCE_ENERGY] > 2000)
                             || (s.structureType == STRUCTURE_CONTAINER &&
                             s.store[RESOURCE_ENERGY] >1000)
            });
            // if one was found
            if (container != undefined) 
            {
                // try to withdraw energy, if the container is not in range
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    // move towards it
                    creep.moveTo(container, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                }
            }
            else 
            {
                // find closest source
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                // try to harvest energy, if the source is not in range
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) 
                {
                    // move towards it
                    creep.moveTo(source, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                }
            }
        }
    }
};