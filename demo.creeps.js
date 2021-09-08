const subroutine = require('creep.subroutines');

exports.module =
{
    // Experimental Task handler
    demo: function(creep)
    {
                // CREEP CONTROLLER
        // Check to see if creep should be working
        var working = jobManager.working(creep);
        
        // If we have energy
        if(working)
        {
            // Do our job
            if(creep.memory.job)
            {
                jobManager.run(creep);
            }

            // Don't have a job, look for one
            else
            {
                jobManager.search(creep);
            }
        }

        // If we don't have energy
        else if(!working)
        {
            jobManager.energy(creep);
        }

        // If we aren't an eco creep
        else
        {
            creep.say('End of the line');
        }


    /*
        VERY WIP

        making jobs

        job =
        {
            id:
            type:
            status:
            arg:
        }
                Find Spawns and extensions that need filling
                give jobs accordingly

                Find construction sites that need building
                designate 1 or 2 jobs depending
                        
                Find Storage Containers
                for each
                is there an acceptable amount?
                number of jobs accordingly

                Find Sources
                for each
                is there a miner? (cancel job)
                find free area around sources (number of jobs)

    Check creep body parts and flag it for different tasks

    if only carry parts, lorry
    work parts enable econ tasks
    claim parts enable claim tasks
    attack parts enable priority attack tasks


    Are we working?**
    
    Yes**
        Do we have an unfinished job?**

        Yes**
            Then do it**

        No**
            Look through jobs**
            Do we need to fillup energy?

    No**
        Check for getFromStorage opportunities**
        Check harvest opportunities**

    Not just an eco worker
        attack
        claim

    Doing nothing**
        Wander**
    */


        // JOB MANAGER
        jobManager =
        {
            job: function(id,room,type,arg) 
            {
                this.id = id;
                this.room = room
                this.type = type;
                this.status = 'unfinished';
                this.arg = arg;
                this.priority = 0;
            },

            // Shortcuts
            run: function(creep)
            {subroutine.run(creep);},
            working: function(creep)
            {subroutine.checkWorking(creep);},


            // Search for available jobs
            search: function(creep)
            {
                // Find Jobs

                jobs = [];
                jobs.push(jobManager.job(type,arg));
                // Check if creep can do job


                
                
                // Give job to creep
                creep.memory.job = job;
                // Run job
                jobManager.run(creep);
            },

            // Find all available energy opportunities
            energy: function(creep)
            {
                // Find Containers
                // Find Storage
                // Find Terminal
                    // Decide jobs based on amount
                
                // Find sources
                    // no job if a miner is present
                    // Decide jobs based on available spaces

            },
        }
    }
}