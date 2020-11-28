module.exports = 
{
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function(creep) 
    {





        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.working == true && creep.store[RESOURCE_ZYNTHIUM] == 0) 
        {
            // switch state
            creep.memory.working = false;
            creep.say('Collecting');
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.store[RESOURCE_ZYNTHIUM] == creep.store.getCapacity()) 
        {
            // switch state
            creep.memory.working = true;
            creep.say('Hauling');
        }











        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {

                structure = creep.room.storage;

            // if we found one
            if (structure != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ZYNTHIUM) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure, {visualizePathStyle: {stroke:'yellow', lineStyle: 'solid', opacity: .5}});
                }
            }
        }






        // if creep is supposed to get energy
        else {

                container = creep.room.terminal;

            // if one was found
            if (container != undefined) {
                // try to withdraw energy, if the container is not in range
                if (creep.withdraw(container, RESOURCE_ZYNTHIUM) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(container, {visualizePathStyle: {stroke:'yellow', lineStyle: 'dashed', opacity: .5}});
                }
            }
        }
    }
};