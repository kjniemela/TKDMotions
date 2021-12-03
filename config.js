function extend(obj1, obj2) {
  let returnObject = {};
  for (key in obj1) {
    returnObject[key] = obj1[key];
  }
  for (key in obj2) {
    returnObject[key] = obj2[key];
  }
  return returnObject;
}

function downloadObjectAsJson(exportObj, exportName){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function capitalize(string) {
  return string[0].toUpperCase() + string.substring(1);
}

const strikes = {
  'middle punch': 4,
  'ridge hand': 2,
  'inverted ridge hand': 1,
  'backfist': 2,
  'reverse punch': 2,
  'chop': 3,
  'spear-hand': 2,
  'tigermouth': 2
}
const blocks = {
  'down': 4,
  'up': 4,
  'double knife-hand': 3,
  'knife-hand': 3,
  'inside-outside': 2,
  'forearm': 2,
  'outside-inside': 2,
  'downward palm': 1,
  'push': 2,
  'Y': 1,
  'high-low': 1,
  'X': 1
}
const stances = {
  'front': {
    'strikes': extend(strikes, {'c-punch': 1, 'oxjaw': 1, 't-strike': 1}),
    'blocks': blocks,
    'weight': 4
  },
  'back': {
    'strikes': strikes,
    'blocks': blocks,
    'weight': 4
  },
  'tiger': {
    'strikes': extend(strikes, {'oxjaw': 1}),
    'blocks': blocks,
    'weight': 3
  },
  'horse': {
    'strikes': strikes,
    'blocks': extend(blocks, {'mountain': 1}),
    'weight': 3
  },
  'twisted': {
    'strikes': strikes,
    'blocks': blocks,
    'weight': 2
  },
  'crane': {
    'strikes': strikes,
    'blocks': blocks,
    'weight': 1
  }
}
const forbiddenSequences = {
  'strike1': ['strike2', 'strike3'],
  'block1': ['strike2', 'block2']
};

function getPairList(seqs) {
  let pairList = [];
  for (let item in seqs) {
    for (let item2 of seqs[item]) {
      pairList.push([item, item2]);
    }
  }
  return pairList;
}

let targetStance = 'front';
let targetType = 'strikes';

function StanceBtn(stance) {
 return `<button
      class="${targetStance === stance ? 'selected' : ''}"
      onClick="targetStance = '${stance}', renderConfig();">${capitalize(stance)}</button>`;
}

function renderConfig() {
  let html = '';
  if (configOpen) {
    html += `<button type="button" onclick="exportConfig()">Export</button>`;
    html += `<button type="button" onclick="importConfig()">Import</button>`;
    html += `<button type="button" onclick="downloadConfig()">Download</button>`;
    html += `<button type="button" onclick="uploadConfig()">Upload</button>`;
    html += `<div id="file-upload-div"></div>`;
    html += '<br>'
    for (let stance in stances) {
      html += StanceBtn(stance);
    }
    html += '<br>'
    html += `<label class="heading"><b>Selected stance: ${capitalize(targetStance)} Stance</b></label>`;
    html += '<br>'
    html += `
    <label class="label">Weight: </label>
    <input
      class="weight"
      id="stance-weight"
      type="number"
      value=${stances[targetStance].weight}
      onchange="
        stances[targetStance].weight = parseInt(document.getElementById('stance-weight').value);
    ">
    <button class="xBtn" onclick="
      stances[targetStance].weight = 0;
      renderConfig();
    ">X</button>
    <br>`
    html += `<button onClick="targetType = 'strikes', renderConfig();">Strikes</button>`;
    html += `<button onClick="targetType = 'blocks', renderConfig();">Blocks</button>`;
    html += '<br>';
    html += `<label class="label heading"><b>${capitalize(targetType)}:</b></label>`;
    html += '<label class="label heading"><b>Weight:</b></label>';
    if (targetType === 'strikes') {
      for (let strike in stances[targetStance].strikes) {
        html += `
        <label class="label">${strike}: </label>
        <input
          id="${strike}"
          class="weight"
          type="number"
          value=${stances[targetStance].strikes[strike]}
          onchange="
            stances[targetStance].strikes['${strike}'] = parseInt(document.getElementById('${strike}').value);
        ">
        <button class="xBtn" onclick="
          delete stances[targetStance].strikes['${strike}'];
          renderConfig();
        ">X</button>
        <br>`
      }
      html += `<input class="label" id="add-strike">`;
      html += `<button onClick="
        stances[targetStance].strikes[document.getElementById('add-strike').value] = 1;
        renderConfig();
      ">Add Strike</button>`;
      html += '<br>'
    } else {
      for (let block in stances[targetStance].blocks) {
        html += `
        <label class="label">${block} block: </label>
        <input
          id="${block}"
          class="weight"
          type="number"
          value=${stances[targetStance].blocks[block]}
          onchange="
            stances[targetStance].blocks['${block}'] = parseInt(document.getElementById('${block}').value);
        ">
        <button class="xBtn" onclick="
          delete stances[targetStance].blocks['${block}'];
          renderConfig();
        ">X</button>
        <br>`
      }
      html += `<input class="label" id="add-block">`;
      html += `<button onClick="
        stances[targetStance].blocks[document.getElementById('add-block').value] = 1;
        renderConfig();
      ">Add Block</button>`;
      html += '<br>'
    }
  }
  document.getElementById('config').innerHTML = html;
  nextSet(
    document.getElementById('setLen').value,
    document.getElementById('sets').value
  );
}

let configOpen = false;
function toggleConfig() {
  configOpen = !configOpen;
  renderConfig();
}

function exportConfig() {
  const data = {
    stances: stances
  }
  navigator.clipboard.writeText(JSON.stringify(data));
  console.log(JSON.stringify(data));
}

function importConfig() {
  loadConfig(prompt('JSON config string:'));
}

function loadConfig(string) {
  const data = JSON.parse(string);
  const newStances = data.stances;
  for (let stance in newStances) {
    stances[stance] = newStances[stance];
  }
  configOpen = true;
  renderConfig();
}

function downloadConfig() {
  const data = {
    stances: stances
  }
  downloadObjectAsJson(data, 'config');
}

function uploadConfig() {
  let oldLabel = document.getElementById('upload-label');
  if (oldLabel) {
    oldLabel.remove();
  }
  let oldUpload = document.getElementById('config-upload');
  if (oldUpload) {
    oldUpload.remove();
  }
  let newLabel = document.createElement('label');
  newLabel.setAttribute('class', 'label');
  newLabel.setAttribute('id', 'upload-label');
  newLabel.innerText = 'Config file:';
  document.getElementById('file-upload-div').appendChild(newLabel);
  let newUpload = document.createElement('INPUT');
  newUpload.setAttribute('type', 'file');
  newUpload.setAttribute('class', 'weight');
  newUpload.setAttribute('id', 'config-upload');
  newUpload.setAttribute('accept', 'application/json');
  document.getElementById('file-upload-div').appendChild(newUpload);
  (function(){ // by Sam Greenhalgh from stackoverflow

    function onChange(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }

    function onReaderLoad(event){
        console.log(event.target.result);
        loadConfig(event.target.result);
    }

    document.getElementById('config-upload').addEventListener('change', onChange);

  }());
  // const data = JSON.parse(prompt('JSON config string:'));
  // const newStances = data.stances;
  // for (let stance in newStances) {
  //   stances[stance] = newStances[stance];
  // }
  // configOpen = true;
  // renderConfig();
}