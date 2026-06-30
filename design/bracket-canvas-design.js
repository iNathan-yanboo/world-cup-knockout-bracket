document.body.dataset.moduleLoaded = 'true';

try {
  const teams = {
    RSA: ['南非', 'za'],
    CAN: ['加拿大', 'ca'],
    GER: ['德国', 'de'],
    PAR: ['巴拉圭', 'py'],
    NED: ['荷兰', 'nl'],
    MAR: ['摩洛哥', 'ma'],
    BRA: ['巴西', 'br'],
    JPN: ['日本', 'jp'],
    FRA: ['法国', 'fr'],
    SWE: ['瑞典', 'se'],
    CIV: ['科特迪瓦', 'ci'],
    NOR: ['挪威', 'no'],
    MEX: ['墨西哥', 'mx'],
    ECU: ['厄瓜多尔', 'ec'],
    ENG: ['英格兰', 'gb-eng'],
    COD: ['刚果（金）', 'cd'],
    USA: ['美国', 'us'],
    BIH: ['波黑', 'ba'],
    BEL: ['比利时', 'be'],
    SEN: ['塞内加尔', 'sn'],
    POR: ['葡萄牙', 'pt'],
    CRO: ['克罗地亚', 'hr'],
    ESP: ['西班牙', 'es'],
    AUT: ['奥地利', 'at'],
    SUI: ['瑞士', 'ch'],
    ALG: ['阿尔及利亚', 'dz'],
    ARG: ['阿根廷', 'ar'],
    CPV: ['佛得角', 'cv'],
    COL: ['哥伦比亚', 'co'],
    GHA: ['加纳', 'gh'],
    AUS: ['澳大利亚', 'au'],
    EGY: ['埃及', 'eg']
  };

  const matches = {
    73: { round: '32强', date: '6月28日', slots: ['RSA', 'CAN'], pick: 'CAN' },
    74: { round: '32强', date: '6月29日', slots: ['GER', 'PAR'] },
    75: { round: '32强', date: '6月29日', slots: ['NED', 'MAR'] },
    76: { round: '32强', date: '6月29日', slots: ['BRA', 'JPN'] },
    77: { round: '32强', date: '6月30日', slots: ['FRA', 'SWE'] },
    78: { round: '32强', date: '6月30日', slots: ['CIV', 'NOR'] },
    79: { round: '32强', date: '6月30日', slots: ['MEX', 'ECU'] },
    80: { round: '32强', date: '6月30日', slots: ['ENG', 'COD'] },
    81: { round: '32强', date: '7月1日', slots: ['USA', 'BIH'] },
    82: { round: '32强', date: '7月1日', slots: ['BEL', 'SEN'] },
    83: { round: '32强', date: '7月1日', slots: ['POR', 'CRO'] },
    84: { round: '32强', date: '7月1日', slots: ['ESP', 'AUT'] },
    85: { round: '32强', date: '7月2日', slots: ['SUI', 'ALG'] },
    86: { round: '32强', date: '7月2日', slots: ['ARG', 'CPV'] },
    87: { round: '32强', date: '7月2日', slots: ['COL', 'GHA'] },
    88: { round: '32强', date: '7月3日', slots: ['AUS', 'EGY'] },
    89: { round: '16强', date: '7月4日', slots: ['胜者 M74', '胜者 M77'] },
    90: { round: '16强', date: '7月4日', slots: ['CAN', '胜者 M75'] },
    91: { round: '16强', date: '7月5日', slots: ['胜者 M76', '胜者 M78'] },
    92: { round: '16强', date: '7月5日', slots: ['胜者 M79', '胜者 M80'] },
    93: { round: '16强', date: '7月6日', slots: ['胜者 M83', '胜者 M84'] },
    94: { round: '16强', date: '7月6日', slots: ['胜者 M81', '胜者 M82'] },
    95: { round: '16强', date: '7月7日', slots: ['胜者 M86', '胜者 M88'] },
    96: { round: '16强', date: '7月7日', slots: ['胜者 M85', '胜者 M87'] },
    97: { round: '8强', date: '7月9日', slots: ['胜者 M89', '胜者 M90'] },
    98: { round: '8强', date: '7月9日', slots: ['胜者 M93', '胜者 M94'] },
    99: { round: '8强', date: '7月10日', slots: ['胜者 M91', '胜者 M92'] },
    100: { round: '8强', date: '7月10日', slots: ['胜者 M95', '胜者 M96'] },
    101: { round: '半决赛', date: '7月14日', slots: ['胜者 M97', '胜者 M98'] },
    102: { round: '半决赛', date: '7月15日', slots: ['胜者 M99', '胜者 M100'] }
  };

  const leftOrder = [74, 77, 73, 75, 83, 84, 81, 82];
  const rightOrder = [76, 78, 79, 80, 86, 88, 85, 87];
  const links = [
    [74, 89], [77, 89], [73, 90], [75, 90], [83, 93], [84, 93], [81, 94], [82, 94],
    [89, 97], [90, 97], [93, 98], [94, 98], [97, 101], [98, 101], [101, 'champion-left'],
    [76, 91], [78, 91], [79, 92], [80, 92], [86, 95], [88, 95], [85, 96], [87, 96],
    [91, 99], [92, 99], [95, 100], [96, 100], [99, 102], [100, 102], [102, 'champion-right']
  ];

  const cardWidth = 288;
  const cardCenterY = 79;
  const rowStart = 170;
  const rowGap = 220;
  const center = { x: 1480, y: 791, width: 430, height: 450 };
  const xByRound = {
    left32: 100,
    left16: 445,
    left8: 810,
    left4: 1145,
    right4: 1957,
    right8: 2292,
    right16: 2657,
    right32: 3002
  };
  const positions = {};

  leftOrder.forEach((id, index) => {
    positions[id] = { side: 'left', x: xByRound.left32, y: rowStart + index * rowGap };
  });
  rightOrder.forEach((id, index) => {
    positions[id] = { side: 'right', x: xByRound.right32, y: rowStart + index * rowGap };
  });

  function centerY(a, b) {
    return (positions[a].y + positions[b].y) / 2;
  }

  Object.assign(positions, {
    89: { side: 'left', x: xByRound.left16, y: centerY(74, 77) },
    90: { side: 'left', x: xByRound.left16, y: centerY(73, 75) },
    93: { side: 'left', x: xByRound.left16, y: centerY(83, 84) },
    94: { side: 'left', x: xByRound.left16, y: centerY(81, 82) },
    91: { side: 'right', x: xByRound.right16, y: centerY(76, 78) },
    92: { side: 'right', x: xByRound.right16, y: centerY(79, 80) },
    95: { side: 'right', x: xByRound.right16, y: centerY(86, 88) },
    96: { side: 'right', x: xByRound.right16, y: centerY(85, 87) }
  });
  Object.assign(positions, {
    97: { side: 'left', x: xByRound.left8, y: centerY(89, 90) },
    98: { side: 'left', x: xByRound.left8, y: centerY(93, 94) },
    99: { side: 'right', x: xByRound.right8, y: centerY(91, 92) },
    100: { side: 'right', x: xByRound.right8, y: centerY(95, 96) }
  });
  Object.assign(positions, {
    101: { side: 'left', x: xByRound.left4, y: centerY(97, 98) },
    102: { side: 'right', x: xByRound.right4, y: centerY(99, 100) }
  });
  Object.assign(positions, {
    'champion-left': { side: 'center', x: center.x, y: center.y + center.height / 2 - cardCenterY },
    'champion-right': {
      side: 'center',
      x: center.x + center.width,
      y: center.y + center.height / 2 - cardCenterY
    }
  });

  const nodes = document.querySelector('#nodes');
  const connectors = document.querySelector('#connectors');
  const canvas = document.querySelector('#canvas');
  const viewport = document.querySelector('#viewport');
  const readout = document.querySelector('#zoom-readout');

  function flagUrl(code) {
    return `https://flagcdn.com/w80/${code}.png`;
  }

  function renderTeam(slot, match) {
    if (!teams[slot]) {
      return `
        <button class="team" type="button" disabled>
          <span class="placeholder-flag"></span>
          <span class="team-name">${slot}</span>
          <span class="team-code">待定</span>
        </button>
      `;
    }

    const [name, flag] = teams[slot];
    const picked = match.pick === slot ? ' is-picked' : '';
    return `
      <button class="team${picked}" type="button">
        <img class="flag" src="${flagUrl(flag)}" alt="">
        <span class="team-name">${name}</span>
        <span class="team-code">${slot}</span>
      </button>
    `;
  }

  function renderMatch(id, match) {
    const pos = positions[id];

    return `
      <article class="match ${match.round === '32强' ? '' : 'is-next'}" style="left:${pos.x}px;top:${pos.y}px" data-match="${id}">
        <header class="match-header">
          <span class="match-id">M${id}</span>
          <span>${match.date}</span>
        </header>
        <div class="teams">
          ${match.slots.map((slot) => renderTeam(slot, match)).join('')}
        </div>
      </article>
    `;
  }

  function renderChampion() {
    return `
      <section class="champion-hub" style="left:${center.x}px;top:${center.y}px" data-match="104">
        <img class="trophy-burst" src="./assets/champion-trophy-burst.png" alt="" aria-hidden="true">
        <div class="champion-copy">
          <div class="champion-ring">冠</div>
          <span class="champion-label">决赛中心 · M104</span>
          <strong class="champion-name">世界冠军</strong>
          <div class="final-slots">
            <div class="final-slot"><span>左半区冠军</span><span>胜者 M101</span></div>
            <div class="final-slot"><span>右半区冠军</span><span>胜者 M102</span></div>
          </div>
        </div>
      </section>
    `;
  }

  function renderLabels() {
    const labels = [
      ['左半区 32强', xByRound.left32, 96, ''],
      ['16强', xByRound.left16, 96, ''],
      ['8强', xByRound.left8, 96, ''],
      ['半决赛', xByRound.left4, 96, ''],
      ['右半区 32强', xByRound.right32, 96, 'is-right'],
      ['16强', xByRound.right16, 96, 'is-right'],
      ['8强', xByRound.right8, 96, 'is-right'],
      ['半决赛', xByRound.right4, 96, 'is-right']
    ];

    return `
      <div class="zone-label" style="left:${xByRound.left32}px;top:56px">左半区 · 八组对阵</div>
      <div class="zone-label" style="left:${xByRound.right32 - 72}px;top:56px;text-align:right">右半区 · 八组对阵</div>
      ${labels
        .map(
          ([label, x, y, className]) =>
            `<div class="round-label ${className}" style="left:${x}px;top:${y}px">${label}</div>`
        )
        .join('')}
    `;
  }

  function connectorPath(from, to) {
    const fromPos = positions[from];
    const toPos = positions[to];
    const fromIsRight = fromPos.side === 'right';
    const toIsCenterRight = to === 'champion-right';
    const fromX = fromIsRight ? fromPos.x : fromPos.x + cardWidth;
    const fromY = fromPos.y + cardCenterY;
    const toX = toIsCenterRight
      ? toPos.x
      : fromIsRight
        ? toPos.x + cardWidth
        : toPos.x;
    const toY = toPos.y + cardCenterY;
    const curve = Math.max(72, Math.abs(toX - fromX) * 0.5);
    const c1 = fromIsRight ? fromX - curve : fromX + curve;
    const c2 = fromIsRight ? toX + curve : toX - curve;
    const active = from === 73 || to === 90 ? ' is-active' : '';

    return `<path class="connector${active}" d="M ${fromX} ${fromY} C ${c1} ${fromY}, ${c2} ${toY}, ${toX} ${toY}" />`;
  }

  function render() {
    nodes.innerHTML = `
      ${renderLabels()}
      ${Object.entries(matches).map(([id, match]) => renderMatch(id, match)).join('')}
      ${renderChampion()}
    `;
    connectors.innerHTML = links.map(([from, to]) => connectorPath(from, to)).join('');
  }

  let view = { x: 6, y: 36, scale: 0.39 };
  let drag = null;

  function applyView() {
    canvas.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
    readout.textContent = `${Math.round(view.scale * 100)}%`;
  }

  function zoom(delta) {
    view.scale = Math.min(1.28, Math.max(0.42, view.scale + delta));
    applyView();
  }

  viewport.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) {
      return;
    }

    drag = { x: event.clientX, y: event.clientY, startX: view.x, startY: view.y };
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture(event.pointerId);
  });

  viewport.addEventListener('pointermove', (event) => {
    if (!drag) {
      return;
    }

    view.x = drag.startX + event.clientX - drag.x;
    view.y = drag.startY + event.clientY - drag.y;
    applyView();
  });

  viewport.addEventListener('pointerup', () => {
    drag = null;
    viewport.classList.remove('is-dragging');
  });

  viewport.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      zoom(event.deltaY > 0 ? -0.04 : 0.04);
    },
    { passive: false }
  );

  document.querySelector('#zoom-in').addEventListener('click', () => zoom(0.08));
  document.querySelector('#zoom-out').addEventListener('click', () => zoom(-0.08));
  document.querySelector('#reset-view').addEventListener('click', () => {
    view = { x: 6, y: 36, scale: 0.39 };
    applyView();
  });

  render();
  applyView();
} catch (error) {
  document.body.dataset.moduleError = error instanceof Error ? error.message : String(error);
  const errorBox = document.createElement('pre');
  errorBox.style.cssText =
    'position:fixed;left:16px;bottom:16px;z-index:9999;max-width:720px;padding:12px;background:#fff2f2;color:#7a1d1d;border:1px solid #e09a9a;border-radius:8px;white-space:pre-wrap;';
  errorBox.textContent = `设计稿渲染错误：${document.body.dataset.moduleError}`;
  document.body.append(errorBox);
}
