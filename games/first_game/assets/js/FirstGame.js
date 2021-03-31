
var FirstGame = {  
    tag_id: 44,
    config: {
        
    },
    init: function(){
        FirstGame.initControls();
        FirstGame.loadTagList();
        FirstGame.loadWordList();
    },

    initControls: function(){
       //Declaration of event listeners
    },

    language:{
        system_language: {},
        init: function(){
            FirstGame.language.initControls();
            FirstGame.language.render();
        },
        initControls: function(){
        },
        render: function(){
        },
    },
    
    //render something
    loadTagList: function(){
        jQuery.ajax({
            url: "https://diyar.im/index.php?option=com_ajax&module=oyun&method=getWordTagList&format=json",
            type: "POST",
            beforeSend: function() {
            },
            complete: function() {
            },
            success: function (response){
                if(response.data){
                    console.log(response.data);
                }
                    
            }
        });
    },
    loadWordList: function(){
        jQuery.ajax({
            url: "https://diyar.im/index.php?option=com_ajax&module=oyun&method=getWordList&format=json",
            type: "POST",
            data: {tag_id: FirstGame.tag_id},
            beforeSend: function() {
            },
            complete: function() {
            },
            success: function (response){
                if(response.data){
                    console.log(response.data);
                }
                    
            }
        });
    },
    
    //render something
    render: function(){
        
    },
};




