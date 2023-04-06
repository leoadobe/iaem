import {
  createTag,
// eslint-disable-next-line import/no-unresolved
} from '../../scripts/scripts.js';

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  loadVideos(block);
}

function loadVideos($block){
  $block.querySelectorAll('.columns a[href], .video a[href]').forEach(($a) => {
    const { href } = $a;
    const url = new URL(href);
    const suffix = url.pathname.split('/media_')[1];
    const $parent = $a.parentNode;

    if (href.endsWith('.mp4')) {
      const isAnimation = !!$a.closest('.animation');
      let attribs = {
          playsinline: '', autoplay: '', loop: '', muted: '',
        };
      const $poster = $a.closest('div').querySelector('img');
      if ($poster) {
        attribs.poster = $poster.src;
        $poster.remove();
      }

      const $video = createTag('video', attribs);
      /*
      if (href.startsWith('https://hlx.blob.core.windows.net/external/')) {
        href='/hlx_'+href.split('/')[4].replace('#image','');
      }
      */
      $video.innerHTML = `<source src="./media_${suffix}" type="video/mp4">`;
      $a.parentNode.replaceChild($video, $a);
      $video.muted = true;
      $video.controls = true;      
      $video.pause();
    }

    const $next = $parent.nextElementSibling;
    if ($next && $next.tagName === 'P' && $next.innerHTML.trim().startsWith('<em>')) {
      $next.classList.add('legend');
    }
  });
}