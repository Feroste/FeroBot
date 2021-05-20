module.exports = function() 
{
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreep =
        function(energy, roleName) 
        {
            // create a balanced body as big as possible with the given energy
            var numberOfParts = Math.floor(energy / 200);
            var body = [];
            for (let i = 0; i < numberOfParts; i++) 
            {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++) 
            {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) 
            {
                body.push(MOVE);
            }

            // create creep with the created body and the given role
            return this.createCreep(body, undefined, { role: roleName, working: false });
        };

    // Long Distance Harvester
    StructureSpawn.prototype.createLongDistanceHarvester =
        function (energy, numberOfWorkParts, home, target, sourceIndex) 
        {
            // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
            var body = [];
            for (let i = 0; i < numberOfWorkParts; i++) 
            {
                body.push(WORK);
            }

            // 150 = 100 (cost of WORK) + 50 (cost of MOVE)
            energy -= 150 * numberOfWorkParts;

            var numberOfParts = Math.floor(energy / 100);
            for (let i = 0; i < numberOfParts; i++) 
            {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) 
            {
                body.push(MOVE);
            }

            // create creep with the created body
            return this.createCreep(body, undefined, 
            {
                role: 'longDistanceHarvester',
                home: home,
                target: target,
                sourceIndex: sourceIndex,
                working: false
            });
        };
        
        // CLAIMER
        StructureSpawn.prototype.createClaimer =
            function (target, order) 
            {
                if (order == 1)
                {
                    return this.createCreep([MOVE,CLAIM],undefined, 
                                            {role: 'claimer', target: target, order: order});
                }
                if (order == -1)
                {
                    return this.createCreep([MOVE,CLAIM,MOVE,CLAIM], undefined,
                                            {role: 'claimer', target: target, order: order});
                }
            };
            
        // ATTACKER
        StructureSpawn.prototype.createAttacker =
            function (energy, target)
            {
                // create a body with the specified number of ATTACK parts and one MOVE part per non-MOVE part
                var body = [];

                    
                // 190 = 80 (cost of ATTACK) + 10 (cost of TOUGH) + 100 (cost of MOVE x2)
                let numberOfParts = Math.floor(energy/ 190);

                for (let i = 0; i < numberOfParts; i++) 
                {
                    body.push(TOUGH);
                    body.push(MOVE);
                }

                for (let i = 0; i < numberOfParts; i++) 
                {
                    body.push(ATTACK);
                    body.push(MOVE);
                }
    
                // create creep with the created body
                return this.createCreep(body, undefined, 
                {
                    role: 'attacker',
                    target: target,
                });
            };

        // RANGED ATTACKER
        StructureSpawn.prototype.createRangedAttacker =
        function ()
        {
            return this.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK,MOVE, RANGED_ATTACK,MOVE, RANGED_ATTACK,MOVE], undefined, 
                                    {role: 'rangedAttacker'});
        };

        // HEALER
        StructureSpawn.prototype.createHealer =
        function ()
        {
            /* check RC level
            
            if (this.level == )
            {
                
            }
            
            
            */
            
        };
        
        // Laborer
        StructureSpawn.prototype.createLaborer =
        function (target)
        {
            // create creep with the created body and the role 'laborer'
            return this.createCreep(
            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
            CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
            MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
            MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, 
                        { role: 'laborer', working: false, target: target});
        }; 
        
        // Extractor
        StructureSpawn.prototype.createExtractor =
        function ()
        {
            // create creep with the created body and the role 'extractor'
            return this.createCreep(
            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
            CARRY,CARRY,CARRY,CARRY,
            MOVE,MOVE,MOVE,MOVE,
            MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, 
                        { role: 'extractor', working: false});
        }; 

        // MINER
        StructureSpawn.prototype.createMiner =
        function (sourceId) 
        {
            return this.createCreep([WORK,WORK,WORK,WORK,WORK,MOVE],undefined, 
                                    {role: 'miner', sourceId: sourceId});
        };
        
        // Explorer
        StructureSpawn.prototype.createExplorer =
        function (target) 
        {
            return this.createCreep([MOVE],'Explorer', 
                                    {role: 'explorer', target: target});
        };
        

        // LORRY
            
        StructureSpawn.prototype.createLorry =
        function (energy) 
        {
            // create a body with twice as many CARRY as MOVE parts
            var numberOfParts = Math.floor(energy / 150);
            var body = [];

            for (let i = 0; i < numberOfParts * 2; i++) 
            {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) 
            {
                body.push(MOVE);
            }

            // create creep with the created body and the role 'lorry'
            return this.createCreep(body, undefined, 
                        { role: 'lorry', working: false });
        };
};