import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

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

function createForm() {
 
  const form = document.createElement('form');
  form.setAttribute('action', '#');
  form.setAttribute('method', 'post');
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('id', 'filter');
  input.setAttribute('placeholder', 'Type to search ...');
  input.setAttribute('onkeyup', 'filterFunction()');
  input.setAttribute('class','filterInput');
  form.append(input);
  /*
  const button = document.createElement('button');
  button.setAttribute('type', 'submit');
  button.setAttribute('value', 'Submit');
  button.innerText = 'Submit';
  form.append(button);
  */
  return form;
}

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch nav content
  const navPath = cfg.nav || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
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
      contactForm.parentNode.append(createForm());
    }

    const script = document.createElement('script'); 
    script.append('function filterFunction(){'
    +'var input, filter, table, tr, td, i, txtValue;'
    +'input = document.getElementById("filter");'
    +'filter = input.value.toUpperCase();'
    +'table = document.getElementById("tableDocs");'
    +'tr = table.getElementsByTagName("tr");'
    +'for (i = 0; i < tr.length; i++) {'
      +'for (n = 0; n < tr[i].cells.length; n++){'
        +'td = tr[i].getElementsByTagName("td")[n];'
        +'if (td) {'
          +'txtValue = td.textContent || td.innerText;'
          +'console.log(txtValue);'
          +'console.log(filter);'
          +'if (txtValue.toUpperCase().indexOf(filter) > -1) {'
            +'tr[i].style.display = "";'
            +'break;'
            +'console.log("achei");'
            +'} else {'
              +'tr[i].style.display = "none";'
              +'}'
            +'} '      
          +'}'
        +'}'
      +'}');

    /* SEARCH V1 for Bullets (LI)
    script.append('function filterFunction(){'
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
    + '}');
    */
    nav.append(script);

        //logo link
        if(document.getElementsByClassName("nav-brand") && document.getElementsByClassName("nav-brand").length>0)
        document.getElementsByClassName("nav-brand")[0].innerHTML = "<a href='"+ window.location.host +"'>" + document.getElementsByClassName("nav-brand")[0].innerHTML + "</a>"
  }
}

function leo(){
  //document.getElementsByTagName("li")[25].parentElement.parentElement.parentElement.style="inline";
}
