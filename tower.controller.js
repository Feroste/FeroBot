module.exports = 
{
    run: function(tower)
    {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
        var repairTargets = tower.pos.findInRange(FIND_STRUCTURES, 50, 
        {
            filter: function(structure)
            {
                if(structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART)
                {
                    return (structure.hits < 10000)
                }
                else
                {
                    return (structure.hits < structure.hitsMax)
                }
            }
        })
        
        
        if(closestHostile) 
        {
            tower.attack(closestHostile);
        }


        else if(repairTargets.length && tower.energy > 300)
        {
            repairTargets.sort(function(a, b)
            {
                return a.hits - b.hits
            })

            tower.repair(repairTargets[0])
        }
    }
}