const roles = require('creep.roles');
const subroutine = require('creep.subroutines');

module.exports = 
{
    // Run creep roles
    run: function(creep)
    {
        switch(creep.memory.role)
        {
            default:
                creep.memory.role = 'harvester'
                creep.memory.working = false
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
                
            case 'longDistanceHarvester':
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
};