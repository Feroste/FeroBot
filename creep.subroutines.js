module.exports =
{
    harvest: function(creep)
    {
        // find closest source
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        // Try to harvest source
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) 
        {
            // if not in range, move towards the source
            creep.moveTo(source, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
            
        }
    },



    
    extract: function(creep)
    {

    },




    getFromStorage: function(creep)
    {

    },




    pickup: function(creep)
    {

    },




    build: function(creep)
    {
        // find closest constructionSite
        let constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        // if one is found
        if (constructionSite != undefined) 
        {
            // try to build, if the constructionSite is not in range
            if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) 
            {
                // move towards the constructionSite
                creep.moveTo(constructionSite, {visualizePathStyle: {stroke:'green', lineStyle: 'solid', opacity: .5}});
            }
        }
    },




    upgrade: function(creep)
    {
        // try to upgrade the controller
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) 
        {
            // if not in range, move towards the controller
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke:'red', lineStyle: 'solid', opacity: .5}});
        }
    },




    repair: function(creep)
    {

    },




    attack: function(creep)
    {

    },




    claim: function(creep)
    {

    },




    moveToRoom: function(creep)
    {
        // find exit to target room
        var exit = creep.room.findExitTo(creep.memory.target);
        // move to exit
        creep.moveTo(creep.pos.findClosestByPath(exit));
    }
}