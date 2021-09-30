// * indicates error handling is available
// ^ indicates an ID can be handed over as arg
module.exports =
{
    // Running this module will execute a behavior based on
    // creep.memory.job.type*
    run: function(creep)
    {
        if(!creep.memory.job)
        {throw 'No job';}
        // if not in target room
        if (creep.room.name != creep.memory.job.room) 
        {
            // move towards it
            subroutine.moveToRoom(creep, creep.memory.job.room);
        }
        // Switch statement for job types
        switch(creep.memory.job.type)
        {
            default: 
                this.wander(creep);
                creep.say('Job type invalid');
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
        // Check for arg
        if(arg)
        {
            var source = Game.getObjectById(arg);
        }

        // Else find Closest source
        else
        {
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        }

        // No source, throw error
        if (!source)
        {throw 'No source available';}

        // Try to harvest source
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) 
        {
            // if not in range, move towards the source
            creep.moveTo(source, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});    
        }
    },

    // Will put energy into spawns and extensions*^
    store: function(creep, arg)
    {
        // Check for arg
        if(arg)
        {
            var structure = Game.getObjectById(arg);
        }

        else
        {
            // find closest spawn or extension which is not full
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, 
                {
                    filter: (s) => (s.structureType === STRUCTURE_SPAWN
                                    || s.structureType === STRUCTURE_EXTENSION
                                //    || (s.structureType == STRUCTURE_TOWER && s.energy < 310)
                                    )
                                    && s.energy < s.energyCapacity
                });
        }

        if (!structure) 
        {throw 'Max Energy';}

        // if we found one
        // try to transfer energy
        if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) 
        {
            // move towards it
            creep.moveTo(structure, {visualizePathStyle: {stroke:'yellow', lineStyle: 'solid', opacity: .5}});
        }
    },

    // Will extract minerals by deposit ID*^
    extract: function(creep, arg)
    {
        // Check for arg
        if (arg)
        {
            var target = Game.getObjectById(arg);
        }

        // No arg, find minerals
        else
        {
            // Check for old depositID
            target = Game.getObjectById(creep.memory.depositId);
            
            // Find minerals
            if (!target)
            {
                var targets = creep.room.find(FIND_MINERALS);
                target = targets[0];
                creep.memory.depositId = target.id;
                creep.memory.mineralType = target.mineralType;
            }
        }

        if(!target)
        {throw 'Cant find minerals';}
        
        if (creep.harvest(target) === ERR_NOT_IN_RANGE) 
        {
            creep.moveTo(target);
        }
    },

    // Will pull energy from storage if it exceeds a certain amount*^
    getFromStorage: function(creep, arg)
    {
        // Check for arg
        if (arg)
        {
            var container = Game.getObjectById(arg);
        }

        // No arg, find available storage
        else
        {
            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, 
                {
                    filter: s => (s.structureType === STRUCTURE_STORAGE &&
                                s.store[RESOURCE_ENERGY] > 2000)
                                || (s.structureType === STRUCTURE_CONTAINER &&
                                s.store[RESOURCE_ENERGY] >1000)
                });
        }

        // Try getting from storage
        if (container != undefined)
        {
            if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
            {
                creep.moveTo(container, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
            }
        }
        else
        {throw 'No energy available';}
    },

    // Will seek out construction sites and build them*^
    build: function(creep, arg)
    {
        if (arg)
        {
            var constructionSite = Game.getObjectById(arg);
        }

        else
        {
            // find closest constructionSite
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        }
        
        if(!constructionSite)
        {throw 'No construction sites';}

        // if one is found
        // try to build, if the constructionSite is not in range
        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) 
        {
            // move towards the constructionSite
            creep.moveTo(constructionSite, {visualizePathStyle: {stroke:'green', lineStyle: 'solid', opacity: .5}});
        }
    },

    // Will put energy into the room controller*
    upgrade: function(creep)
    {
        if (creep.room.controller === undefined)
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

    // Will repair any damaged structure except walls*^
    repair: function(creep, arg)
    {
        if (arg)
        {
            var structure = Game.getObjectById(arg);
        }

        else
        {
            // find closest structure with less than max hits
            // Exclude walls because they have too many max hits
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, 
                {
                    filter: (s) => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL
                            && s.structureType !== STRUCTURE_RAMPART
                });
    
        }

        if(!structure)
        {throw 'No damaged structures';}

        // if we find one
        // try to repair it, if it is out of range
        if (creep.repair(structure) === ERR_NOT_IN_RANGE) 
        {
            // move towards it
            creep.moveTo(structure);
        }

    },

    // Will find the weakest wall or rampart and repair it, CPU Effecient*
    wallRepair: function(creep)
    {
        // find all walls in the room
        var walls = creep.room.find(FIND_STRUCTURES, 
        {
            filter: (s) => s.structureType === STRUCTURE_WALL
                        || s.structureType === STRUCTURE_RAMPART
        });

        if (walls == undefined)
        {throw 'No walls found';}
        // Find weakest wall
        var target = _.min(walls, w=> (w.hits))

        // if we find a wall that has to be repaired
        if (target !== undefined) 
        {
            // try to repair it, if not in range
            if (creep.repair(target) === ERR_NOT_IN_RANGE) 
            {
                // move towards it
                creep.moveTo(target, {visualizePathStyle: {stroke:'grey', lineStyle: 'solid', opacity: .5}});
            }
        }
    },

    // Will loop through walls and repair in percentage chunks* [BAD]
    wallBuild: function(creep)
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
            if (target !== undefined) 
            {
                // break the loop
                break;
            }
        }

        // if we find a wall that has to be repaired
        if (target !== undefined) 
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

    // Will loop through ramparts and repair in percentage chunks* [BAD]
    rampartBuild: function(creep)
    {
        // find all ramparts in the room
        var ramparts = creep.room.find(FIND_STRUCTURES, 
        {
            filter: (s) => s.structureType === STRUCTURE_RAMPART
        });

        var target = undefined;

        // loop with increasing percentages
        for (let percentage = 0; percentage <= 1; percentage = percentage + 0.0001)
        {
            // find a rampart with less than percentage hits
            for (let rampart of ramparts) 
            {
                if (rampart.hits / rampart.hitsMax < percentage) {
                    target = rampart;
                    break;
                }
            }

            // if there is one
            if (target !== undefined) 
            {
                // break the loop
                break;
            }
        }

        // if we find a rampart that has to be repaired
        if (target !== undefined) 
        {
            // try to repair it, if not in range
            if (creep.repair(target) === ERR_NOT_IN_RANGE) 
            {
                // move towards it
                creep.moveTo(target, {visualizePathStyle: {stroke:'grey', lineStyle: 'solid', opacity: .5}});
            }
        }
        else
        {throw 'Ramparts fully secure';}
    },

    // Will attack enemy creeps and then enemy spawns [simple]*^
    attack: function(creep, arg)
    {
        if (arg)
        {
            var target = Game.getObjectById(arg)
        }

        else
        {
            let enemyspawn = creep.room.find(FIND_HOSTILE_SPAWNS);
            let hostiles = creep.room.find(FIND_HOSTILE_CREEPS);

            var target = creep.pos.findClosestByPath(hostiles);
            if(!target)
            {
                var target = creep.pos.findClosestByPath(enemyspawn);
            }
        }

        if(!target)
        {throw 'No hostiles found';}

        // Try to attack
        if (creep.attack(target) === ERR_NOT_IN_RANGE) 
        {
            creep.moveTo(target);
        }
    },

    // Will use a claim part autonomously depending on owner of room
    claim: function(creep)
    {
        let controller = creep.room.controller;
        var owner = undefined;
        if (controller.owner !== undefined)
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
                    if(creep.claimController(controller) === ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(controller);
                    }
                }
                else                     // ADD A TRY CHECK IF INVALID NEUTRAL SO SWITCH TO ATTACK
                {
                    // RESERVE [Currenty delete claim memory to reserve]
                    if(creep.reserveController(controller) === ERR_NOT_IN_RANGE) 
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
                if (creep.attackController(controller) === ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(controller);
                }
                break;
        }
    },

    // Will move to whatever room is designated in creep.memory.target*^
    moveToRoom: function(creep, arg)
    {
        if (arg)
        {
            var exit = creep.room.findExitTo(arg);
        }

        else
        {
            // find exit to target room
            var exit = creep.room.findExitTo(creep.memory.target);
        }

        if (!exit)
        {throw 'No target room defined';}

        // move to exit
        creep.moveTo(creep.pos.findClosestByPath(exit));
    },

    // Check to see how much energy creep has, if the creep should switch working states*
    checkWorking: function(creep)
    {
        // Most creeps should have working memory
        if (creep.memory.working === undefined)
        {throw 'Rogue Creep';}
        // if creep is using energy but has no energy left
        if (creep.memory.working === true && creep.carry.energy == 0) 
        {
            // switch state
            creep.memory.working = false;
            delete creep.memory.job
            return false;
        }
        // if creep is getting energy but is full
        else if (creep.memory.working === false && creep.carry.energy == creep.carryCapacity) 
        {
            // switch state
            creep.memory.working = true;
            delete creep.memory.job
            return true;
        }
    },

    // Returns number of specified body part
    checkForPart: function(creep, arg)
    {
        let count = 0;
        for (partNumber of creep.body)
        {
            let partType = partNumber.type;
            if (partType == arg)
            {
                count += 1;
            }
        }
        return count;
    },

    // Will pickup resources [WIP]
    pickup: function(creep, arg)
    {
        // let tombstones = creep.pos.findClosestByRange(FIND_TOMBSTONES);
        // let dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
    },

    // Will wander around origin [WIP]
    wander: function(creep)
    {
        // Have creep move around an anchor point.
    },

    // Generates random 4 character IDs
    idGenerator: () => 
    {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
}