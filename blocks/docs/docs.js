import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';
const col_limit = 9;

export default function decorate(block) {
  //take the word URL to convert into a table
  var contentDiv = block.getElementsByTagName( 'div')[0].getElementsByTagName('div')[0];
  const api = contentDiv.textContent;
  contentDiv.textContent = 'Loading...';

  //initiate variable to call service
  var getJSON = function(url, callback)
  {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'json';
      //xhr.setRequestHeader('Accept', '*/*');
      //xhr.setRequestHeader('Access-Control-Expose-Headers','*');

      xhr.onload = function()
      {
          var status = xhr.status;

          if (status == 200)
          {
              callback(null, xhr.response);
          }
          else
          {
              callback(status);
          }
      };
      xhr.send();
  }

  //callback function to render the json data
  getJSON(api, function(err, data)
  {
      if (err != null)
      {
        console.log(api);
        console.error(err);
      }
      else
      {
          tableFromJson(data.data);
    }
  })

  // using regular methods.
  function tableFromJson(json)
  {
    // Extract value from table header.
    var col = [];
    for (var i = 0; i < json.length; i++) {
      for (var key in json[i]) {
        if (col.indexOf(key) === -1) {
          col.push(key);
        }
      }
    }

    // Create a table.
    var table = document.createElement("table");
    table.setAttribute("id","tableDocs");

    // Create table header row using the extracted headers above.
    // table row.
    var tr = table.insertRow(-1);

    for (var i = 0; i < col.length && i<col_limit; i++) {
      // table header.
      var th = document.createElement("th");
      th.scope = 'col';
      th.innerHTML = col[i];
      tr.appendChild(th);
    }

    // add json data to the table as rows.
    for (var i = 0; i < json.length; i++)
    {
      tr = table.insertRow(-1);

      for (var j = 0; j < col.length && j<col_limit; j++) {
        var tabCell = tr.insertCell(-1);
        tabCell.scope = 'row';
        var textContent = json[i][col[j]];
  
        //last 3 columns
        if(j==col_limit-3)
        {
          tabCell.scope = 'wrap';
        }
        else if(j==col_limit-2 && textContent)
        {
          var html = '<a href="' + json[i][col[j]] + '" target="_blank" class="btn btn-dark webform-dialog webform-dialog-normal">Watch</a>';
          textContent = html;
        }
        else if(j==col_limit-1 && textContent)
        {
          var html = '<a href="' + json[i][col[j]] + '" target="_blank" class="btn btn-dark webform-dialog webform-dialog-normal">Download</a>';
          textContent = html;
        }          
        tabCell.innerHTML = textContent;

      }
      block.appendChild(table);
      contentDiv.textContent = '';
    }
  }  
}