module.exports = 
{
    run: function(creep) 
    {   
        // Check for explore flag
            let flag = Game.flags.explore;
       
                creep.moveTo(flag);
    }
};