$(document).ready(function () {

    //variabls for movement
    var towers = [[[], $(".line1")], [[], $(".line2")], [[], $(".line3")]],
    moves = 0,
    discs = null,
    hold = null;

    //undo redo stacks
    actions = [];
    undo_actions = [];

    //timer
    const startingMinutes = 2;
    let time_amount = startingMinutes * 60;

    const TimerElement = document.getElementById("countdown");
    var gameRunning = true;

    setInterval(updateCountDown, 1000);

    function updateCountDown() {

        const minutes = Math.floor(time_amount / 60);
        let seconds = time_amount % 60;

        TimerElement.innerHTML = `Time Left: ${minutes}:${seconds}`;
        if(gameRunning)
            time_amount--;

        if(time_amount <= 0)
        {
            lost();
        }
        
    }

    function clear() {
        towers[0][1].empty();
        towers[1][1].empty();
        towers[2][1].empty();
    }

    function drawdiscs() {
        clear();
        for (var i = 0; i < 3; i++) {
            if (!jQuery.isEmptyObject(towers[i][0])) {
                for (var j = 0; j < towers[i][0].length; j++) {
                    towers[i][1].append (
                        $( "<li id = 'disc" + towers[i][0][j] + "'value = '" + towers[i][0][j]  + "'></li>")
                    );
                }
            }
        }
    }

    function init(){
        clear();
        towers = [[[], $(".line1")], [[], $(".line2")], [[], $(".line3")]];
        discs = document.getElementById("box").value;
        moves = 0;
        hold = null;

        for (var i = discs; i > 0; i--)
            towers[0][0].push(i);
        drawdiscs();
        $(".moves").text(moves + " moves");
    }

    function handle(tower) {
        if ( hold === null) {
            if(!jQuery.isEmptyObject(towers[tower[0]])) {
                hold = tower;
                towers[hold][1]
                .children()
                .last()
                .css("margin-top", "-170px");
            }
        }
        else {
            var move = moveDisc(hold,tower);
            moves +=1;
            $(".moves").text(moves + " moves");
            if (move == 1) {
                drawdiscs();
                actions.push(hold);
                actions.push(tower);
            } else {
                alert("You can't place bigger disc on a smaller one");
            }
            hold = null;
        }
        if(solved()) 
        {
                $(".moves").text("Solved with " + moves + " moves");
                $(".moves").css("color", "#00ff00")
                gameRunning = false;
        }
    }

    function moveDisc(a,b){
        
        var from = towers[a][0];
        var to = towers[b][0];

        

        if (from.length === 0) 
            return 0;
        else if (to.length === 0) {
            to.push(from.pop());
            return 1;
        } else if ( from[from.length - 1] > to[to.length - 1]) {
            return 0;
        } else {
            to.push(from.pop());
            return 1;
        }
    }

    function solved() {
        if ( jQuery.isEmptyObject(towers[0][0]) && jQuery.isEmptyObject(towers[1][0]) && towers[2][0].length == discs)
            return 1;
        if ( jQuery.isEmptyObject(towers[0][0]) && jQuery.isEmptyObject(towers[2][0]) && towers[1][0].length == discs)
            return 1;   
        else
            return 0;
    }

    function lost()
    {
        $(".moves").css("color", "#ff0000")
        $(".moves").text("Time ran out! You Lose!");
        gameRunning = false;
    }

    function undo() {

      
        if(actions.length < 2)
            return 0;
        
        var from = actions.pop();
        var to = actions.pop();
        var move = moveDisc(from,to);

        
        if (move == 1) {
            drawdiscs();
            moves -=1;
            $(".moves").text(moves + " moves");

            undo_actions.push(to);
            undo_actions.push(from);

        } else {
            alert("There was an error with undo;");
        }
        hold = null;
    }

    function redo() {

        debugger;
        if(undo_actions.length < 2)
            return 0;
        
        var to = undo_actions.pop();;
        var from = undo_actions.pop();
        var move = moveDisc(from,to);

        
        if (move == 1) {
            drawdiscs();
            moves +=1;
            $(".moves").text(moves + " moves");

            actions.push(from);
            actions.push(to);
        } else {
            alert("There was an error with redo;");
        }
        hold = null;
    }

    $(".t").click(function() {

        if(gameRunning)
            handle($(this).attr("value"));
    });

    $("#restart").click(function () {
        discs = document.getElementById("box").value;
        time_amount = startingMinutes * 60;
        gameRunning = true;

        $(".moves").css("color", "#00eeff")

        init();
    });

    $("#redo").click(function () {

        if(gameRunning)
            redo();
    });

    $("#undo").click(function () {

        if(gameRunning)
            undo();
    });
    
    init();
});