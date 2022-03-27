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
            if (creep.room.name == creep.memory.home) 
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
                var exit = creep.room.findExitTo(creep.memory.home);
                // and move to exit
                creep.moveTo(creep.pos.findClosestByPath(exit));
            }
        }
        // if creep is supposed to harvest energy from source
        else 
        {
            // if in target room
            if (creep.room.name == creep.memory.target) 
            {
                // find source
                var source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex];

                // try to harvest energy, if the source is not in range
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) 
                {
                    // move towards the source
                    creep.moveTo(source);
                }
            }
            // if not in target room
            else 
            {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.target);
                // move to exit
                creep.moveTo(creep.pos.findClosestByPath(exit));
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

        if (container == undefined)
        {
            creep.suicide()
        }

        // if creep is on top of the container
        else if (creep.pos.isEqualTo(container.pos)) 
        {
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
        
        
        if (creep.memory.extracting && creep.carryCapacity == _.sum(creep.carry)) 
        {
            creep.memory.extracting = false;
        }
        if (!creep.memory.extracting && 0 == _.sum(creep.carry)) 
        {
            creep.memory.extracting = true;
        }
        
        if (creep.memory.extracting) 
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
                            || (s.structureType === STRUCTURE_LAB && s.energy <= 1700))
                            && s.energy < s.energyCapacity
            });

            if (structure == undefined && creep.room.terminal != undefined && creep.room.terminal.store[RESOURCE_ENERGY] < 20000)
            {
                structure = creep.room.terminal;
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
            // find closest container
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, 
            {
                filter: s => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 300
            });

            if (container == undefined) 
            {
                container = creep.room.storage;
            }

            // if one was found
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