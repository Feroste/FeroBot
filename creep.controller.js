const roles = require('creep.roles');
const subroutine = require('creep.subroutines');

module.exports = 
{
    // Run creep roles
    run: function(creep)
    {
        // Initialize creep variables
        if (creep.memory.homeRoom === undefined)
        {creep.memory.homeRoom = creep.pos.roomName;}
        if (creep.memory.targetRoom === undefined)
        {creep.memory.targetRoom = creep.pos.roomName;}

        // if not in target room
        if (creep.memory.role != 'attacker' 
        && creep.memory.targetRoom !== undefined 
        && creep.pos.roomName != creep.memory.targetRoom) 
        {
            // move towards it
            subroutine.moveToRoom(creep);
        }

        else
        {
            if (creep.memory.working !== undefined)
            {
                subroutine.checkWorking(creep);
            }
            
            switch(creep.memory.role)
            {
                default:
                    creep.memory.role = 'harvester'
                    creep.memory.working = false
                    break;

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
                    
                case 'miner':
                    roles.miner(creep);
                    break;
                    
                case 'extractor':
                    roles.extractor(creep);
                    break;
                    
                case 'lorry':
                    roles.lorry(creep);
                    break;
                    
                case 'claimer':
                    roles.claimer(creep);
                    break;
            }
        } 
    }
};