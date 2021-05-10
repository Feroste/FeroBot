require('prototype.spawn')();

module.exports = {

    run: function(spawn)
    {
                // Find room
    if (spawn != undefined)
    {
        let room = Game.rooms[spawn.room.name];

                    //---- Find the number of Creeps Alive ----//
        function getCreepCount(role)
        {
            return _.sum(Game.creeps, c => c.pos.roomName == room.name && c.memory.role == role);
        }
        function getCreepCountAll(role)
        {
            return _.sum(Game.creeps, c => c.memory.role == role);
        }

        
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



// Check if Spawning

    let roomSpawns = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_SPAWN});
                if (spawn.spawning && roomSpawns.length > 1)
                {
                    room.memory.queue += 1;
                }


        // New fall back?
        if (_.sum(Game.creeps, c => c.pos.roomName == room.name) == 0)
        {
            name = spawn.createCustomCreep(room.energyAvailable, 'harvester');
        }


        // SET A MINER FOR EACH SOURCE WITH A CONTAINER
        let sources = room.find(FIND_SOURCES);
        for (let source of sources)
        {
            if (!_.some(Game.creeps, c => c.memory.sourceId == source.id))
            {
                let containers = source.pos.findInRange(FIND_STRUCTURES, 1 , {
                    filter: s => s.structureType ==STRUCTURE_CONTAINER
                });

                if(containers.length > 0 && energy > 550)
                {
                    name = spawn.createMiner(source.id);
                    break;
                }

            }
        }


        if (name == undefined)
        {
            // if not enough harvesters
            if (getCreepCount('harvester') < room.memory.minHarvesters) 
            {
                // try to spawn one
                name = spawn.createCustomCreep(energy, 'harvester');
            }


            // if not enough lorries
            else if (getCreepCount('lorry') < room.memory.minLorries) 
            {
                // try to spawn one
                name = spawn.createLorry(450);
            }   
            
            // fall back method
            else if (getCreepCount('harvester') == 0 && getCreepCount('lorry') == 0)
            {
                if (getCreepCount('miner') > 0 &&
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
            else if (flag && getCreepCountAll('attacker') < 4)
            {
                name = spawn.createAttacker();
            }
            else if (flag2 && getCreepCountAll('rangedAttacker') < 2)
            {
                name = spawn.createRangedAttacker();
            }




            // if not enough upgraders
            else if (getCreepCount('upgrader') < room.memory.minUpgraders) 
            {
                // try to spawn one
                name = spawn.createCustomCreep(energy, 'upgrader');
            }
            
            // IF EXTRACTOR
            else if (getCreepCount('extractor') < room.memory.minExtractor)
            {
                name = spawn.createExtractor();
            }
            
            

            // if not enough longDistanceHarvesters for W39N57
            else if (getCreepCountAll('longDistanceHarvester') < room.memory.minW39N57) 
            {
                // try to spawn one
                name = spawn.createLongDistanceHarvester(energy, 4, room.name, 'W39N57', 0);
            }
            
            // if not enough repairers
            else if (getCreepCount('repairer') < room.memory.minRepairers) 
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
            else if (getCreepCount('builder') < room.memory.minBuilders) 
            {
                // try to spawn one
                name = spawn.createCustomCreep(energy, 'builder');
            }
            
            // if not enough wallRepairers
            else if (getCreepCount('wallRepairer') < room.memory.minWallRepairers) 
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
            else if (flag3 && getCreepCount('explorer') < 1)
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
            console.log("Harvesters     : " + getCreepCount('harvester'));
            console.log("Upgraders      : " + getCreepCount('upgrader'));
            console.log("Builders       : " + getCreepCount('builder'));
            console.log("Repairers      : " + getCreepCount('repairer'));
            console.log("Wall Repairers : " + getCreepCount('wallRepairer'));
            if (getCreepCount('miner') > 0)
            {
            console.log("Lorries     : " + getCreepCount('lorry'));
            }
            console.log('-----------------------');
            console.log(" Spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")");
            console.log('========================================');
        }
    }
    }
};