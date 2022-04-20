// * indicates error handling is available
// ^ indicates an ID can be handed over as arg
module.exports =
{
    // Running this module will execute a behavior based on
    // creep.memory.job*
    run: function(creep)
    {
        if(!creep.memory.job)
        {throw 'No job';}

        // Switch statement for job types
        switch(creep.memory.job)
        {
            default: 
                this.wander(creep);
                creep.say('Job type invalid');
                break;
            case 'harvest':
                this.harvest(creep, creep.memory.targetID);
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
            case 'pickup':
                this.pickup(creep);
                break;
            case 'wander':
                this.wander(creep);
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
            creep.moveTo(source, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}, range: 1, reusePath: 10});    
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
            creep.moveTo(structure, {visualizePathStyle: {stroke:'yellow', lineStyle: 'solid', opacity: .5}, range: 1,  reusePath: 10});
        }
    },

    // Will transfer any resource creep is carrying [WIP]
    storeResource: function(creep, arg)
    {
        switch(true)
        {
            case (creep.store[RESOURCE_ENERGY] > 0):
                if(creep.transfer(arg, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(arg);
                }
                break;
            case (creep.store[RESOURCE_POWER] > 0):
                if(creep.transfer(arg, RESOURCE_POWER) === ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(arg);
                }
                break;


            case (creep.store[RESOURCE_HYDROGEN] > 0):
                if(creep.transfer(arg, RESOURCE_HYDROGEN) === ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(arg);
                }
                break;
            case (creep.store[RESOURCE_OXYGEN] > 0):
                if(creep.transfer(arg, RESOURCE_OXYGEN) === ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(arg);
                }
                break;
            case (creep.store[RESOURCE_UTRIUM] > 0):
                if(creep.transfer(arg, RESOURCE_UTRIUM) === ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(arg);
                }
                break;
            case (creep.store[RESOURCE_LEMERGIUM] > 0):
                if(creep.transfer(arg, RESOURCE_LEMERGIUM) === ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(arg);
                }
                break;
            case (creep.store[RESOURCE_KEANIUM] > 0):
                if(creep.transfer(arg, RESOURCE_KEANIUM) === ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(arg);
                }
                break;
            case (creep.store[RESOURCE_ZYNTHIUM] > 0):
                if(creep.transfer(arg, RESOURCE_ZYNTHIUM) === ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(arg);
                }
                break;
            case (creep.store[RESOURCE_CATALYST] > 0):
                if(creep.transfer(arg, RESOURCE_CATALYST) === ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(arg);
                }
                break;      
            case (creep.store[RESOURCE_GHODIUM] > 0):
                if(creep.transfer(arg, RESOURCE_GHODIUM) === ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(arg);
                }
                break;
                
                
                //.........
                
                
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
            creep.moveTo(target, {visualizePathStyle: {stroke:'orange', lineStyle:'dotted', opacity: .5}});
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
            if(creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] > 50000)
            {
                if (creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(creep.room.terminal, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}, range: 1,  reusePath: 10});
                } 
            }
            else
            {
                var container = creep.pos.findClosestByPath(FIND_STRUCTURES, 
                    {
                        filter: s => (s.structureType === STRUCTURE_STORAGE &&
                                    s.store[RESOURCE_ENERGY] > 2000)
                                    || (s.structureType === STRUCTURE_CONTAINER &&
                                    s.store[RESOURCE_ENERGY] >1000)
                    });


                if (container == undefined) {throw 'No energy available';}
            }
        }

        // Try getting from storage
        if (container != undefined)
        {
            if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
            {
                creep.moveTo(container, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}, range: 1,  reusePath: 10});
            }
        }
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
            creep.moveTo(constructionSite, {visualizePathStyle: {stroke:'green', lineStyle: 'solid', opacity: .5}, range: 3,  reusePath: 10});
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
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke:'red', lineStyle: 'solid', opacity: .5}, range: 3,  reusePath: 10});
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
            var walls = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL});
            let enemyspawn = creep.room.find(FIND_HOSTILE_SPAWNS);
            let hostiles = creep.room.find(FIND_HOSTILE_CREEPS);

            var target = creep.pos.findClosestByRange(hostiles);
            if(!target)
            {
                var target = creep.pos.findClosestByRange(enemyspawn);
            }
        }

        if(!target)
        {throw 'No hostiles found';}

        // Try to attack
        if (creep.attack(target) === ERR_NOT_IN_RANGE) 
        {
            console.log(creep.moveTo(target));
        }
    },

    rangedAttack: function(creep, arg)
    {
        if (arg)
        {
            var target = Game.getObjectById(arg)
        }

        else
        {
            var hostiles = creep.find(FIND_HOSTILE_CREEPS);
            var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            if(targets.length > 0) {
                creep.rangedAttack(targets[0]);
            }
            else if (hostiles)
            {
                creep.moveTo(creep.pos.findClosestByRange(hostiles));
            }
        }
    },

    // Will use a claim part autonomously depending on owner of room
    claim: function(creep)
    {
        var controller = creep.room.controller;
        if (!creep.pos.inRangeTo(controller,1))
        {
            creep.moveTo(controller);
        }
        else
        {
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
                        creep.claimController(controller);
                    }
                    else                     // ADD A TRY CHECK IF INVALID NEUTRAL SO SWITCH TO ATTACK
                    {
                        // RESERVE [Currenty delete claim memory to reserve]
                        creep.reserveController(controller);
                    }
                    break;

                // If my room, sign it
                case 'Feroste':
                    creep.signController(controller, "[WIP]");
                    break;

                // If ENEMY, attack
                case 'ENEMY':
                    creep.attackController(controller);
                    break;
            }
        }
    },

    // Will say a string of any length over several ticks [WIP]
    say: function(creep, arg)
    {
        creep.say(arg);


        // if (!creep.memory.saying) creep.memory.saying = {};

        // const currentHash = hashCode(arg);
        // const sayData = creep.memory.saying;
        // if (!sayData.text || sayData.hash !== currentHash) {
        //   sayData.text = arg;
        //   sayData.hash = currentHash;
        // }
      
        // creep.say(sayData.substring(0, 10));
        // sayData.text = sayData.text.substring(10);
        // return Boolean(sayData.text); // continue talking?




        // if(arg.length > 10)
        // {
        //     if(creep.memory.string != arg) 
        //     {
        //         creep.memory.string = arg;
        //         creep.memory.saying = 0;
        //     }
        //     string = creep.memory.string
        //     let parts = string.length / 10;
        //     if (creep.memory.saying === undefined)
        //     {creep.memory.saying = 0;}
        //     for (let i = 0; i < parts; i++)
        //     {
        //         if (i == creep.memory.saying)
        //         {
        //             let index1 = creep.memory.saying * 9
        //             let index2 = 9 * (creep.memory.saying + 1);
        //             part = string.slice(index1, index2);
        //             creep.say(part);
        //             creep.memory.saying += 1;
        //             break;
        //         }
        //     }

        //     if(creep.memory.saying > parts)
        //     {delete creep.memory.saying;
        //      delete creep.memory.string;}
        // }
        // else
        // {
        //     creep.say(arg);
        // }
    },

    // Will move using custom pathfinding and unique path visuals [WIP]
    move: function(creep, target, arg)
    {

        switch(creep.memory.role)
        {
            case 'harvester':
                creep.moveTo(target);
                break;

            default:
                creep.moveTo(target);
                break;
        }

    },

    // Will move to whatever room is designated in creep.memory.target*^
    moveToRoom: function(creep, arg)
    {
        if (arg)
        {
            if (creep.room.name == arg)
            {throw 'Already in Room';}
            var exit = creep.room.findExitTo(arg);
        }

        else
        {
            if (creep.memory.targetRoom === undefined)
            {throw 'No target Room';}
            if (creep.pos.roomName == creep.memory.targetRoom)
            {throw 'Already in Room';}
            // find exit to target room
            var exit = creep.room.findExitTo(creep.memory.targetRoom);
        }
        if (!exit)
        {throw 'No Exit found';}

        // move to exit                                 SWAMP COST HOTFIX
        creep.moveTo(creep.pos.findClosestByPath(exit), {visualizePathStyle: {stroke:'white', lineStyle: 'dotted', opacity: .5}, reusePath: 50, plainCost: 5, swampCost: 5});
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
            if(Memory.Interface.Visualizations.Reports === true)
            {
                this.say(creep, 'Not Working');
            }
            // switch state
            creep.memory.working = false;
            return false;
        }
        // if creep is getting energy but is full
        else if (creep.memory.working === false && creep.carry.energy == creep.carryCapacity) 
        {
            if(Memory.Interface.Visualizations.Reports === true)
            {
                this.say(creep, 'Working');
            }
            // switch state
            creep.memory.working = true;
            return true;
        }
    },

    // Returns number of specified body part
    checkForPart: function(creep, partType)
    {
        return _.filter(creep.body, part => part.type == partType).length;
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
    }
}