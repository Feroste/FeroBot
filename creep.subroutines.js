// * indicates error handling is available
// ^ indicates an ID can be handed over as arg
module.exports =
{
    // Running this module will execute a behavior based on
    // creep.memory.job.type
    run: function(creep, arg)
    {
        // if not in target room
        if (creep.room.name != creep.memory.target) 
        {
            // move towards it
            subroutine.moveToRoom(creep);
        }
        // Switch statement for job types
        switch(creep.memory.job.type)
        {
            default: 
                this.wander(creep);
                break;
            case 'harvest':
                this.harvest(creep, creep.memory.job.arg);
                break;
            case 'store':
                this.store(creep);
                break;
            case 'extract':
                this.extract(creep);
                break;
            case 'getFromStorage':
                this.getFromStorage(creep);
                break;
            case 'pickup':
                this.pickup(creep);
                break;
            case 'build':
                this.build(creep);
                break;
            case 'upgrade':
                this.upgrade(creep);
                break;
            case 'repair':
                this.repair(creep);
                break;
            case 'wallRepair':
                this.wallRepair(creep);
                break;
            case 'attack':
                this.attack(creep);
                break;
            case 'claim':
                this.claim(creep);
                break;
        }
    },
    
    // Will harvest from source*^
    harvest: function(creep, arg)
    {
        if(arg != undefined)
        {
            var source = arg;
        }
        else
        {
            // find closest source
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        }

        // No source, throw error
        if (source == undefined)
        {throw 'No source available';}

        // Try to harvest source
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) 
        {
            // if not in range, move towards the source
            creep.moveTo(source, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});    
        }
    },

    // Will put energy into spawns and extensions*
    store: function(creep, arg)
    {
        // find closest spawn or extension which is not full
        let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, 
            {
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
            else
            {throw 'Max Energy';}
    },

    // Will extract minerals by deposit ID
    extract: function(creep, arg)
    {
        var target;
        
            if (creep.memory.depositId) 
            {
                target = Game.getObjectById(creep.memory.depositId);
            } else 
            {
                var targets = creep.room.find(FIND_MINERALS);
                target = targets[0];
                creep.memory.depositId = target.id;
                creep.memory.mineralType = target.mineralType;
            }
            if (creep.harvest(target) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(target);
            }
    },

    // Will pull energy from storage if it exceeds a certain amount*
    getFromStorage: function(creep, arg)
    {
        let container = creep.pos.findClosestByPath(FIND_STRUCTURES, 
            {
                filter: s => (s.structureType == STRUCTURE_STORAGE &&
                             s.store[RESOURCE_ENERGY] > 2000)
                             || (s.structureType == STRUCTURE_CONTAINER &&
                             s.store[RESOURCE_ENERGY] >1000)
            });

        if (container != undefined)
        {
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(container, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
            }
        }
        else
        {throw 'No energy available';}
    },

    // Will seek out construction sites and build them*
    build: function(creep, arg)
    {
        // find closest constructionSite
        let constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
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
        else
        {throw 'No construction sites';}
    },

    // Will put energy into the room controller*
    upgrade: function(creep, arg)
    {
        if (creep.room.controller == undefined)
        {throw 'Hallway error';}
        if (!creep.room.controller.my)
        {throw 'Controller not Owned';}
        // try to upgrade the controller
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) 
        {
            // if not in range, move towards the controller
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke:'red', lineStyle: 'solid', opacity: .5}});
        }
    },

    // Will repair any damaged structure except walls (repairs ramparts)*
    repair: function(creep, arg)
    {
            // find closest structure with less than max hits
            // Exclude walls because they have too many max hits
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, 
                {
                    filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
                            && s.structureType != STRUCTURE_RAMPART
                });
    
                // if we find one
                if (structure != undefined) 
                {
                    // try to repair it, if it is out of range
                    if (creep.repair(structure) == ERR_NOT_IN_RANGE) 
                    {
                        // move towards it
                        creep.moveTo(structure);
                    }
                }
                else
                {throw 'No damaged structures';}
    },

    // Will find the weakest wall and repair it, CPU Effecient*
    wallRepair: function(creep, arg)
    {
        // find all walls in the room
        var walls = creep.room.find(FIND_STRUCTURES, 
        {
            filter: (s) => s.structureType == STRUCTURE_WALL
        });

        if (walls == undefined)
        {throw 'No walls found';}
        // Find weakest wall
        var target = _.min(walls, w=> w.hits)

        // if we find a wall that has to be repaired
        if (target != undefined) 
        {
            // try to repair it, if not in range
            if (creep.repair(target) == ERR_NOT_IN_RANGE) 
            {
                // move towards it
                creep.moveTo(target, {visualizePathStyle: {stroke:'grey', lineStyle: 'solid', opacity: .5}});
            }
        }
    },

    // Will loop through walls and repair in percentage chunks*
    wallRepairOld: function(creep, arg)
    {
        // find all walls in the room
        var walls = creep.room.find(FIND_STRUCTURES, 
        {
            filter: (s) => s.structureType == STRUCTURE_WALL
        });

        var target = undefined;

        // loop with increasing percentages
        for (let percentage = 0; percentage <= 1; percentage = percentage + 0.0001)
        {
            // find a wall with less than percentage hits
            for (let wall of walls) 
            {
                if (wall.hits / wall.hitsMax < percentage) {
                    target = wall;
                    break;
                }
            }

            // if there is one
            if (target != undefined) 
            {
                // break the loop
                break;
            }
        }

        // if we find a wall that has to be repaired
        if (target != undefined) 
        {
            // try to repair it, if not in range
            if (creep.repair(target) == ERR_NOT_IN_RANGE) 
            {
                // move towards it
                creep.moveTo(target, {visualizePathStyle: {stroke:'grey', lineStyle: 'solid', opacity: .5}});
            }
        }
        else
        {throw 'Walls fully secure';}
    },

    // Will attack enemy creeps and then enemy spawns [simple]
    attack: function(creep, arg)
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
    },

    // Will use a claim part autonomously depending on owner of room
    claim: function(creep, arg)
    {
        let controller = creep.room.controller;
        var owner = undefined;
        if (controller.owner != undefined)
        {
            // Set Owner
            owner = controller.owner.username;
            if (!controller.my)
            {
            // Set Enemy
            owner = 'ENEMY';
            }
        }
        

        // Decide what to do based on owner of target room
        switch (owner)
        {
            // If neutral, check for claim signal (creep.memory.order = 1)
            default:
                if (creep.memory.order == 1)
                {
                    // CLAIM
                    if(creep.claimController(controller) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(controller);
                    }
                }
                else                     // ADD A TRY CHECK IF INVALID NEUTRAL SO SWITCH TO ATTACK
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

            // If ENEMY, attack
            case 'ENEMY':
                if (creep.attackController(controller) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(controller);
                }
                break;
        }
    },

    // Will move to whatever room is designated in creep.memory.target*
    moveToRoom: function(creep, arg)
    {
        if (creep.memory.target == undefined)
        {throw 'No target room defined';}
        // find exit to target room
        var exit = creep.room.findExitTo(creep.memory.target);
        // move to exit
        creep.moveTo(creep.pos.findClosestByPath(exit));
    },

    // Check to see how much energy creep has, if the creep should switch working states*
    checkWorking: function(creep, arg)
    {
        // Only eco creeps have working memory
        if (creep.memory.working == undefined)
        {throw 'Not an eco creep';}
        // if creep is using energy but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) 
        {
            // switch state
            creep.memory.working = false;
            return false;
        }
        // if creep is getting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) 
        {
            // switch state
            creep.memory.working = true;
            return true;
        }
    },

    pickup: function(creep, arg)
    {
        // let tombstones = creep.pos.findClosestByRange(FIND_TOMBSTONES);
        // let dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
    },

    wander: function(creep, arg)
    {
        // Have creep move around an anchor point.
    }
}