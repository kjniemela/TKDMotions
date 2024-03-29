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

function TypeBtn(type) {
  return `<button
    class="${targetType === type ? 'selected' : ''}"
    onClick="targetType = '${type}', renderConfig();">${capitalize(type)}</button>`;
}

function WeightLabel(item, type) {
  return `
        <label class="label">${item}: </label>
        <input
          id="${item}"
          class="weight"
          type="number"
          value=${stances[targetStance][type][item]}
          onchange="
            stances[targetStance].${type}['${item}'] = parseInt(document.getElementById('${item}').value);
        ">
        <button class="xBtn" onclick="
          delete stances[targetStance].${type}['${item}'];
          renderConfig();
        ">X</button>
        <br>`;
}

function renderConfig() {
  let html = '';
  if (configOpen) {
    html += `
      <button type="button" onclick="exportConfig()">Export</button>
      <button type="button" onclick="importConfig()">Import</button>
      <button type="button" onclick="downloadConfig()">Download</button>
      <button type="button" onclick="uploadConfig()">Upload</button>
      <div id="file-upload-div"></div>
      <br>
    `;
    for (let stance in stances) {
      html += StanceBtn(stance);
    }
    html += `
      <br>
      <label class="heading"><b>Selected stance: ${capitalize(targetStance)} Stance</b></label>
      <br>
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
      <br>
      ${TypeBtn('strikes')}
      ${TypeBtn('blocks')}
      <br>
    `;

    html += `<label class="label heading"><b>${capitalize(targetType)}:</b></label>`;
    html += '<label class="label heading"><b>Weight:</b></label>';

    for (let item in stances[targetStance][targetType]) {
      html += WeightLabel(item, targetType);
    }

    html += `
      <input class="label" id="add-${targetType}">
      <button onClick="
        stances[targetStance].${targetType}[document.getElementById('add-${targetType}').value] = 1;
        renderConfig();
      ">Add ${capitalize(targetType.substr(0, targetType.length - 1))}</button>
      <br>
    `;
  }

  document.getElementById('config').innerHTML = html;
  document.getElementById('config-btn').setAttribute('class', configOpen ? 'selected' : '');

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