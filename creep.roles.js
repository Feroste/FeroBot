require('require');
const subroutine = require('creep.subroutines');

module.exports =
{
    /*
        // Main Roles
        combine
        harvester
        upgrader
        builder
        repairer
        
        // Support Roles
        miner
        extractor
        scientist
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
        var target = creep.memory.targetRoom;

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
            if (target != undefined && creep.room.name != target) 
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

    rangedAttacker: function(creep)
    {
        // Target is assigned in creep memory
        var target = creep.memory.targetRoom;

        // Defender
        if (target == -1)
        {
            subroutine.rangedAttack(creep);
        }

        // Attacker
        else
        {
            // if not in target room
            if (target != undefined && creep.room.name != target) 
            {
                // move towards it
                subroutine.moveToRoom(creep);
            }

            // If in the right room
            else
            {
                try
                {                
                    subroutine.rangedAttack(creep);
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

    scientist: function(creep)
    {
        let storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_STORAGE || s.structureType == STRUCTURE_TERMINAL) && s.store[RESOURCE_POWER] > 0});
        let powerSpawn = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_POWER_SPAWN});
        let nuker = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_NUKER});

        if(creep.store[RESOURCE_POWER] > 0 || creep.store[RESOURCE_GHODIUM] > 0)
        {creep.memory.working = true;}
        else if(creep.store[RESOURCE_POWER] == 0 && creep.store[RESOURCE_GHODIUM] == 0)
        {creep.memory.working = false;}

        if(creep.memory.working == true)
        {
            if (creep.store[RESOURCE_GHODIUM] > 0 && nuker && nuker.store[RESOURCE_GHODIUM] < 5000 
                && creep.transfer(nuker, RESOURCE_GHODIUM) === ERR_NOT_IN_RANGE)
            {
                creep.moveTo(nuker, {visualizePathStyle: {stroke:'white', lineStyle: 'dotted', opacity: .5}});
            }
            else if (powerSpawn && creep.transfer(powerSpawn, RESOURCE_POWER) === ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(powerSpawn, {visualizePathStyle: {stroke:'red', lineStyle: 'dotted', opacity: .5}});
            }
        }
        else
        {
            if (nuker && nuker.store[RESOURCE_GHODIUM] < 5000 
                && Game.rooms[creep.room.name].terminal.store[RESOURCE_GHODIUM] > 0
                && creep.withdraw(Game.rooms[creep.room.name].terminal, RESOURCE_GHODIUM) === ERR_NOT_IN_RANGE)
            {
                creep.moveTo(Game.rooms[creep.room.name].terminal, {visualizePathStyle: {stroke:'white', lineStyle: 'dotted', opacity: .5}});
            }
            else if (storage && creep.withdraw(storage, RESOURCE_POWER) === ERR_NOT_IN_RANGE)
            {
                creep.moveTo(storage, {visualizePathStyle: {stroke:'red', lineStyle: 'dotted', opacity: .5}});
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
            if(creep.store[RESOURCE_ENERGY] > 0)
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
                let nuker = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_NUKER)});
                let powerSpawn = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType === STRUCTURE_POWER_SPAWN) && s.store[RESOURCE_POWER] > 0});
                if (structure == undefined && creep.room.terminal != undefined && creep.room.terminal.store[RESOURCE_ENERGY] < 20000)
                {
                    structure = creep.room.terminal;
                }
                else if (factory && factory.store[RESOURCE_ENERGY] < 5000)
                {
                    structure = factory;
                }
                else if(structure == undefined && nuker && nuker.store[RESOURCE_ENERGY] < nuker.getCapacity)
                {
                    structure = nuker;
                }
                else if (structure == undefined && powerSpawn && powerSpawn.energy < powerSpawn.energyCapacity)
                {
                    structure = powerSpawn;
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
        }
        else if (creep.ticksToLive < 100 && creep.memory.working === false) {creep.suicide();}
        // if creep is supposed to get energy
        // Do we have storage?
        else if (creep.room.storage)
        {
            let storageLink = creep.room.storage.pos.findInRange(FIND_STRUCTURES, 5,
                {
                    filter: (s) => (s.structureType == STRUCTURE_LINK)
                })[0];
            

            // If no storageLink find container
            if (storageLink == undefined)
            {
                let container = creep.pos.findClosestByPath(FIND_STRUCTURES, 
                {
                    filter: s => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] >= creep.carryCapacity
                });
    
                if (container != undefined) 
                {
                    if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(container, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                    }
                }
            }
            // Withdraw from storageLink
            else if (storageLink != undefined && storageLink.store[RESOURCE_ENERGY] > 0)
            {
                if (creep.withdraw(storageLink, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(storageLink, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                }
            }
            // Withdraw from terminal
            else if (creep.room.terminal.store[RESOURCE_ENERGY] > 30000)
            {
                if (creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(creep.room.terminal, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                }
            }
            // Withdraw from storage
            else
            {
                if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                }
            } 
        }
        // Else just look for containers
        else
        {
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, 
            {
                filter: s => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] >= creep.carryCapacity
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
    },

    claimer: function(creep)
    {
        subroutine.claim(creep);
    }
}