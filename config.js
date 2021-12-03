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
  'down': 1,
  'up': 1,
  'double knife-hand': 1,
  'knife-hand': 1,
  'inside-outside': 1,
  'outside-inside': 1,
  'downward palm': 1,
  'push': 1,
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

let targetStance = 'front';
let targetType = 'strikes';

function renderConfig() {
  let html = '';
  if (configOpen) {
    html += `<button onClick="targetStance = 'front', renderConfig();">Front</button>`;
    html += `<button onClick="targetStance = 'back', renderConfig();">Back</button>`;
    html += `<button onClick="targetStance = 'tiger', renderConfig();">Tiger</button>`;
    html += `<button onClick="targetStance = 'horse', renderConfig();">Horse</button>`;
    html += `<button onClick="targetStance = 'twisted', renderConfig();">Twisted</button>`;
    html += `<button onClick="targetStance = 'crane', renderConfig();">Crane</button>`;
    html += '<br>'
    html += `<label class="heading"><b>Selected stance: ${capitalize(targetStance)} Stance</b></label>`;
    html += '<br>'
    html += `
    <label class="label">Weight: </label>
    <input
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
      html += `<input id="add-strike">`;
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
      html += `<input id="add-block">`;
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
  navigator.clipboard.writeText(JSON.stringify(stances));
  console.log(JSON.stringify(stances));
}

function importConfig() {
  const newStances = JSON.parse(prompt('JSON config string:'));
  for (let stance in newStances) {
    stances[stance] = newStances[stance];
  }
  configOpen = true;
  renderConfig();
}