/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var OyunApp = {    
    hostname: 'https://diyar.im',
    //hostname: 'http://localhost:888/diyar',
    config: {
        list: {
            sidebar_status: "closed",
            system_language: {},
            writing_mode: localStorage.getItem('writing_mode'),
            database_info: {},
            theme: {
                theme: "green",
                lugat_background: "basic_green",
                theme_appearance: "fancy",
                darkmode: "off",
            }
        },
        init: function(){
            OyunApp.config.list.system_language = OyunApp.language.config['ru'];
            OyunApp.config.load();
        },
        save: function(){
            localStorage.setItem('lugat_config', JSON.stringify(OyunApp.config.list));
        },
        load: function(){
            var local_config = JSON.parse(localStorage.getItem('lugat_config'));
            if(!local_config){
                localStorage.setItem('lugat_config', JSON.stringify(OyunApp.config.list));
            } else {
                OyunApp.config.list = local_config;
            }
        }
    },
    
    init: function(){
        OyunApp.config.init();
        OyunApp.language.init();
        mod_languages.init();
        OyunApp.initControls();
        OyunApp.sidebar.init();
        OyunApp.settings.init();
        OyunApp.sharing.init();
        OyunGames.init();
    },

    initControls: function(){
        window.addEventListener("hashchange", OyunApp.onHashChange, false);
        if(location.hash){
            OyunApp.onHashChange();
        }
        // CHECK WRITING MODE
        OyunApp.language.checkWritingMode();
        window.addEventListener('storage', function(e) {
            OyunApp.language.checkWritingMode();
        });
        window.addEventListener('focus', function(e){
            if(OyunApp.current_page == 'pageLugat'){
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }
            
        });
    },

    language:{
        allLanguages: {
            en: Eng,
            ru: Rus,
            crh: Crh
        },
        config:{
            ru:{
                db_index: 1,
                tag: 'ru',
                joomla_tag: 'ru-RU',
                flag: 'ru_ru',
                system_index: 3,
                list: {}
            },
            en: {
                db_index: 0,
                tag: 'en',
                joomla_tag: 'en-GB',
                flag: 'en_gb',
                system_index: 1,
                list: {}
            },
            crh: {
                db_index: 3,
                tag: 'crh',
                joomla_tag: 'crh-CRH',
                flag: 'crh_crh',
                system_index: 4,
                list: {}
            }
        },
        current:{},
        system_language: {},
        init: function(){
            OyunApp.language.initControls();
            OyunApp.language.render();
        },
        initControls: function(){
            jQuery('.writing-mode-select select').on('change',function(e){
                var data_value = this.value;
                OyunApp.config.list.writing_mode = data_value;
                OyunApp.config.save();
            });    
        },
        render: function(){
            OyunApp.language.system_language = OyunApp.config.list.system_language;
            OyunApp.language.system_language.list = OyunApp.language.allLanguages[OyunApp.language.system_language.tag];
            jQuery('.lang-text').each(function(e){
                var data_value = $(this).attr('data-lang_value');
                if(this.tagName == 'INPUT' || this.tagName == 'TEXTAREA' ){
                    jQuery(this).attr('placeholder',OyunApp.language.system_language.list[data_value]);
                } else {
                    jQuery(this).html(OyunApp.language.system_language.list[data_value]);
                }
            });
            jQuery('#pageSettingsC .system-languages-select .drop-down .option-'+OyunApp.language.system_language.tag).attr('selected', 'true');
            jQuery('.writing-mode-select .drop-down .option-'+OyunApp.config.list.writing_mode).attr('selected', 'true');
        },
        switch: function(language_tag){
            OyunApp.language.system_language = OyunApp.language.config[language_tag];
            OyunApp.config.list.system_language = OyunApp.language.system_language;
            OyunApp.config.save();
            OyunApp.language.render();
            OyunApp.articles.render();
            OyunApp.reloadWord();
            OyunApp.history.renderHistory();
        },
        checkWritingMode: function(){
            localStorage.setItem('writing_mode', OyunApp.config.list.writing_mode);
        },
    },
    
    sidebar:{
        init: function(){
            OyunApp.sidebar.initControls();
            if(window.screen.width < 768){
                Swiper.init();
            } else {
                OyunApp.config.list.sidebar_status = 'opened';
            }
            
            $('[data-swipe-overlay], [data-swipe-close]').on('click', function (e) {
                e.preventDefault();
                OyunApp.sidebar.close();
            });

            $('[data-swipe-open]').on('click', function (e) {
                e.preventDefault();
                OyunApp.sidebar.open();

            });
            if(OyunApp.current_word !== ''){
                OyunApp.config.list.current_page = 'pageLugat';
            }
            OyunApp.sidebar.showPage(OyunApp.config.list.current_page);
            if(OyunApp.config.list.sidebar_status == 'opened'){
                OyunApp.sidebar.open();
            }
        },
        initControls: function(){
            jQuery('.sidebar .section-link').click(function () {
                var page_id = jQuery(this).children('a').attr('id');
                OyunApp.current_page = page_id;
                jQuery('.sidebar .page-link').addClass('inactive');
                jQuery(this).removeClass('inactive');
                OyunApp.setHash('page', page_id);
            });
            jQuery('[data-swipe-drawer]').click(function (e) {
                if(jQuery('#lugat_sidebar').css('transform') == 'matrix(1, 0, 0, 1, 0, 0)' && jQuery(e.target).parents('#lugat_sidebar').length == 0 ){
                console.log('closed');
                    OyunApp.sidebar.close();
                }
            });
            jQuery('.back-to-site-button').attr('href', OyunApp.config.list.system_language.list['MOD_LUGAT_BACK_TO_SITE_LINK']);
        },
        showPage: function(page_id){
            OyunApp.config.list.current_page = page_id;
            OyunApp.config.save();
            if(page_id == 'pageLugat'){
                jQuery('body').addClass('lugat-page-is-active');
                jQuery('.open-sidebar-button').css('color', 'white');
            } else {
                jQuery('body').removeClass('lugat-page-is-active');
                jQuery('.open-sidebar-button').css('color', '#000000');
            }/*
            if(page_id == "pageSynchronization"){
                OyunApp.synchronization.load();
            }*/
            jQuery('.active-page').removeClass('active-page');
            jQuery('#'+page_id).parent().parent().addClass('active-page');
            jQuery('.lugat-page').hide();
            jQuery('#' + page_id + 'C').show();
            if(window.screen.width < 768){
                OyunApp.sidebar.close();
            }
        },
        getPageFromHash: function (){
            
        },
        open: function() {
            OyunApp.config.list.sidebar_status = 'opened';
            OyunApp.config.save();
            $('[data-swipe-drawer]').addClass('swipe-nav-open');
            $('body').addClass('no-scroll sidebar-opened');
        },
        close: function() {
            if(window.screen.width > 768){
                return;
            }
            OyunApp.config.list.sidebar_status = 'closed';
            OyunApp.config.save();
            $('[data-swipe-drawer]').removeClass('swipe-nav-open');
            $('body').removeClass('no-scroll sidebar-opened');
        }
    },
    
    settings: {
        init: function(){
            OyunApp.settings.initControls();
            OyunApp.settings.switchTheme();
        },
        initControls: function(){
            jQuery('.color-block').click(function(){
                var theme = jQuery(this).attr('data-color');
                jQuery('body').removeClass('lugat-background-'+OyunApp.config.list.theme.lugat_background);
                OyunApp.config.list.theme.lugat_background = theme;
                jQuery('body').addClass('lugat-background-'+OyunApp.config.list.theme.lugat_background);
                OyunApp.config.save();
                OyunApp.settings.render();
            });
            jQuery('.theme-sample-block').click(function(){
                var theme = jQuery(this).attr('data-theme');
                jQuery('body').removeClass('theme-'+OyunApp.config.list.theme.theme);
                OyunApp.config.list.theme.theme = 'green';
                jQuery('body').addClass('theme-'+OyunApp.config.list.theme.theme);
                OyunApp.config.save();
                OyunApp.settings.render();
            });
            jQuery('.theme-appearance-select').change(function(){
                var theme_appearance = jQuery(this).val();
                if(!OyunApp.config.list.theme.theme_appearance){
                    OyunApp.config.list.theme.theme_appearance = 'fancy';
                }
                jQuery('body').removeClass('theme-appearance-'+OyunApp.config.list.theme.theme_appearance);
                OyunApp.config.list.theme.theme_appearance = theme_appearance;
                jQuery('body').addClass('theme-appearance-'+theme_appearance);
                OyunApp.config.save();
                OyunApp.settings.render();
            });
            jQuery('.theme-darkmode-select').change(function(){
                var darkmode = jQuery(this).val();
                if(!OyunApp.config.list.theme.darkmode){
                    OyunApp.config.list.theme.darkmode = 'on';
                }
                jQuery('body').removeClass('theme-darkmode-'+OyunApp.config.list.theme.darkmode);
                OyunApp.config.list.theme.darkmode = darkmode;
                jQuery('body').addClass('theme-darkmode-'+darkmode);
                OyunApp.config.save();
                OyunApp.settings.render();
            });
        },
        render: function(){
            jQuery('.color-block').removeClass('active');
            jQuery('.color-block.'+OyunApp.config.list.theme.lugat_background+'-block').addClass('active');
            jQuery('.theme-appearance-select .option-'+OyunApp.config.list.theme.theme_appearance).attr('selected', 'true');
            jQuery('.theme-darkmode-select .option-'+OyunApp.config.list.theme.darkmode).attr('selected', 'true');
        },
        switchTheme: function(){
            jQuery('body').addClass('lugat-background-'+OyunApp.config.list.theme.lugat_background);
            jQuery('body').addClass('theme-appearance-'+OyunApp.config.list.theme.theme_appearance);
            jQuery('body').addClass('theme-darkmode-'+OyunApp.config.list.theme.darkmode);
            OyunApp.settings.render();
        }
    },
    
    sharing:{
        init: function(){
            /*
            OyunApp.sharing.initControls();
            OyunApp.sharing.render('page-share-block');
             */
        },
        initControls: function(){
            document.addEventListener("click", function (e) {
                if(
                        jQuery(e.target).closest('#backgroundDarkness').length > 0 
                    ){
                    OyunApp.sharing.hideAll();
                }
            });
            var acc = document.getElementsByClassName("share-accordion");
            var i;
            for (i = 0; i < acc.length; i++) {
              acc[i].addEventListener("click", function() {
                /* Toggle between adding and removing the "active" class,
                to highlight the button that controls the panel */
                this.classList.toggle("active");
                var accordion_index = this.classList[2].split('-')[1];
                /* Toggle between hiding and showing the active panel */
                var panel = document.querySelector('.accordion-panel-'+accordion_index);
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                    document.querySelector('body').style.overflowY = 'auto';
                    document.querySelector('body').style.height = 'initial';
                } else {
                    panel.style.display = "block";
                    document.querySelector('body').style.overflowY = 'hidden';
                    document.querySelector('body').style.height = '100vh';
                }
                document.querySelector('#backgroundDarkness').style.display = 'block';
              });
            } 
        },
        hideAll: function(){
            var acc = document.getElementsByClassName("share-panel");
            for (var i = 0; i < acc.length; i++) {
              acc[i].style.display = "none";
            } 
            document.querySelector('.translation-share-block').style.display = 'none';
            document.querySelector('#backgroundDarkness').style.display = 'none';
            document.querySelector('body').style.overflowY = 'auto';
            document.querySelector('body').style.height = 'initial';
            jQuery('.share-accordion').removeClass('active');
        },
        render: function(container_class, word='', language_id = ''){
            if(container_class == 'page-share-block'){
                var url = location.href.replace(location.hash, '');
                var description = OyunApp.config.list.system_language.list['MOD_LUGAT_SHARE_HOME_DESCRIPTION'];
            } else {
                var url = location.href;
                if(language_id == 1){
                    description = OyunApp.config.list.system_language.list['MOD_LUGAT_SHARE_TRANSLATION_DESCRIPTION1_QRH'];
                } else {
                    description = OyunApp.config.list.system_language.list['MOD_LUGAT_SHARE_TRANSLATION_DESCRIPTION1_RUS'];
                }
                description += ' "'+word+'" ';
                if(language_id == 1){
                    description += OyunApp.config.list.system_language.list['MOD_LUGAT_SHARE_TRANSLATION_DESCRIPTION2_QRH'];
                } else {
                    description += OyunApp.config.list.system_language.list['MOD_LUGAT_SHARE_TRANSLATION_DESCRIPTION2_RUS'];
                }
            }
            var site_title = OyunApp.config.list.system_language.list['MOD_LUGAT_SHARE_SITE_TITLE'];
            
            site_title = encodeURIComponent(site_title);
            description = encodeURIComponent(description);
            url = encodeURIComponent(url);
            
            document.querySelector('.'+container_class+' .facebook').addEventListener('click', function(){
                window.open('https://www.facebook.com/sharer.php?u='+url+'&title='+site_title+'&summary='+description,'sharer','status=0,toolbar=0,width=650,height=500');
            }); 
            document.querySelector('.'+container_class+' .vkontakte').addEventListener('click', function(){
                window.open('https://vkontakte.ru/share.php?url='+url+'&title='+description,'sharer','status=0,toolbar=0,width=650,height=500');
            }); 
            document.querySelector('.'+container_class+' .ok').addEventListener('click', function(){
                window.open('https://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st._surl='+url+'&st.comments='+description,'sharer','status=0,toolbar=0,width=650,height=500');
            }); 
            document.querySelector('.'+container_class+' .telegram').addEventListener('click', function(){
                window.open('https://telegram.me/share/url?url='+url,'sharer','status=0,toolbar=0,width=650,height=500');
            }); 
            document.querySelector('.'+container_class+' .twitter').addEventListener('click', function(){
                window.open('https://twitter.com/intent/tweet?text='+site_title+'. '+description+'. '+url,'sharer','status=0,toolbar=0,width=650,height=500');
            }); 
            document.querySelector('.'+container_class+' .viber').href = "viber://forward?text="+description+" "+url;
            document.querySelector('.'+container_class+' .whatsapp').href = "whatsapp://send?text="+description+" "+url;
            document.querySelector('.'+container_class+' .mail').href = "mailto:?subject="+site_title+"&body="+description+" "+url;
        }
        
    },

    setHash: function(key, value, mode){
        if(key=='page'){
            if(OyunApp.config.list.sidebar_status == 'opened' && value == OyunApp.config.list.current_page && window.screen.width < 768){
                OyunApp.sidebar.close();
            }
        }
        var hash = location.hash.replace('#', '');
        var hash_params = hash.split('&');
        var new_hash = '#';
        var hash_object = {
            word: '',
            page: ''
        };
        for(var i in hash_params){
            var param = hash_params[i];
            var param_name = param.split('=')[0];
            var param_value = param.split('=')[1];
            if(param_name == 'word'){
                hash_object.word = param_value;
            }
            if(param_name == 'page'){
                hash_object.page = param_value;
            }
        }
        hash_object[key] = value;
        if(hash_object.page !== ''){
            new_hash += 'page' + "=" + hash_object.page + "&";
        }
        if(hash_object.word !== ''){
            new_hash += 'word' + "=" + hash_object.word + "&";
        }
        
        location.hash = new_hash.slice(0, -1);
    },


    clearHash: function(){
        OyunApp.setHash('word', '');
    },
    
    onHashChange: function(){
        var hash = location.hash.replace('#', '');
        var hash_params = hash.split('&');
        for(var i in hash_params){
            var param = hash_params[i];
            var param_name = param.split('=')[0];
            var param_value = param.split('=')[1];
            if(param_name == 'page'){
                OyunApp.current_page = param_value;
                OyunApp.sidebar.showPage(OyunApp.current_page);
            }
            if(param_name == 'word'){
                if(OyunApp.current_word == decodeURI(param_value)){
                    continue;
                } else {
                    OyunApp.current_word = decodeURI(param_value);
                    OyunApp.setHash('page', 'pageLugat');
                    if(param_value == ''){
                        document.getElementById('autocomplete_input').value = '';
                        return;
                    }
                    jQuery("#autocomplete_input").val(OyunApp.current_word);
                    OyunApp.getWord(OyunApp.current_word, true);
                }
            }
        }
        
    },

};


OyunApp.init();
