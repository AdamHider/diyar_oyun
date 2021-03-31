<?php

class OyunRouter{
    
    public function gameGetList(){
        $game_list = [];
        $game_folders = array_diff(scandir('games'), array('..', '.'));
        foreach($game_folders as $game_folder){
            $game_details = json_decode(file_get_contents('games/'.$game_folder.'/manifest.json'), true, JSON_UNESCAPED_UNICODE);
            $game_details['directory'] = 'games/'.$game_folder;
            $game_list[] = $game_details;
        }
        echo json_encode($game_list,true);
    }
}





$Router = new OyunRouter();
if(!empty($_GET['method'])){
    $Router->{$_GET['method']}();
}
if(!empty($_POST['method'])){
    $Router->{$_POST['method']}();
}

