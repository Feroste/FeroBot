const roles = require('creep.roles');
const subroutine = require('creep.subroutines');
const data = require('memory.manager');

module.exports =
{
    run: function(creep)
    {
        // Manage Working Creep Memory
        if(creep.memory.working != undefined && creep.memory.role != 'extractor')
        {
            data.creepMemory(creep);
        }
        
        // Move to targetRoom
        if (creep.memory.targetRoom !== undefined 
        && creep.pos.roomName != creep.memory.targetRoom) 
        {
            // move towards it
            subroutine.moveToRoom(creep);
        }

        // Run creep roles
        else
        {
            try
            {
                switch(creep.memory.role)
                {
                    case 'combine':
                        roles.combine(creep);
                        break;
    
                    case 'harvester':
                        roles.harvester(creep);
                        break;
        
                    case 'upgrader':
                        roles.upgrader(creep)
                        break;
        
                    case 'builder':
                        roles.builder(creep);
                        break;
                        
                    case 'repairer':
                        roles.repairer(creep);
                        break;
                        
                    case 'wallRepairer':
                        roles.wallRepairer(creep);
                        break;
        
                    case 'LDCombine':
                        roles.longDistanceHarvester(creep);
                        break;
                        
                    case 'attacker':
                        roles.attacker(creep);
                        break;
                        
                    case 'rangedAttacker':
                        roles.rangedAttacker(creep);
                        break;
                         
                    case 'miner':
                        roles.miner(creep);
                        break;
                        
                    case 'extractor':
                        roles.extractor(creep);
                        break;

                    case 'scientist':
                        roles.scientist(creep);
                        break;
                        
                    case 'lorry':
                        roles.lorry(creep);
                        break;
                        
                    case 'claimer':
                        roles.claimer(creep);
                        break;
                }
            }
            catch (e)
            {
                if (Memory.Interface.Visualizations.Reports === true)
                {
                    subroutine.say(e);
                }
            }
        } 
    },

    // POWER CREEP
    powerCreep: function(creep)
    {
        // Basic creep memory management
        data.creepMemory(creep);

        // Every Important Structure
        let room = Game.rooms[creep.room.name];
        let storage = room.storage;
        let terminal = room.terminal;
        let powerSpawn = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_POWER_SPAWN});
        let factory = room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_FACTORY});
        
        let sources = room.memory.sources;
        let ungensource = undefined;

        for (i = 0; i < sources.length; i++)
        {
            let s = sources[i];
            let source = Game.getObjectById(s.id);
            if (!source.effects[0])
            {
                ungensource = source;
                break;
            }
        }

        switch(true)
        {
            // Renew when about to die
            case (creep.ticksToLive < 1000):
                if(creep.renew(powerSpawn) === ERR_NOT_IN_RANGE) 
                {creep.moveTo(powerSpawn, {visualizePathStyle: {stroke:'green', lineStyle: 'dotted', opacity: .5}});}
                break;
            
            // Enable Power for room
            case (!room.controller.isPowerEnabled):
                if(creep.enableRoom(room.controller) === ERR_NOT_IN_RANGE)
                {creep.moveTo(room.controller, {visualizePathStyle: {stroke:'red', lineStyle: 'solid', opacity: .5}});}
                break;

                    // Generate OPs
                    case ((creep.powers[PWR_GENERATE_OPS].cooldown == 0) && (creep.store.getUsedCapacity() < creep.store.getCapacity())):
                        creep.usePower(PWR_GENERATE_OPS);
                        break; // Do we need to break?

            // Deposit OPs
            case (creep.store[RESOURCE_OPS] > 190):
                // To Storage
                if(storage.store[RESOURCE_OPS] < 25000 && creep.transfer(storage, RESOURCE_OPS, (creep.store[RESOURCE_OPS] - 100)) === ERR_NOT_IN_RANGE)
                {creep.moveTo(storage, {visualizePathStyle: {stroke:'green', lineStyle: 'dotted', opacity: .5}});}
                // To Terminal
                else if (terminal.store[RESOURCE_OPS] < 50000 && creep.transfer(terminal, RESOURCE_OPS, (creep.store[RESOURCE_OPS] - 100)) === ERR_NOT_IN_RANGE)
                {creep.moveTo(terminal, {visualizePathStyle: {stroke:'green', lineStyle: 'dotted', opacity: .5}});}
                break;

            // Withdraw OPs
            case (creep.store[RESOURCE_OPS] < 100):
                // From Storage
                if(storage.store[RESOURCE_OPS] > 0 && creep.withdraw(storage, RESOURCE_OPS, (100 - creep.store[RESOURCE_OPS])) === ERR_NOT_IN_RANGE)
                {creep.moveTo(storage, {visualizePathStyle: {stroke:'green', lineStyle: 'dashed', opacity: .5}});}
                // From Terminal
                else if (terminal.store[RESOURCE_OPS] > 0 && creep.withdraw(terminal, RESOURCE_OPS, (100 - creep.store[RESOURCE_OPS])) === ERR_NOT_IN_RANGE)
                {creep.moveTo(terminal, {visualizePathStyle: {stroke:'green', lineStyle: 'dashed', opacity: .5}});}
                break;

                // POWERS
                    // Fill extensions
                    case ((room.energyAvailable / room.energyCapacityAvailable) < .8) && (creep.powers[PWR_OPERATE_EXTENSION].cooldown == 0):
                        if(creep.usePower(PWR_OPERATE_EXTENSION, storage) === ERR_NOT_IN_RANGE)
                        {creep.moveTo(storage, {visualizePathStyle: {stroke:'yellow', lineStyle: 'solid', opacity: .5}, range: 3});}
                        break;

                    // Regen Sources
                    case (ungensource && creep.powers[PWR_REGEN_SOURCE].cooldown == 0):
                        if(creep.usePower(PWR_REGEN_SOURCE, ungensource) === ERR_NOT_IN_RANGE)
                        {creep.moveTo(ungensource, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dotted', opacity: .5}, range: 3});}
                        break;

                    // Increase storage at 950k usage
                    case (storage.store.getUsedCapacity() >= 950000) && (creep.powers[PWR_OPERATE_STORAGE].cooldown == 0) && (creep.store[RESOURCE_OPS] >= 100):
                        if(creep.usePower(PWR_OPERATE_STORAGE, storage) === ERR_NOT_IN_RANGE)
                        {creep.moveTo(storage, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}, range: 3});}
                        break;

                    // Power Factory (lvl 5)
                    case ((creep.powers[PWR_OPERATE_FACTORY].level == 5) && (creep.powers[PWR_OPERATE_FACTORY].cooldown == 0) && (factory) && (!factory.effects) && (creep.store[RESOURCE_OPS] >= 100)):
                        if(creep.usePower(PWR_OPERATE_FACTORY, factory) === ERR_NOT_IN_RANGE)
                        {creep.moveTo(factory, {visualizePathStyle: {stroke:'orange', lineStyle: 'dashed', opacity: .5}, range:3});}
                        break;
            
            // Run Power/Ghodium/Energy
            default:
                try
                {
                    roles.scientist(creep);
                }
                catch(ex)
                {
                    
                }
                break;
        }
    }
};