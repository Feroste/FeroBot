require('prototype.spawn')();

module.exports = {

    run: function(spawn)
    {
                // Find room
        let room = Game.rooms[spawn.room.name];

        // find creeps in the room
        let creepsInRoom = room.find(FIND_MY_CREEPS);


                    //---- Count the number of Creeps Alive ----//
        let numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role == 'harvester');
        let numberOfUpgraders = _.sum(creepsInRoom, (c) => c.memory.role == 'upgrader');
        let numberOfBuilders = _.sum(creepsInRoom, (c) => c.memory.role == 'builder');
        let numberOfRepairers = _.sum(creepsInRoom, (c) => c.memory.role == 'repairer');
        let numberOfWallRepairers = _.sum(creepsInRoom, (c) => c.memory.role == 'wallRepairer');
        let numberOfMiners = _.sum(creepsInRoom, (c) => c.memory.role == 'miner');
        let numberOfExtractors = _.sum(creepsInRoom, (c) => c.memory.role == 'extractor');
        let numberOfLorries = _.sum(creepsInRoom, (c) => c.memory.role == 'lorry');

        let numberOfAttackers = _.sum(Game.creeps, (c) => c.memory.role == 'attacker');
        let numberOfRangedAttackers = _.sum(Game.creeps, (c) => c.memory.role == 'rangedAttacker');
        let numberOfExplorers = _.sum(Game.creep, (c) => c.memory.role == 'explorer');
        let numberOfLongDistanceHarvestersW39N57 = _.sum(Game.creeps, (c) =>
            c.memory.role == 'longDistanceHarvester' && c.memory.target == 'W39N57');




        // energy cap
        let energy = room.energyCapacityAvailable;
        // 1000 limit to keep 5 work drones
        if (room.memory.energyLimit != undefined)
        {
            let energyLimit = room.memory.energyLimit;
            if (energy > energyLimit) {energy = energyLimit;}
        }
        // attackFlag and attack2Flag
        let flag = Game.flags.attackFlag;
        let flag2 = Game.flags.attack2Flag;
        let flag3 = Game.flags.explore;
        // creep name
        let name = undefined;

        // SET A MINER FOR EACH SOURCE WITH A CONTAINER
        let sources = room.find(FIND_SOURCES);
        for (let source of sources)
        {
            if (!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceId == source.id))
            {
                let containers = source.pos.findInRange(FIND_STRUCTURES, 1 , {
                    filter: s => s.structureType ==STRUCTURE_CONTAINER
                });

                if(containers.length > 0)
                {
                    name = spawn.createMiner(source.id);
                    break;
                }

            }
        }


        if (name == undefined)
        {
            // if not enough harvesters
            if (numberOfHarvesters < room.memory.minHarvesters) 
            {
                // try to spawn one
                name = spawn.createCustomCreep(energy, 'harvester');
            }


            // if not enough lorries
            else if (numberOfLorries < room.memory.minLorries) 
            {
                // try to spawn one
                name = spawn.createLorry(450);
            }   
            
            // fall back method
            else if (numberOfHarvesters == 0 && numberOfLorries == 0)
            {
                if (numberOfMiners > 0 &&
                    (room.storage != undefined && room.energyAvailable >= 300 + 550))
                {
                    name = spawn.createLorry(300);
                }
                else
                {
                    name = spawn.createCustomCreep(room.energyAvailable, 'harvester');
                }
            }





            // If there's an attack flag, rally troop x3
            else if (flag && numberOfAttackers < 3)
            {
                name = spawn.createAttacker();
            }
            else if (flag2 && numberOfRangedAttackers < 2)
            {
                name = spawn.createRangedAttacker();
            }




            // if not enough upgraders
            else if (numberOfUpgraders < room.memory.minUpgraders) 
            {
                // try to spawn one
                name = spawn.createCustomCreep(energy, 'upgrader');
            }
            
            // IF EXTRACTOR
            else if (numberOfExtractors < room.memory.minExtractor)
            {
                name = spawn.createExtractor();
            }
            
            

            // if not enough longDistanceHarvesters for W39N57
            else if (numberOfLongDistanceHarvestersW39N57 < room.memory.minW39N57) 
            {
                // try to spawn one
                name = spawn.createLongDistanceHarvester(energy, 4, room.name, 'W39N57', 0);
            }
            
            // if not enough repairers
            else if (numberOfRepairers < room.memory.minRepairers) 
            {
                // try to spawn one
                name = spawn.createCustomCreep(energy, 'repairer');
            }

            //  if there is a labor order defined
            else if (room.memory.labor != undefined) 
            {
                //  try to spawn a laborer
                name = spawn.createLaborer(room.memory.labor);
                    
                //   if that worked
                if (!(name < 0)) 
                {
                //  delete the labor order
                    delete room.memory.labor;
                }
            }
            
            // if not enough builders
            else if (numberOfBuilders < room.memory.minBuilders) 
            {
                // try to spawn one
                name = spawn.createCustomCreep(energy, 'builder');
            }
            
            // if not enough wallRepairers
            else if (numberOfWallRepairers < room.memory.minWallRepairers) 
            {
                // try to spawn one
                name = spawn.createCustomCreep(energy, 'wallRepairer');
            }
            
            
            //  if there is a claim order defined
        else if (room.memory.claimRoom != undefined) 
        {
            //  try to spawn a claimer
            name = spawn.createClaimer(room.memory.claimRoom);
                
            //   if that worked
            if (!(name < 0)) 
            {
            //  delete the claim order
                delete room.memory.claimRoom;
            }
        }
        
        // If there's an explore flag
            else if (flag3 && numberOfExplorers < 1)
            {
                name = spawn.createExplorer();
            } 
            
            else
            {
                name = -1;
            }
        }
        
            // ----- // PRINT SPAWN LOG // ----- //
        if (!(name < 0)) 
        {
            console.log('========================================');
            console.log('Log Results for : ' + room.name);
            console.log('-----------------------');
            console.log("Energy Cap = " + energy);
            console.log("Harvesters     : " + numberOfHarvesters);
            console.log("Upgraders      : " + numberOfUpgraders);
            console.log("Builders       : " + numberOfBuilders);
            console.log("Repairers      : " + numberOfRepairers);
            console.log("Wall Repairers : " + numberOfWallRepairers);
            if (numberOfMiners > 0)
            {
            console.log("Lorries     : " + numberOfLorries);
            }
            console.log('-----------------------');
            console.log(" Spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")");
            console.log('========================================');
        }
    }
};