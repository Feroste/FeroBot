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

        let powerSpawn = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_POWER_SPAWN})

        switch(true)
        {
            // Renew when about to die
            case (creep.ticksToLive < 1000):
                if(creep.renew(powerSpawn) === ERR_NOT_IN_RANGE) 
                {creep.moveTo(powerSpawn, {visualizePathStyle: {stroke:'green', lineStyle: 'dotted', opacity: .5}});}
                break;
            
            // Enable Power for room
            case (!Game.rooms[creep.room.name].controller.isPowerEnabled):
                if(creep.enableRoom(Game.rooms[creep.room.name].controller) === ERR_NOT_IN_RANGE)
                {creep.moveTo(Game.rooms[creep.room.name].controller, {visualizePathStyle: {stroke:'red', lineStyle: 'solid', opacity: .5}});}
                break;
            
            // Generate OPs
            case ((creep.powers[PWR_GENERATE_OPS].cooldown == 0) && (creep.store.getUsedCapacity() < creep.store.getCapacity())):
                creep.usePower(PWR_GENERATE_OPS);
                break;

            // Deposit OPs
            case (creep.store[RESOURCE_OPS] > 90):
                if(creep.transfer(Game.rooms[creep.room.name].storage, RESOURCE_OPS) === ERR_NOT_IN_RANGE)
                {creep.moveTo(Game.rooms[creep.room.name].storage, {visualizePathStyle: {stroke:'green', lineStyle: 'dotted', opacity: .5}});}
                break;
            
            // Run Resources
            default:
                roles.scientist(creep);
                break;
        }
    }
};