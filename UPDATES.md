# Updates

    To-Do
    ==============================
    -more progressive body building
    -find closest room with enough energy for remote spawns [needs implementation]
    -search by flag color/ name wildcards (flags dont have memory addresses try flag.pos.roomName)
    -properly iterate over long distance harvesters so they aren't hard coded
    -long distance mining overhaul
        -miner/harvester
        -build
        -repair
        -check for hostiles?
    
    
    - Combat AI [|||--]
    - DEFCON system [||||-]
    - Lab Functionality [|----]
    - Factory functionality [-----]
    - Pickup dropped energy [|----]
    - Whitelist / Traitor code [-----]
    - Fallback methods for resource management [||||-]

    - Empire [|||-------]



    1.0.1 update Log
    ==============================
    -- Added a room spawning queue to handle multiple spawns
    -- Miners now suicide when their container is missing instead of crashing entire colony
    -- Fixed errors with fresh respawn

    1.0.2 update Log
    ==============================
    -- Removed Dynamic energy cap (default cap 2000)
    -- If there are no creeps spawn a harvester with whats available
    -- Automated claimer tasks by controller owner (attack,claim,sign)
    -- Normalized codebase
    -- Miners will now spawn with just 550 energy available
    
    1.0.3 update Log
    ==============================
    -- Attack role now functions regardless of flag so they can be spawned elsewhere
        -- still need to pass flag into attack role instead of declaring so defenders dont run off
    -- DEFCON system now spawns defenders (attackFlag is for now Use at own risk)
    -- If no harvesters or lorries look for a miner and spawn a lorry, else harvester with whats available
    -- Changed pixel generation to work with new update

    1.0.4 update Log
    ==============================
    -- Fixed a TypeError when moving through a room with no controller [hallways]
    -- Attacker role now uses target memory to determine behavior, attackers spawned with flags are independent of those spawned with DEFCON
    -- Changed room initialization to a base set of workers 1 harvester/builder/upgrader/repairer, 5 work/carry/move cap.
        this will help make claiming new rooms more seemless later as a room can be self sufficient with just a spawn ASAP
        -- added newSpawn variable to be used for sending help to a freshly claimed room

    1.0.5 update Log
    ==============================
    -- Fixed flag attackers
    -- Fixed claimer?
    -- Long Distance harvesters no longer get confused about what room they're supposed to be in when role changing
    -- Put an 8 room range on attackFlag spawning
    -- When a miner is spawned it will increase min Lorries to 1 if it is 0

    1.0.6 update Log
    ==============================
    -- Claimer fully functional (make sure to set your name and message in role.claimer)
    -- added a room memory variable to reserve nearby rooms
        Reserve claimers are spawned with 1300 energy
    -- Fixed a bug with defcon 3 not reseting when enemies are gone, added a function and trimmed some code
        refined defcon update conditions (defenders can take a while to spawn, potential issue)
        successfully defended against large invader force
    -- Added a seperate hard energy cap for military units (Will leave 300 energy will not use more than 2000)
    -- Attackers now have progressive body building and can be spawned with only 190 energy (need at least 490 available)
        with energy cap this is a 40 part 10 attack creep.

    1.0.7 update Log
    ==============================
    -- Renamed files to maintain naming conventions
    -- Moved turret control from game level to room level
    -- Started the move from dedicated creep roles to subroutines to reduce redundancy

    1.0.8 update Log
    ==============================
    -- Finished adding creep subroutines
    -- Implemented subroutines in most roles
        now that they are done looking into a way to do away with roles mostly
    -- Trimmed lots of dead code preparing for possible refactor
    -- Started adding flag groups

    1.0.9 update Log
    ==============================
    -- Optimized wall Repair function and moved it into subroutines
    -- Moved primary creep work state check into a subroutine
    -- Optimized DEFCON function

    1.1.0 update Log
    ==============================
    -- Further optimized and finally consolidated creep roles
    -- Started working on a new job manager that populates a task list
        and assigns creeps individual work orders
    -- Brainstorming a new spawn control system to work with job requests

    1.1.1 update Log
    ==============================
    -- Started new spawn function
    -- Most subroutines have error handles and can take args now
    -- fixed a lot of JS equalities to strict for free CPU dust
    -- fixed some of my bad indentation

    1.1.2 update Log
    ==============================
    -- Added a check to clear old rooms from memory
    -- Reoptimized DEFCON function
    -- Fixed extractor role to better understand behavior for job manager
    -- Added ID generator
    -- Added part Checker

    1.1.3 update Log
    ==============================
    -- Fixed moving to target rooms behavior and optimized roles further
    -- Optimized giant spawn check 
        still need to figure out new behavior
    -- Added 'Interface' to memory paths for simpler game interactions
        will slowly add intended features as I refactor
    -- Added more room memory variables for job handling
    -- Adding more creep memory variables for future use
    -- Started work on combine role
        will combine all main eco roles into one
        creeps moving forward will be split by roles which then filter for jobs
        jobs have a type

    1.1.4 update Log
    ===============================
    -- Added room HUD from 'Overmind'
    -- Also stole the community profiler
    -- Interface mostly functional

    1.1.5 update Log
    ================================
    -- Connected terminal to room controller to automatically execute deals on energy
    -- Protection Resources
    -- Extractor improvements
        Will deposit to terminal first
        Automatic spawning
    -- Lorries should now deposit energy into terminal when storage is at limit

    1.1.6 update Log
    ================================
    -- Added variable for turret wall/rampart support
    -- Fixed extractor spawning priority and energy need
        Still need to filter for extractor actually existing
    -- Added extractor path visuals
    -- Moved terminal energy checks into getFromStorage method
    -- Started fixing LD Harvesters

    1.1.7 update Log
    ================================
    -- Miners will now spawn with a carry when possible
        Miners will deposit into nearby links
    -- Links working (kinda, turned off for now in room controller)
    -- Lorries will withdraw from link near storage
    -- Lorries will now fill labs and factory with some energy

    1.1.8 update Log
    ================================
    -- Fixed a bug in getFromStorage subroutine
    -- Improved Lorry behavior regarding containers link and storage
    -- Links should be working now
    -- Miners will pull excess energy out of containers to put into links

    1.1.9 update Log
    ================================
    -- Added a storeResource routine to deal with multiple resource types
    -- Squashed stupid DEFCON bug, needs redoing anyway
    -- Optimized attack routine? Added rangedAttack back
    -- Added helper creeps for new claims etc., not tested yet
    -- Added a timer to auto attack owned room controllers, claim, and then help
        Will spawn bigger claimers for owned rooms

    1.2.0 update Log
    ===============================
    -- Will buy energy when low
    -- Lorries will pull from terminal when appropriate
    -- New Room bug squash + random hotfixes
    -- Lorries fill Nuker and Power Spawn with energy
    -- Claim room working amazingly, will keep sending claimers to attack, claim, sign, 
        and then send 3 helpers for 10,000 ticks
    -- Power Spawns now process power
    -- Scientist role brings power from terminal/storage to powerSpawn

    1.2.1 update Log
    ===============================
    -- Housekeeping
    -- Various Bug Fixes
    -- Simple power creep routine

.
