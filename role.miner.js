module.exports = {
    // a function to run the logic for this role
    run: function (creep) {
        // get source
        let source = Game.getObjectById(creep.memory.sourceId);
        // find container next to source
        let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
        })[0];

        if (container == undefined)
        {
            creep.suicide()
        }

        // if creep is on top of the container
        else if (creep.pos.isEqualTo(container.pos)) {
            // harvest source
            creep.harvest(source);
        }
        // if creep is not on top of the container
        else {
            // move towards it
            creep.moveTo(container);
                    creep.room.visual.line(creep.pos, container.pos,
                    {color: 'grey', lineStyle: 'dashed'});
        }
    }
};