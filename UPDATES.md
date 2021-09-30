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

.
