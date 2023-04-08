import {
    createTag,
    // eslint-disable-next-line import/no-unresolved
} from '../../scripts/scripts.js';

export default function decorate(block) {
    //look for the styles.css to change the heigth
    const divMainReveal = createTag('div', {class: 'reveal-main'});
    

    const divReveal = createTag('div', {class: 'reveal'});
    divMainReveal.append(divReveal);

    const divSlides = createTag('div', {class: 'slides'});
    divReveal.append(divSlides);

    const rows = [...block.children];
    rows.forEach(row => {
        var section = createTag('section', {});
        const cols = [...row.children];
        for (var i = 0; i <= cols.length; i++) {
            var item;
            if (i == 0){
                item = createTag('h2', {});
                item.append(cols[i]);
            } else if (i == 1) {
                item = createTag('div', {class: 'reveal-one3rd-text'});
                item.append(cols[i])
            } else if (i == 2) {
                item = createTag('div', {class: 'reveal-two3rd-media'});                                             
                var media;
                var content = cols[i].innerHTML;
                
                //image or video
                if(content.indexOf('<picture>')>-1){                    
                    media = createTag('figure', {});                    
                    media.append(cols[i].querySelector('picture'));
                    var figcaption = createTag('figcaption',{class: 'reveal-image-caption'});
                    var caption = content.substring(content.indexOf('</picture>')+10,content.length-6);
                    figcaption.append(caption);
                    media.append(figcaption);

                    //remove caption text
                    cols[i].remove(caption);
                }else if(content.indexOf('.mp4')>-1){
                    //hidden the video info
                    cols[i].style = 'display:none';
                    
                    var media = createTag('video',{ playsinline: '', autoplay: '', loop: '', muted: '',})
                    var url = content.substring(content.lastIndexOf('href=')+6,content.indexOf('.mp4')+4);                   
                    media.innerHTML = `<source src="${url}" type="video/mp4">`;
                    media.muted = false;
                    media.controls = true;      
                    media.play();             
                    
                    //TODO: Add caption to video media
                    //vidcaption.append(content.substring(content.lastIndexOf('<p>')+3,content.lastIndexOf('</p>')));                    
                }
                item.append(media);
            }
            section.append(item);
        }
        //add the section
        divSlides.append(section);
    });
    block.append(divMainReveal);
};