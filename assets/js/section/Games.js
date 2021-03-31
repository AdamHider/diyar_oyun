/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var OyunGames = {
    query_word_ids:  "",
    referent_word_id: 0,
    games_limit: 11,
    games_offset: 0,
    games_rendered: [],
    
    init: function (){
        OyunGames.initControls();
        OyunGames.loadGames();
    },

    initControls: function (){
        jQuery('.show-more-examples').click(function(e){
            OyunGames.temp_offset = OyunGames.games_rendered.length;
            OyunGames.loadExamples(OyunGames.games_limit, OyunGames.temp_offset);
        });
    },

    loadGames: function (){
        jQuery.ajax({
            url: "router.php?method=gameGetList",
            type: "POST",
            data: {
                limit: OyunGames.games_limit, 
                offset: OyunGames.games_offset
            },
            beforeSend: function() {
                
            },
            success: function (response){
                var game_list = [];
                if(response){
                    game_list = JSON.parse(response);
                }
                console.log(game_list);
                if(game_list.length > 0){
                    if(game_list.length > 10){
                        game_list.pop();
                    } else {
                        jQuery('.examples-show-more').hide();    
                        jQuery('.block-examples-show-more').hide();    
                    }
                    OyunGames.games_rendered = OyunGames.games_rendered.concat(game_list);
                    OyunGames.renderGameList(game_list);
                    OyunApp.language.checkWritingMode();
                    return
                } else {
                    jQuery('.examples-show-more').hide();    
                    jQuery('.block-examples-show-more').hide();    
                }
            },
            complete: function() {
                
            }
        });
    },

    renderExamplesHeader: function (translation_header){    
        if(!translation_header.games_is_needed){
            document.querySelector('.examples-empty').style.display = 'block';
        } else {
            if(document.querySelector('.examples-empty')){
                document.querySelector('.examples-empty').style.display = 'none';
            }
            var c = document.createElement("DIV");
            c.setAttribute("class", "block-examples-show-more");
            document.getElementsByClassName('examples-container')[0].appendChild(c);

            var d = document.createElement("BUTTON");
            d.setAttribute("class", "button examples-show-more");
            d.innerHTML = "<i class='fa fa-chevron-down'></i>";
            d.addEventListener('click', function(){
                var temp_offset = OyunGames.games_rendered.length;
                OyunGames.loadExamples(OyunGames.games_limit, temp_offset);
            });
            document.getElementsByClassName('examples-container')[0].appendChild(d);
        }
    },

    renderGameList: function (games_list){
        /*
        if(document.querySelector('.examples-empty')){
            document.querySelector('.examples-empty').style.display = 'none';
        }
        var  b, i;
        for(i in games_list) {
            var example = games_list[i];
            b = document.createElement("DIV");
            b.setAttribute("class", "example-block");

            b.innerHTML += '<div class="example source-example wrtmode-true">'+example.source_example+'</div>';
            b.innerHTML += '<div class="example referent-example wrtmode-true">'+example.referent_example+'</div>';

            document.getElementById('games_container').appendChild(b);
        }*/
    }
}
