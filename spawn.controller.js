require('spawn.prototype')();

module.exports = 
{
    run: function(spawn)
    {
        // Find room
        let room = Game.rooms[spawn.room.name];

                    //---- Find the number of Creeps Alive ----//
        function getCreepCount(role)
        {
            return _.sum(Game.creeps, c => c.pos.roomName == room.name && c.memory.role == role);
        }
        function find(role, target)
        {
            return _.sum(Game.creeps, c => c.memory.targetRoom == target && c.memory.role == role);
        }

        // energy cap
        let energy = room.energyCapacityAvailable;
        // Hard cap for spawning military [2000]
        let hardCap = (energy - 300)
            if (hardCap <= 0) {hardCap = 0;}
            if (hardCap >= 2000) {hardCap = 2000;}
        // energy limit for work drones
        if (room.memory.energyLimit !== undefined)
        {
            let energyLimit = room.memory.energyLimit;
            if (energy > energyLimit) {energy = energyLimit;}
        }

        // Flag handling
        let flags =
        {
            attackFlag: Game.flags.attackFlag
        }

        // Multiple Spawns
        // Check if Spawning, Wait a tick

        let roomSpawns = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_SPAWN});
            if (spawn.spawning && roomSpawns.length > 1)
            {
                // If more than 1 spawn and its spawning, increase the queue
                room.memory.queue += 1;
            }
                
        // creep name
        let name = undefined;

        // SET A MINER FOR EACH SOURCE WITH A CONTAINER
        let sources = room.find(FIND_SOURCES);
        for (let source of sources)
        {
            if (!_.some(Game.creeps, c => c.memory.sourceId == source.id))
            {
                let containers = source.pos.findInRange(FIND_STRUCTURES, 1 , 
                {
                    filter: s => s.structureType ==STRUCTURE_CONTAINER
                });

                if(containers.length && energy >= 550)
                {
                    name = spawn.createMiner(source.id);
                    if (room.memory.jobs.lorryJobs == 0)
                    {
                        room.memory.jobs.lorryJobs = 1;
                    }
                }
            }
        }

        switch(true)
        {
            // Fall Back Method In Case Economy is Wiped Out
            case (getCreepCount('harvester') == 0 && getCreepCount('lorry') == 0):
                // If a miner still exist, spawn a lorry
                if (getCreepCount('miner') > 0 &&
                (room.storage != undefined && room.energyAvailable >= 300 + 550))
                {
                    name = spawn.createLorry(300);
                }
                // Otherwise spawn a combine ASAP
                else
                {
                    name = spawn.createCustomCreep(room.energyAvailable, 'harvester');
                }
                break;

            case (getCreepCount('attacker') < room.memory.defcon.defenders):
                name = spawn.createAttacker(hardCap, -1);
                break;

            case (getCreepCount('harvester') < room.memory.jobs.storeJobs):
                name = spawn.createCustomCreep(energy, 'harvester');
                break;

            case (getCreepCount('lorry') < room.memory.jobs.lorryJobs):
                name = spawn.createLorry(450);
                break;

            case (flags.attackFlag && find('attacker', flags.attackFlag.pos.roomName) < 3 
            && Game.map.getRoomLinearDistance(room.name, flags.attackFlag.pos.roomName) <= 8):
                name = spawn.createAttacker(hardCap, flags.attackFlag.pos.roomName);
                break;

            case (getCreepCount('upgrader') < room.memory.jobs.upgradeJobs):
                name = spawn.createCustomCreep(energy, 'upgrader');
                break;

            case (getCreepCount('extractor') < room.memory.jobs.scientistJobs):
                name = spawn.createExtractor();
                break;

            case (getCreepCount('repairer') < room.memory.jobs.repairJobs):
                name = spawn.createCustomCreep(energy, 'repairer');
                break;

            case (getCreepCount('builder') < room.memory.jobs.buildJobs):
                name = spawn.createCustomCreep(energy, 'builder');
                break;

            case (getCreepCount('wallRepairer') < room.memory.jobs.wallRepairJobs):
                name = spawn.createCustomCreep(energy, 'wallRepairer');
                break;

            case (room.memory.claimRoom !== undefined):
                name = spawn.createClaimer(room.memory.claimRoom, 1);
                if (!(name < 0)) 
                {
                    delete room.memory.claimRoom;
                }
                break;

            case (room.memory.reserveRoom0 !== undefined):
                if (find('claimer', room.memory.reserveRoom0) < 1)
                {
                    name = spawn.createClaimer(room.memory.reserveRoom0, -1);
                }
                break;

            default:
                name = -1;
                break;
        }

            // ----- // PRINT SPAWN LOG // ----- //
        if (!(name < 0)) 
        {
            console.log('========================================');
            console.log(`Log Results for : ${room.name}`);
            console.log('-----------------------');
            console.log(`Energy Cap = ${energy}`);
            console.log(`Harvesters     : ${getCreepCount('harvester')}`);
            console.log(`Upgraders      : ${getCreepCount('upgrader')}`);
            console.log(`Builders       : ${getCreepCount('builder')}`);
            console.log(`Repairers      : ${getCreepCount('repairer')}`);
            console.log(`Wall Repairers : ${getCreepCount('wallRepairer')}`);
            if (getCreepCount('miner') > 0)
            {
            console.log(`Lorries     : ${getCreepCount('lorry')}`);
            }
            console.log('-----------------------');
            console.log(` Spawned new creep: ${name} (${Game.creeps[name].memory.role})`);
            console.log('========================================');
        }
    }
};