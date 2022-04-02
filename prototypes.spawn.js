// create a new function for StructureSpawn
StructureSpawn.prototype.createCustomCreep =
function(energy, roleName, target) 
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
    return this.createCreep(body, undefined, { role: roleName, working: false, targetRoom: target});
};

// Long Distance Harvester
StructureSpawn.prototype.createLongDistanceHarvester =
function (energy, target) 
{
    // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
    var body = [];    
    var numberOfParts = Math.floor(energy / 250);

    for (let i = 0; i < numberOfParts; i++) 
    {
        body.push(WORK);
    }

    for (let i = 0; i < numberOfParts; i++) 
    {
        body.push(CARRY);
    }
    for (let i = 0; i < numberOfParts * 2; i++) 
    {
        body.push(MOVE);
    }

    // create creep with the created body
    return this.createCreep(body, undefined, 
    {
        role: 'longDistanceHarvester',
        targetRoom: target
    });
};
    
// CLAIMER
StructureSpawn.prototype.createClaimer =
function (target, order) 
{
    if (order == 1)
    {
        return this.createCreep([MOVE,CLAIM],undefined, 
                                {role: 'claimer', targetRoom: target, order: order});
    }
    else if(order == 2)
    {
        return this.createCreep([MOVE,CLAIM,MOVE,CLAIM,MOVE,CLAIM,MOVE,CLAIM,MOVE,CLAIM],undefined, 
            {role: 'claimer', targetRoom: target, order: 1});
    }
    else if (order == -1)
    {
        return this.createCreep([MOVE,CLAIM,MOVE,CLAIM], undefined,
                                {role: 'claimer', targetRoom: target, order: order});
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
        targetRoom: target,
    });
};

// RANGED ATTACKER 1100 energy
StructureSpawn.prototype.createRangedAttacker =
function (energy, target)
{
    return this.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK,MOVE, RANGED_ATTACK,MOVE, RANGED_ATTACK,MOVE], undefined, 
                            {role: 'rangedAttacker', targetRoom: target});
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
                { role: 'laborer', working: false, targetRoom: target});
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
                {role: 'extractor', working: true});
}; 

// MINER
StructureSpawn.prototype.createMiner =
function (carry, sourceId) 
{
    if(carry)
    {
        return this.createCreep([WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE],undefined, 
            {carry: carry, role: 'miner', sourceId: sourceId});
    }
    else
    {
        return this.createCreep([WORK,WORK,WORK,WORK,WORK,MOVE],undefined, 
            {carry: carry, role: 'miner', sourceId: sourceId});
    }
};

// Explorer
StructureSpawn.prototype.createExplorer =
function (target) 
{
    return this.createCreep([MOVE],'Explorer', 
                            {role: 'explorer', targetRoom: target});
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