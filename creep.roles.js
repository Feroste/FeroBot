require('require');
const subroutine = require('creep.subroutines');

module.exports =
{
    /*
        // Main Roles
        harvester
        upgrader
        builder
        repairer
        
        // Support Roles
        miner
        extractor
        lorry
        wallRepairer
        longDistanceHarvester
    
        // Niche Roles
        attacker
        claimer
    */

    combine: function(creep)
    {
        function find(room, job)
        {
            return _.sum(Game.creeps, c => c.memory.targetRoom == room && c.job == job)
        }
    // harvester
    // upgrader
    // builder
    // repairer
        if (creep.memory.working === true)
        {
            switch(true)
            {
                case (find(creep.memory.targetRoom, 'store') < room.memory.jobs.storeJobs):
                    break;
            }
        }

        else
        {

        }

        // run the assigned job
        subroutine.run(creep)
    },

    harvester: function(creep)
    {
        // if creep is supposed to transfer energy to the spawn or an extension
        if (creep.memory.working === true) 
        {
            // try storing
            try
            {
                subroutine.store(creep);
            }
            // else switch hats
            catch (e)
            {
                this.builder(creep);
            }
        }

        // if creep is supposed to harvest energy from source
        else 
        {
            try 
            {
                subroutine.getFromStorage(creep);
            }
            catch (e)
            {
                subroutine.harvest(creep);
            }
        }
    },

    upgrader: function(creep)
    {
        // if creep is supposed to transfer energy to the controller
        if (creep.memory.working === true) 
        {
            subroutine.upgrade(creep);
        }


        // if creep is supposed to harvest energy from source
        else 
        {
            try 
            {
                subroutine.getFromStorage(creep);
            }
            catch (e)
            {
                subroutine.harvest(creep);
            }
        }
    },

    builder: function(creep)
    {
        // if creep is supposed to complete a constructionSite
        if (creep.memory.working === true) 
        {
            try
            {
                subroutine.build(creep);
            }
            catch (e)
            {
                this.upgrader(creep);
            }
        }

        // if creep is supposed to get energy
        else 
        {
            try 
            {
                subroutine.getFromStorage(creep);
            }
            catch (e)
            {
                subroutine.harvest(creep);
            }
        }
    },

    repairer: function(creep)
    {
        // if creep is supposed to repair something
        if (creep.memory.working === true) 
        {
            try
            {
                subroutine.repair(creep);
            }
            // if we can't
            catch (e)
            {
                // look for construction sites
                this.builder(creep);
            }
        }
        
        // if creep is supposed to harvest energy from source
        else 
        {
            try 
            {
                subroutine.getFromStorage(creep);
            }
            catch (e)
            {
                subroutine.harvest(creep);
            }
        }
    },

    wallRepairer: function(creep)
    {
        // Check to see if the creep should switch states
        subroutine.checkWorking(creep);

        // if creep is supposed to repair something
        if (creep.memory.working === true) 
        {
            try
            {
                subroutine.wallBuild(creep);
            }
            // if we can't find one
            catch (e)
            {
                // Switch hats
                this.builder(creep);
            }
        }

        // if creep is supposed to harvest energy from source
        else 
        {
            try 
            {
                subroutine.getFromStorage(creep);
            }
            catch (e)
            {
                subroutine.harvest(creep);
            }
        }
    },

    longDistanceHarvester: function(creep)
    {
        // Check to see if the creep should switch states
        subroutine.checkWorking(creep);

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working === true) 
        {
            // if in home room
            if (creep.room.name == creep.memory.homeRoom) 
            {
                // find closest spawn, extension or tower which is not full
                var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, 
                {
                    filter: (s) => (s.structureType === STRUCTURE_SPAWN
                                    || s.structureType === STRUCTURE_EXTENSION
                                    || (s.structureType === STRUCTURE_TOWER && s.energy < 700))
                                    && s.energy < s.energyCapacity
                });

                // if we found one
                if (structure !== undefined) 
                {
                    // try to transfer energy, if it is not in range
                    if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) 
                    {
                        // move towards it
                        creep.moveTo(structure);
                    }
                }
                
                // if full on energy, store
                else
                {
                        
                        if (creep.room.storage !== undefined)
                        {
                            structure = creep.room.storage;
                                if (creep.room.storage.store[RESOURCE_ENERGY] < 300000)
                                {
                                    if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
                                    {
                                        // move towards it
                                        creep.moveTo(structure);
                                    }
                                }
                                else
                                {
                                    this.builder(creep);
                                }
                        }
                        // if storage is full
                        else
                        {
                            this.builder(creep);
                        }
                    }
                
                }
            // if not in home room...
            else 
            {
                // find exit to home room
                var exit = creep.room.findExitTo(creep.memory.homeRoom);
                // and move to exit
                creep.moveTo(creep.pos.findClosestByPath(exit));
            }
        }
        // if creep is supposed to harvest energy from source
        else 
        {
            // if in target room
            if (creep.room.name === creep.memory.targetRoom) 
            {
                subroutine.harvest(creep);
            }
            // if not in target room
            else 
            {
                subroutine.moveToRoom(creep);
            }
        }
    },

    attacker: function(creep)
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

        // Attacker
        else
        {
            // if not in target room
            if (creep.memory.target != undefined && creep.room.name != creep.memory.target) 
            {
                // move towards it
                subroutine.moveToRoom(creep);
            }

            // If in the right room
            else
            {
                try
                {                
                    subroutine.attack(creep);
                }
                catch(e)
                {
                    creep.moveTo(room.controller);
                }
            }
        }
    },

    miner: function(creep)
    {
        // get source
        let source = Game.getObjectById(creep.memory.sourceId);
        
        // find container next to source
        let container = source.pos.findInRange(FIND_STRUCTURES, 1, 
        {
            filter: s => s.structureType == STRUCTURE_CONTAINER
        })[0];

        let link = container.pos.findInRange(FIND_STRUCTURES, 1,
            {
                filter: (s) => (s.structureType == STRUCTURE_LINK)
            })[0];

        if (container == undefined)
        {
            creep.suicide()
        }

        else if (link != undefined && link.store.getFreeCapacity(RESOURCE_ENERGY) > creep.carryCapacity 
            && creep.carry.energy == creep.carryCapacity)
        {
            creep.transfer(link, RESOURCE_ENERGY);
        }
        else if (creep.pos.isEqualTo(container.pos)) 
        {
            if(container.store.getUsedCapacity(RESOURCE_ENERGY) > creep.carryCapacity)
            {
                // try to withdraw energy from container
                creep.withdraw(container, RESOURCE_ENERGY);
            }
            // harvest source
            creep.harvest(source);
        }
        // if creep is not on top of the container
        else 
        {
            // move towards it
            creep.moveTo(container);
                    creep.room.visual.line(creep.pos, container.pos,
                    {color: 'grey', lineStyle: 'dashed'});
        }
    },

    extractor: function(creep)
    {
        if (creep.ticksToLive < 200 && _.sum(creep.carry) == 0)
        {
            creep.suicide();
        }
        
        
        if (creep.memory.working && creep.carryCapacity == _.sum(creep.carry)) 
        {
            creep.memory.working = false;
        }
        if (!creep.memory.working && 0 == _.sum(creep.carry)) 
        {
            creep.memory.working = true;
        }
        
        if (creep.memory.working) 
        {
            subroutine.extract(creep);
        } 
        else 
        {
            if (creep.room.terminal && _.sum(creep.room.terminal.store) < 250000) {
                if (creep.transfer(creep.room.terminal, creep.memory.mineralType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.terminal, {visualizePathStyle: {stroke:'orange', lineStyle:'dotted', opacity: .5}});
                }
            }
            else if (creep.room.storage) 
            {
                if (creep.transfer(creep.room.storage, creep.memory.mineralType) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke:'orange', lineStyle:'dotted', opacity: .5}});
                }
            }
        }
    },

    lorry: function(creep)
    {
        // Check to see if the creep should switch states
        subroutine.checkWorking(creep);

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working === true) 
        {
            // find closest spawn, extension or tower which is not full
            let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, 
            {
                filter: (s) => (s.structureType === STRUCTURE_SPAWN
                            || s.structureType === STRUCTURE_EXTENSION
                            || (s.structureType === STRUCTURE_TOWER && s.energy <= 700)
                            || (s.structureType === STRUCTURE_LAB))
                            && s.energy < s.energyCapacity
            });

            let factory = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_FACTORY)});

            if (structure == undefined && creep.room.terminal != undefined && creep.room.terminal.store[RESOURCE_ENERGY] < 20000)
            {
                structure = creep.room.terminal;
            }
            else if (factory && factory.store[RESOURCE_ENERGY] < 5000)
            {
                structure = factory;
            }
            else if (structure == undefined && creep.room.storage != undefined && creep.room.storage.store[RESOURCE_ENERGY] < 750000) 
            {
                structure = creep.room.storage;
            }
            else if(structure == undefined && creep.room.terminal != undefined && creep.room.terminal.store[RESOURCE_ENERGY] < 200000)
            {
                structure = creep.room.terminal;
            }

            // if we found one
            if (structure != undefined) 
            {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) 
                {
                    // move towards it
                    creep.moveTo(structure, {visualizePathStyle: {stroke:'yellow', lineStyle: 'solid', opacity: .5}});
                }
            }
        }
        // if creep is supposed to get energy
        else 
        {
            let storageLink = creep.room.storage.pos.findInRange(FIND_STRUCTURES, 5,
                {
                    filter: (s) => (s.structureType == STRUCTURE_LINK)
                })[0];
            
            // find closest container
            if (storageLink == undefined)
            {
                let container = creep.pos.findClosestByPath(FIND_STRUCTURES, 
                {
                    filter: s => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 300
                });
    
                if (container != undefined) 
                {
                    // try to withdraw energy, if the container is not in range
                    if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) 
                    {
                        // move towards it
                        creep.moveTo(container, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                    }
                }
            }

            else if (storageLink != undefined && storageLink.store[RESOURCE_ENERGY] > 0)
            {
                if (creep.withdraw(storageLink, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) 
                {
                    // move towards it
                    creep.moveTo(storageLink, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                }
            }

            // if one was found
            else
            {
                container = creep.room.storage;

                // try to withdraw energy, if the container is not in range
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) 
                {
                    // move towards it
                    creep.moveTo(container, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                }
            } 
        }
    },

    claimer: function(creep)
    {
        subroutine.claim(creep);
    }
}