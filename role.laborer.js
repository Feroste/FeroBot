module.exports = 
{
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function(creep) 
    {

        let harvester = function(creep)
        {
            // if creep is bringing energy to the spawn or an extension but has no energy left
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
                creep.say('Working');
            }
    
            // if creep is supposed to transfer energy to the spawn or an extension
            if (creep.memory.working == true) 
            {
                // find closest spawn or extension which is not full
                let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, 
                {
                    // the second argument for findClosestByPath is an object which takes
                    // a property called filter which can be a function
                    // we use the arrow operator to define it
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN
                                    || s.structureType == STRUCTURE_EXTENSION
                                //    || (s.structureType == STRUCTURE_TOWER && s.energy < 310)
                                    )
                                    && s.energy < s.energyCapacity
                });
    
                // if we found one
                if (structure != undefined) 
                {
                    // try to transfer energy, if it is not in range
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
                        // move towards it
                        creep.moveTo(structure, {visualizePathStyle: {stroke:'yellow', lineStyle: 'solid', opacity: .5}});
                    }
                }
                // else upgrade
                else 
                {
                    roleChange.run(creep);
                }
            }
    
    
    
            // if creep is supposed to harvest energy from source
            else 
            {
                let container = creep.pos.findClosestByPath(FIND_STRUCTURES, 
                {
                    filter: s => (s.structureType == STRUCTURE_STORAGE &&
                                    s.store[RESOURCE_ENERGY] > 2000)
                                    || (s.structureType == STRUCTURE_CONTAINER &&
                                    s.store[RESOURCE_ENERGY] >1000)
                });
                let tombstones = creep.pos.findClosestByRange(FIND_TOMBSTONES);
                let dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);


                if(creep.room.terminal != undefined && creep.room.terminal.store[RESOURCE_ENERGY] > 50000)
                {
                    if (creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(creep.room.terminal, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                    } 
                }
    
                else if (container != undefined)
                {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(container, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                    }
                }

                else
                {
                    // find closest source
                    let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) 
                    {
                        // move towards the source
                        creep.moveTo(source, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                        
                    }
                }
            }
        }

        let builder = function(creep)
        {
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

        let upgrader = function(creep)
        {
            // if creep is bringing energy to the controller but has no energy left
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
                creep.say('Upgrading');
            }

            // if creep is supposed to transfer energy to the controller
            if (creep.memory.working == true) 
            {
                // instead of upgraderController we could also use:
                // if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

                // try to upgrade the controller
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) 
                {
                    // if not in range, move towards the controller
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke:'red', lineStyle: 'solid', opacity: .5}});
                }
            }



            // if creep is supposed to harvest energy from source
            else 
            {

                let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => (s.structureType == STRUCTURE_STORAGE &&
                                s.store[RESOURCE_ENERGY] > 2000)
                                || (s.structureType == STRUCTURE_CONTAINER &&
                                s.store[RESOURCE_ENERGY] >1000)
                });


                if(creep.room.terminal != undefined && creep.room.terminal.store[RESOURCE_ENERGY] > 50000)
                {
                    if (creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(creep.room.terminal, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                    } 
                }


                else if (container != undefined)
                {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(container, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                    }
                }
                else
                {
                    // find closest source
                    var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                    const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                    // try to harvest energy, if the source is not in range
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) 
                    {
                        // move towards the source
                        creep.moveTo(source, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                    }
                }
            }
        }



        // if in target room
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target) 
        {
            // find exit to target room
            var exit = creep.room.findExitTo(creep.memory.target);
            // move to exit
            creep.moveTo(creep.pos.findClosestByPath(exit));
        }

        else
        {
            switch(creep.memory.subrole)
            {
                default:
                    creep.memory.subrole = 'harvester';
                    break;

                case 'harvester':
                    harvester(creep);
                    break;

                case 'builder':
                    builder(creep);
                    break;

                case 'upgrader':
                    upgrader(creep);
                    break;
            }
        }






        // // if creep is bringing energy to a structure but has no energy left
        // if (creep.memory.working == true && creep.store[RESOURCE_ZYNTHIUM] == 0) 
        // {
        //     // switch state
        //     creep.memory.working = false;
        //     creep.say('Collecting');
        // }
        // // if creep is harvesting energy but is full
        // else if (creep.memory.working == false && creep.store[RESOURCE_ZYNTHIUM] == creep.store.getCapacity()) 
        // {
        //     // switch state
        //     creep.memory.working = true;
        //     creep.say('Hauling');
        // }

        // // if creep is supposed to transfer energy to a structure
        // if (creep.memory.working == true) {

        //         structure = creep.room.storage;

        //     // if we found one
        //     if (structure != undefined) {
        //         // try to transfer energy, if it is not in range
        //         if (creep.transfer(structure, RESOURCE_ZYNTHIUM) == ERR_NOT_IN_RANGE) {
        //             // move towards it
        //             creep.moveTo(structure, {visualizePathStyle: {stroke:'yellow', lineStyle: 'solid', opacity: .5}});
        //         }
        //     }
        // }






        // // if creep is supposed to get energy
        // else {

        //         container = creep.room.terminal;

        //     // if one was found
        //     if (container != undefined) {
        //         // try to withdraw energy, if the container is not in range
        //         if (creep.withdraw(container, RESOURCE_ZYNTHIUM) == ERR_NOT_IN_RANGE) {
        //             // move towards it
        //             creep.moveTo(container, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
        //         }
        //     }
        // }
    }
};