module.exports =
{
    run: function(room)
    {
        // TRANSFER ENERGY FROM SOURCE LINKS TO STORAGE LINK
        if(room.storage)
        {
            // Find Storage link
            let storageLink = room.storage.pos.findInRange(FIND_STRUCTURES, 5,
                {
                    filter: (s) => (s.structureType == STRUCTURE_LINK)
                })[0];
                
            if (storageLink)
            {
                // Find Sources
                let sources = room.find(FIND_SOURCES);
                for (x in sources)
                {
                    let source = sources[x];
                    let sourceLink = source.pos.findInRange(FIND_STRUCTURES, 5,
                        {
                            filter: (s) => (s.structureType == STRUCTURE_LINK && s.store[RESOURCE_ENERGY] > 0)
                        })[0];
        
                    // Transfer link energy
                    if (sourceLink && storageLink && storageLink.store[RESOURCE_ENERGY] < sourceLink.store[RESOURCE_ENERGY])
                    {
                        sourceLink.transferEnergy(storageLink, sourceLink.store[RESOURCE_ENERGY]);
                    }
                }
            }
        }
    }
}