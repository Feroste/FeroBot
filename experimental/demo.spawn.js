module.exports =
{
    /*
    import job manager
    if there are jobs that don't have creeps push requests
    put 5 tick delay so living creeps can switch

    spawn requests take a priority job

    what body is needed?
        working?
        home room
    Assign job

    Spawn log
    spawn ROOM spawned NAME
    with X Parts, Y Parts
    For job ID
    job TYPE in job ROOM

    */

    // a prototype of Spawn
    requestSpawn: function(job)
    {
        var room = Game.rooms[spawn.room.name];
        var roomEnergy = room.energyCapacityAvailable;
        var body = this.getBody(roomEnergy, job);

        return body, undefined, {homeroom: room.name, job: job, working: false}
    },


    // A function to determine body for new creep
    getBody: function(energy,job)
    {
        // Decide based on job creep was spawned for
        switch(job.type)
        {
            // Eco creeps
            case 'harvest'||'upgrade'||'build':
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
                return body;
        }
    },
}