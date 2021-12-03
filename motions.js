function getRandInt(min, max) {
  return Math.floor(Math.random() * ((max + 1) - min) ) + min;
}

function getRandStance(stances) {
  let pool = [];
  for (let stanceName in stances) {
    let stance = stances[stanceName];
    for (let i = 0; i < stance.weight; i++) {
      pool.push(stanceName);
    }
  }
  return pool[getRandInt(0, pool.length - 1)];
}

function getRandTechnique(techniques) {
  let pool = [];
  for (let technique in techniques) {
    let weight = techniques[technique];
    for (let i = 0; i < weight; i++) {
      pool.push(technique);
    }
  }
  return pool[getRandInt(0, pool.length - 1)];
}

let lastStance = ''
let stance = ''

function nextSet(setSize, numOfSets) {
  text = ''
  for (let set = 0; set < numOfSets; set++) {
    for (let i = 0; i < setSize; i++) {
      const rp = getRandInt(0, 2) > 0 || i === 0 ? 'Retreating' : 'Pivoting';
      const a = getRandInt(0, 1) === 1 ? 'Advancing' : rp;
      let stance = getRandStance(stances);
      let timeout = 50;
      while (a === 'Pivoting' && stance === lastStance && timeout > 0) {
          stance = getRandStance(stances);
          timeout--;
      }
      if (timeout === 0) {
        break;
      }

      let technique;
      let isBlock = !!getRandInt(0, 1);
      if (isBlock) {
        technique = getRandTechnique(stances[stance].blocks);
      } else {
        technique = getRandTechnique(stances[stance].strikes);
      }

      const bl = isBlock ? ' block' : '';

      lastStance = stance;
      text += `${a} ${technique}${bl} in a ${stance} stance<br>`;
    }
    text += '<br>';
  }
  document.getElementById('content').innerHTML = text;
}