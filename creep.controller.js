const roles = 
{
    // Main Roles
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    repairer: require('role.repairer'),
    
    // Support Roles
    miner: require('role.miner'),
    extractor: require('role.extractor'),
    lorry: require('role.lorry'),
    wallRepairer: require('role.wallRepairer'),
    longDistanceHarvester: require('role.longDistanceHarvester'),

    // Niche Roles
    attacker: require('role.attacker'),
    rangedAttacker: require('role.rangedAttacker'),
    claimer: require('role.claimer'),
    laborer: require('role.laborer'),
    explorer: require('role.explorer')  
}


module.exports = 
{
    run: function(creep)
    {
        switch(creep.memory.role)
        {
            default:
                creep.memory.role = 'harvester'
                creep.memory.working = false
                break;
            case 'harvester':
                roles.harvester.run(creep);
                break;

            case 'upgrader':
                roles.upgrader.run(creep)
                break;

            case 'builder':
                roles.builder.run(creep);
                break;
                
            case 'repairer':
                roles.repairer.run(creep);
                break;
                
            case 'wallRepairer':
                roles.wallRepairer.run(creep);
                break;
                
            case 'longDistanceHarvester':
                roles.longDistanceHarvester.run(creep);
                break;
                
            case 'attacker':
                roles.attacker.run(creep);
                break;
                
            case 'rangedAttacker':
                roles.rangedAttacker.run(creep);
                break;
                
            case 'miner':
                roles.miner.run(creep);
                break;
                
            case 'extractor':
                roles.extractor.run(creep);
                break;
                
            case 'lorry':
                roles.lorry.run(creep);
                break;
                
            case 'claimer':
                roles.claimer.run(creep);
                break;
                
            case 'laborer':
                roles.laborer.run(creep);
                break;
            
            case 'explorer':
                roles.explorer.run(creep);
                break;
        }
    }
};