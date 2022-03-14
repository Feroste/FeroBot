// Highlights all creeps of given role with color
global.highlightAllCreeps = function (role, color = 'green') 
{
    var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    for (let i in creeps) 
    {
        creeps[i].room.visual.circle(creeps[i].pos, {fill: 'transparent', radius: 0.55, stroke: color});
    }
};

// Finds number of creeps of given role
global.countAllCreeps = function (role) 
{
    return _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
};

// Clears console in game
global.clearLog = function () 
{
    let clr = "<script>angular.element(document.getElementsByClassName('fa fa-trash ng-scope')" +
              "[0].parentNode).scope().Console.clear()</script>";
    console.log(clr);
};

// Generates random 4 character IDs
global.idGenerator = () => 
{
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};