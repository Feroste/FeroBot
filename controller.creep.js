const roles = require('creep.roles');
const subroutine = require('creep.subroutines');
const data = require('memory.manager');

module.exports =
{
    // Run creep roles
    run: function(creep)
    {
        // Manage Working Creep Memory
        if(creep.memory.working != undefined && creep.memory.role != 'extractor')
        {
            data.creepMemory(creep);
        }
        
        // if not in target room
        if (creep.memory.targetRoom !== undefined 
        && creep.pos.roomName != creep.memory.targetRoom) 
        {
            // move towards it
            subroutine.moveToRoom(creep);
        }

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
    }
};