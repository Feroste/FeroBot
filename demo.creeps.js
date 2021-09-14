const subroutine = require('creep.subroutines');
const roles = require('creep.roles');

exports.module =
{
    // Experimental Task handler
    demo: function(creep)
    {

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




            // Code starts here



            // This module should be ran for every creep
            run: function(creep)
            {
                try
                {
                    // Check to see if creep should be working
                    var working = subroutine.working(creep);
                    
                    // If not an eco creep
                    if(working === undefined)
                    {
                        
                    }
                    
                    // If we don't have energy
                    if(!working)
                    {
                        this.energy(creep);
                    }

                    // Don't have a job, look for one
                    if(!creep.memory.job)
                    {
                        this.search(creep);
                    }

                    // Do our job
                    subroutine.run(creep);
                }

                catch
                {
                    // Wander
                    subroutine.wander(creep);
                    creep.say('REACHED END OF JOB MANAGER');
                }
            },
            
            // Job template
            job: function(room,type,arg) 
            {
                //this.id = idGenerator.next();
                this.room = room
                this.type = type;
                this.status = 'unfinished';
                this.arg = arg;
                //this.priority = 0;
            },

            // Search for available jobs
            search: function(creep)
            {
                // Find Jobs

                // Create jobs array
                jobs = [];
                // Push job to array
                jobs.push(jobManager.job(room,type,arg));
                
                
                // Check if creep can do job

                // Spread jobs
                allJobs = [...jobs];

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

            }
        }
    }
}