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
                    
                    // Don't have a job, look for one
                    if(!creep.memory.job)
                    {
                        this.search(creep);
                    }
                    
                    // If we don't have energy
                    if(!working)
                    {
                        this.energy(creep);
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
                this.id = `${subroutine.idGenerator()} ${subroutine.idGenerator()}`;
                this.room = room
                this.type = type;
                this.status = 'unfinished';
                this.arg = arg;
                this.priority = 0;
            },



            
            // Search for available jobs
            search: function(creep)
            {
                // Find Jobs

                // Spread jobs
                allJobs = [...jobs];

                // Check if creep can do job
                
                // Give job to creep
                creep.memory.job = job;
                // Run job
                subroutine.run(creep);
            },






            // Should only run every X ticks
            createJobs: function(room)
            {
                if(room.memory.sources === undefined)
                {
                    // Find sources in room

                    // Find free spaces around each source
                }

                jobs = []

                //  spawns extensions towers containers storage terminal

                //  upgrade at least 1 if creeps dont have job they should upgrade

                //  extracting

                //  repair walls and ramparts

                //  long distance harvesting

                
                room.memory.jobs = jobs;
            },





            // Find all available energy opportunities
            energy: function(creep)
            {
                let room = creep.room;
                // Find Containers by how many
                var container = room.find(FIND_STRUCTURES, 
                    {
                        filter: s => (s.structureType === STRUCTURE_CONTAINER &&
                                    s.store[RESOURCE_ENERGY] > (getCreepBody(creep,'CARRY') * 50))
                    });

                // Find Storage
                var storage = room.find(FIND_STRUCTURES, 
                    {
                        filter: s => (s.structureType === STRUCTURE_STORAGE &&
                                    s.store[RESOURCE_ENERGY] > (getCreepBody(creep,'CARRY') * 50))
                    });

                // Find Terminal
                if(room.terminal && room.terminal.store[RESOURCE_ENERGY] > (getCreepBody(creep,'CARRY') * 50))
                {
                    var temrinal = room.terminal
                }


                    // Decide jobs based on amount
                
                // Find sources
                    // no job if a miner is present
                    // Decide jobs based on available spaces

                    
            }
        }
    }
}