(function($)
{
    $.fn.puissance4 = function(nameFunction, param)
    {
        var game = false;
        var bool = false;
        var idJeton = 1;
        var player = "Player 1";
        var limitColonne = new Array();
        var playerColor = new Array();
        var minV;
        var maxV;
        var colors;

        $.fn.StartGame = function(sizeX, sizeY)
        {
            $(this).CreateGrid(sizeX,sizeY);
            $(".menu").remove();
            $(".menuOptions").remove();
        }

        $.fn.CreateMenu = function()
        {
            $(this).append("<div class ='menu' ></div>");
            $(".menu").append("<img src = '../img/Puissance4.png'>");
            $(".menu").append("<button id='buttonPlay'>Jouer</button>");
            $(".menu").append("<button id= 'buttonOptions'>Options</button>");
        }

        $.fn.CreateMenuOptions = function()
        {
            $("#game").append("<div class ='menuOptions'></div>");
            $(".menuOptions").append("<div id ='sizePuissance'></div>");
            $(".menuOptions").append("<img id='mytest' src ='../img/sound.png'>");
            $(".menuOptions").addResize(7,"sizeGridX", "x", "buttonResizeX");
            $(".menuOptions").addResize(6,"sizeGridY", "y", "buttonResizeY");

            $("#mytest").click(function(event)
            {
                if(event.target.src == "file:///home/wac/development/wac/Projects/Puissance_4/JavaScript_Puissance4/img/sound.png")
                    event.target.src = "../img/mute.png";
                else
                    event.target.src = "../img/sound.png";
            });
        }

        $.fn.MenuChangePlayer = function(NamePlayer, test)
        {
            for(i in colors)
            {
                if(colors[i] == playerColor[player])
                    var color = i;
            }

            $(".menuChangePlayer").remove();

            $(this).append("<div class = 'menuChangePlayer'>"+NamePlayer+ " " + test+ "</div>");

            $(".menuChangePlayer").animate({ fontSize: "+="  +40 }, 400);
        }

        $.fn.addResize = function(value, nameId, nameValue, idButton)
        {
            $(this).append("<div class = 'resizeGrid'><p>"+nameValue+"</p><p id ='"+nameId+"' class = 'sizeGrid'>"+value+"</p></div>");
            $(this).append("<div id ='" + idButton + "' class='buttonResize'><button>+</button><button>-</button></div>");

            var test = $(this).children().length;
            var element =  $(this).children()[test - 1];

            $(element).click(function(event)
            {
                var size = $("#"+nameId).text();
            
                if($(event.target).text() == "+")
                    var size = +size + 1;
                else
                    if(+size > 4)
                        var size = +size - 1;

                $("#"+nameId).text(size);
            });
        }

        $.fn.CreateGrid = function(sizeX, sizeY)
        {
            maxV = sizeY * 80 - 30 + 175;
            minV = 80 - 30 + 175;

            $("#game").append("<div class = 'grid'></div>")

            for(var i = 0; i < sizeY; i+=1)
            {
                var test = $(".grid").append("<div class = 'column" + i + "'></div>");

                for(var j = 0; j < sizeX; j+=1)
                {
                    test.append("<img class = 'col" + j + " row" +i +" caseGrid' src='../img/grid.png'></div>");
                    limitColonne["col" + j] = sizeY * 80 - 30;
                }
            }

            $("#game").append("<button class = 'reload'>Retour au menu principal</button");
            $('.reload').click(function()
            {
                location.reload();
            });
        }

        $.fn.InstatiateJeton = function(element, positionY, colorJeton)
        {
            if(limitColonne[element.classList[0]] > 0)
            {
                idJeton++;
                var jeton = document.createElement("img");
                jeton.className = "jeton caseGrid ";
                jeton.src = colorJeton;
                jeton.id = "test" + idJeton;
                jeton.style.zIndex = -1;
                jeton.style.position = "absolute";
                jeton.style.top = 175 + "px";
                jeton.style.left = positionY + "px";
                $(".grid").append(jeton);
                $(this).AnimateJeton(element.classList[0], jeton);
            }
        }

        $.fn.SearchWinLine = function(element)
        {
            var test = $(".jeton");
            var vertical = new Array();
            var horizontal = new Array();

            var v = 0;
            var h = 0;

            for(var  i = 0; i < test.length; i++)
            {
                if(test[i].offsetLeft == element.offsetLeft)
                {
                    vertical[v] = test[i];
                    v++; 
                }

                if(test[i].offsetTop == element.offsetTop)
                {
                    horizontal[h] = test[i];
                    h++;
                }
            }

            horizontal = $(this).TriArray(horizontal);
            var diago = $(this).SearchWinDiagonal(element);
            diago = $(this).CheckWin(element.src, diago[0], diago[1]);
            var tutu = $(this).CheckWin(element.src, vertical, horizontal);
            var boolDiago = new Array();
            boolDiago[0] = diago;
            boolDiago[1] = tutu;
            return boolDiago;
        }

        $.fn.SearchWinDiagonal = function(element)
        {
            var test = $(".jeton");
            var diagonalLeft = new Array();
            var diagonalRight = new Array();
            var departTop = element.offsetTop;
            var departRight = element.offsetLeft;
            var departLeft = element.offsetLeft;

            while(departTop != maxV)
            {
                departTop += 80;
                departRight += 100;
                departLeft -= 100;
            }

            var l = 0;
            var r = 0;
            while(departTop != minV)
            {
                for(var  i = 0; i < test.length; i++)
                {
                    if(test[i].offsetLeft == departLeft && test[i].offsetTop == departTop)
                    {
                        diagonalLeft[l] = test[i];
                        l++;
                    }

                    if(test[i].offsetLeft == departRight && test[i].offsetTop == departTop)
                    {
                        diagonalRight[r] = test[i];
                        r++;
                    }
                }

                departTop -= 80;
                departRight -= 100;
                departLeft += 100;
            }

            var diago = new Array();
            diago[0] = diagonalRight;
            diago[1] = diagonalLeft;
            return diago;
        }

        $.fn.CheckWin = function(color, vertical, horizontal)
        {
            var count = 0;

            for(i in vertical)
            {
                if(vertical[i].src == color)
                    count++;
                else
                    count = 0;
            }

            if(count >= 4) return true;
            else count = 0;


            for(i in horizontal)
            {
                if(count < 4)
                {
                    if(horizontal[i].src == color)
                        count++;
                    else if(horizontal[i].src != color )
                        count = 0;
                }
            }

            if(count >= 4) return true;
            else return false;
        }

        $.fn.AnimateJeton = function(colonne, jeton)
        {
            var audio = $("body").addAudio(jeton,"../music/jeton.ogg");
            audio.pause();
            $("#"+jeton.id).animate({ top: "+=" + limitColonne[colonne] }, 300, function()
            {
                audio.play();
                $("#"+jeton.id).animate({ top: "-=" + 40 }, 125, function()
                {
                    $("#"+jeton.id).animate({ top: "+=" + 40 }, 125, function()
                    {
                        $("#"+jeton.id).animate({ top: "-=" + 15 }, 125, function()
                        {
                            audio.play();
                            $("#"+jeton.id).animate({ top: "+=" + 15 }, 125, function()
                            {
                                audio.play();
                                game = true;
                                var result = $(this).SearchWinLine(jeton);

                                if(result[0] != false || result[1] != false)
                                {

                                    game = false;
                                    var play = (player == "Player 1") ? "Player 2" : "Player 1";
                                    $("#game").MenuChangePlayer(play, "Gagnant");
                                }
                                else
                                    $("#game").MenuChangePlayer(player, "");
                            });
                        });
                    });
                });
            });
            limitColonne[colonne] -= 80;
        }

        $.fn.closeElement = function(element)
        {
            $(element).click(function()
            {
                bool = !bool;

                if(bool)
                    $(".menu").animate({ marginLeft: "+=120"});
                else
                    $(".menu").animate({ marginLeft: "-=120"});
            });
        }

        $.fn.addAudio = function(element, src)
        {
            var audio = document.createElement("audio");
            $(element).append(audio);
            audio.src = src;
            audio.play();
            return audio;
        }

        $.fn.AddSongHover = function(button, src)
        {
            button.each(function(key, val)
            {
                var audio = $("body").addAudio(val, src);
                audio.pause();
                audio.volume = 0.15;

                $(val).mouseover(function()
                {
                    audio.play();
                });
            });
        }

        $.fn.AddSongClick = function(button, src)
        {
            button.each(function(key, val)
            {
                var audio = $("body").addAudio(val, src);
                audio.pause();
                audio.volume = 0.30;

                $("button").mousedown(function(event)
                {
                    audio.play();
                });
            });
        }

        $.fn.MenuChoiceColor = function()
        {
            colors = {
                "green" : "../img/jetonGreen.png",
                "red" : "../img/jetonRed.png",
                "blue" : "../img/jetonBlue.png",
                "rose" : "../img/jetonRose.png"
            }

            $("#game").css("display", "none");

            playerColor["Player 1"] = colors["green"];
            playerColor["Player 2"] = colors["red"];

            $("body").prepend("<div class = 'menuChoiceColor'></div>");
            $(".menuChoiceColor").append("<h2>Choisir une couleur</h2>");

            $(".menuChoiceColor").append("<ul class = 'submenu'></ul>");
            $(".submenu").append("<li id = 'player1'><a class = 'namePlayer' href='#'>Player 1 <img class = 'options' src = '../img/jetonGreen.png'></a><ul class ='okletest'></ul></li>");
            $(".submenu").append("<li id = 'player2'><a class = 'namePlayer' href='#'>Player 2 <img class = 'options' src = '../img/jetonRed.png'</a><ul class ='okletest'></ul></li>");

            for(i in colors)
            {
                var srcPlayer1 = $("#player1 img")[0].src.split("/");
                srcPlayer1 = "../img/" + srcPlayer1[srcPlayer1.length - 1];

                var srcPlayer2 = $('#player2 img')[0].src.split("/");
                srcPlayer2 = "../img/" + srcPlayer2[srcPlayer2.length - 1];


                if(srcPlayer1 != colors[i] && srcPlayer2 != colors[i])
                {
                    $("#player1 .okletest").append("<li><a href ='#'><img class = 'options' src ="+colors[i]+"></a></li>");
                    $("#player2 .okletest").append("<li><a href ='#'><img class = 'options' src ="+colors[i]+"></a></li>");
                }
            }

            $("#player1 .okletest").click(function(event)
            {
                var saveColor = event.target.src;
                event.target.src = $("#player1 .options")[0].src;
                $("#player1 .options")[0].src = saveColor;

                for(i in $("#player2 .options"))
                {
                    if($("#player2 .options")[i].src == saveColor)
                    {
                        $("#player2 .options")[i].src = event.target.src;
                    }
                }

                playerColor["Player 1"] = saveColor;
            });

            $("#player2 .okletest").click(function(event)
            {
                var saveColor = event.target.src;
                event.target.src = $("#player2 .options")[0].src;
                $("#player2 .options")[0].src = saveColor;

                for(i in $("#player1 .options"))
                {
                    if($("#player1 .options")[i].src == saveColor)
                    {
                        $("#player1 .options")[i].src = event.target.src;
                    }
                }

                playerColor["Player 2"] = saveColor;
            });

            $(".menuChoiceColor").append("<button class = 'titi'>Ok</button>");

            $('.titi').click(function(event)
            {
                $('#game').css("display", "block");
                $(".menuChoiceColor").remove();
                $("#game").MenuChangePlayer(player, "");
                game = true;
            });
        }

        $.fn.TriArray = function(array, line)
        {
            var test;
            var test2;
            for(var i = 0; i < array.length; i++)
            {
                for(var j = 1; j < array.length; j++)
                {
                    if(array[i].offsetLeft > array[j].offsetLeft)
                    {
                        var temp = array[i];
                        array[i] = array[j];
                        array[j] = temp;
                        j--;
                    }
                }
            }
            tmp = array[0];
            for(i = 0; i < array.length; i++)
              array[i] = array[i+1];
            array[array.length -1] = tmp;

            return array;
        }

        $.fn.PlayerVsPlayer = function(sizeX, sizeY)
        {
            $(this).StartGame(sizeX, sizeY);
            var colors = $(this).MenuChoiceColor();


            $(this).click(function(event)
            {
                if(event.target.classList[2] == "caseGrid" && game == true)
                {
                    game = false;

                    if(player == "Player 1")
                    {
                        colorJeton = playerColor["Player 1"];
                        player = "Player 2";
                    }
                    else
                    {
                        colorJeton = playerColor["Player 2"];
                        player = "Player 1";
                    }
                    var test = $(this).InstatiateJeton(event.target, event.target.offsetLeft, colorJeton);
                }
            });
        }

        return this;
    };
})(jQuery);

//---------------------------------------------------------------------

$("body").puissance4().addAudio($("#game"), "../music/White-Dance.ogg");
$("#game").puissance4().CreateMenuOptions();
$(".menuOptions").puissance4().CreateMenu();
$("body").puissance4().AddSongHover($("button"), "../music/2003.ogg");
$("body").puissance4().AddSongClick($("button"), "../music/2018.ogg");
$("#game").puissance4().closeElement($("#buttonOptions"));

$("#buttonPlay").click(function()
{
    $("#game").PlayerVsPlayer($("#sizeGridX").text(),$("#sizeGridY").text());
});

//-----------------------------------------------------------------------------