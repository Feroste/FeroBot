module.exports =
{
    run: function(room)
    {
        if(room.storage)
        {
            // INTITILIAZE LINK MEMORY
            let storageLink = room.storage.pos.findInRange(FIND_STRUCTURES, 5,
                {
                    filter: (s) => (s.structureType == STRUCTURE_LINK)
                })[0];
                
            if (storageLink)
            {
                let sources = room.find(FIND_SOURCES);
                for (x in sources)
                {
                    let source = room.find(FIND_SOURCES)[x];
                    let sourceLink = source.pos.findInRange(FIND_STRUCTURES, 5,
                        {
                            filter: (s) => (s.structureType == STRUCTURE_LINK && s.store[RESOURCE_ENERGY] > 300)
                        })[0];
        
                    if (sourceLink && storageLink && storageLink.store[RESOURCE_ENERGY] < sourceLink.store[RESOURCE_ENERGY])
                    {
                        sourceLink.transferEnergy(storageLink, sourceLink.store[RESOURCE_ENERGY]);
                    }
                }
            }
        }
    }
}