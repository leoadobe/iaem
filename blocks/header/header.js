import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';
import { createTag, getLanguage } from '../../scripts/scripts.js';

/**
 * collapses all open nav sections
 * @param {Element} sections The container element
 */

function collapseAllNavSections(sections) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', 'false');
  });
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
function createForm(parentElement) {
 
  const form = document.createElement('form');
  form.setAttribute('action', '#');
  form.setAttribute('method', 'post');

  //add switcher
  const span = document.createElement('span');
  span.setAttribute('class','switcher');
  span.innerHTML = '<a href="/br/">BR</a> | <a href="/es/">ES</a>';
  form.append(span);

    //add search
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('id', 'filter');
  input.setAttribute('placeholder', 'Type to search ...');
  input.setAttribute('onkeyup', 'filterFunction()');
  input.setAttribute('class','filterInput');
  form.append(input);

  //hide icon
  parentElement.querySelector('.icon-form').style = 'display: none';
  parentElement.append(form);
}

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  //get multilanguage
  var language = getLanguage();

  // fetch nav content with language switcher
  const navPath = language + (cfg.nav || '/nav');  

  const resp = await fetch(window.location.origin + '/' +`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.innerHTML = html;
    decorateIcons(nav);

    const classes = ['brand', 'sections', 'tools'];
    classes.forEach((e, j) => {
      const section = nav.children[j];
      if (section) section.classList.add(`nav-${e}`);
    });

    const navSections = [...nav.children][1];
    if (navSections) {
      navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        navSection.addEventListener('click', () => {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          collapseAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });
      });
    }

    // hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = '<div class="nav-hamburger-icon"></div>';
    hamburger.addEventListener('click', () => {
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      document.body.style.overflowY = expanded ? '' : 'hidden';
      nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
    nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');
    decorateIcons(nav);
    block.append(nav);

    const contactForm = nav.querySelector('.icon-form');
    if (contactForm) {
      createForm(contactForm.parentNode);
    }

    const script = document.createElement('script'); 
    script.append('function filterFunction(){'
    +'var input, filter, table, tr, td, i, txtValue;'
    +'input = document.getElementById("filter");'
    +'filter = input.value.toUpperCase();'
    +'if(document.getElementById("tableDocs")){'
      +'table = document.getElementById("tableDocs");'
      +'tr = table.getElementsByTagName("tr");'
      +'for (i = 0; i < tr.length; i++) {'
        +'for (n = 0; n < tr[i].cells.length; n++){'
          +'td = tr[i].getElementsByTagName("td")[n];'
          +'if (td) {'
            +'txtValue = td.textContent || td.innerText;'
            +'if (txtValue.toUpperCase().indexOf(filter) > -1) {'
              +'tr[i].style.display = "";'
              +'break;'
            +'} else {'
              +'tr[i].style.display = "none";'
            +'}'
          +'} '      
        +'}'
      +'}'
    +'} else if(document.getElementsByClassName("table-list-wrapper")[0]){'
        + 'var input = document.getElementById("filter");'
        + 'var filter = input.value.toUpperCase();'
        + 'var div = document.getElementsByClassName("table-list-wrapper")[0];'
        + 'var lis = div.getElementsByTagName("li");'
        + 'var idx = 6;'
        + 'for (i = idx; i < lis.length; i++){'
          + 'var li = lis[i];'
          + 'var parent = li.parentElement.parentElement.parentElement;'
          + 'var txt = parent.innerText;'  
          + 'if (txt.toUpperCase().indexOf(filter) > -1){'  
            + 'parent.style.display = "";'  
          + '} else {'  
            + 'parent.style.display = "none";'  
          + '}'  
        + '}'  
      + '}'  
    + '}');
    nav.append(script);
  }

  //set the icon as link to the home page
  if(document.querySelector('div.nav-brand')){
    document.querySelector('div.nav-brand').addEventListener("click", () => {
      window.location.href = "/" + getLanguage() + "/";
    });
  }
}