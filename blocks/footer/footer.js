import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footer = document.createElement('div');
  footer.innerHTML = html;
  await decorateIcons(footer);
  block.append(footer);

  //Initializing Reveal.js after loaded the components of the page
    if(document.getElementsByClassName('slide block')){
    Reveal.initialize({
      width: "100%",
      height: "100%",
      hash: true,
      center: false,
      embedded: true,
      disableLayout: false,
      progress: false
    });
  }
}
