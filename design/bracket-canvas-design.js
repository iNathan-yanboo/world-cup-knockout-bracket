document.body.dataset.moduleLoaded = 'true';

try {
if (!document.querySelector('.match')) {
  const teams = {
    RSA: ['South Africa', 'za'],
    CAN: ['Canada', 'ca'],
    GER: ['Germany', 'de'],
    PAR: ['Paraguay', 'py'],
    NED: ['Netherlands', 'nl'],
    MAR: ['Morocco', 'ma'],
    BRA: ['Brazil', 'br'],
    JPN: ['Japan', 'jp'],
    FRA: ['France', 'fr'],
    SWE: ['Sweden', 'se'],
    CIV: ['Ivory Coast', 'ci'],
    NOR: ['Norway', 'no'],
    MEX: ['Mexico', 'mx'],
    ECU: ['Ecuador', 'ec'],
    ENG: ['England', 'gb-eng'],
    COD: ['DR Congo', 'cd'],
    USA: ['USA', 'us'],
    BIH: ['Bosnia and Herzegovina', 'ba'],
    BEL: ['Belgium', 'be'],
    SEN: ['Senegal', 'sn'],
    POR: ['Portugal', 'pt'],
    CRO: ['Croatia', 'hr'],
    ESP: ['Spain', 'es'],
    AUT: ['Austria', 'at'],
    SUI: ['Switzerland', 'ch'],
    ALG: ['Algeria', 'dz'],
    ARG: ['Argentina', 'ar'],
    CPV: ['Cape Verde', 'cv'],
    COL: ['Colombia', 'co'],
    GHA: ['Ghana', 'gh'],
    AUS: ['Australia', 'au'],
    EGY: ['Egypt', 'eg']
  };

  const matches = {
    73: { round: 'Round of 32', date: 'Jun 28', slots: ['RSA', 'CAN'], pick: 'CAN' },
    74: { round: 'Round of 32', date: 'Jun 29', slots: ['GER', 'PAR'] },
    75: { round: 'Round of 32', date: 'Jun 29', slots: ['NED', 'MAR'] },
    76: { round: 'Round of 32', date: 'Jun 29', slots: ['BRA', 'JPN'] },
    77: { round: 'Round of 32', date: 'Jun 30', slots: ['FRA', 'SWE'] },
    78: { round: 'Round of 32', date: 'Jun 30', slots: ['CIV', 'NOR'] },
    79: { round: 'Round of 32', date: 'Jun 30', slots: ['MEX', 'ECU'] },
    80: { round: 'Round of 32', date: 'Jun 30', slots: ['ENG', 'COD'] },
    81: { round: 'Round of 32', date: 'Jul 1', slots: ['USA', 'BIH'] },
    82: { round: 'Round of 32', date: 'Jul 1', slots: ['BEL', 'SEN'] },
    83: { round: 'Round of 32', date: 'Jul 1', slots: ['POR', 'CRO'] },
    84: { round: 'Round of 32', date: 'Jul 1', slots: ['ESP', 'AUT'] },
    85: { round: 'Round of 32', date: 'Jul 2', slots: ['SUI', 'ALG'] },
    86: { round: 'Round of 32', date: 'Jul 2', slots: ['ARG', 'CPV'] },
    87: { round: 'Round of 32', date: 'Jul 2', slots: ['COL', 'GHA'] },
    88: { round: 'Round of 32', date: 'Jul 3', slots: ['AUS', 'EGY'] },
    89: { round: 'Round of 16', date: 'Jul 4', slots: ['Winner M74', 'Winner M77'] },
    90: { round: 'Round of 16', date: 'Jul 4', slots: ['CAN', 'Winner M75'] },
    91: { round: 'Round of 16', date: 'Jul 5', slots: ['Winner M76', 'Winner M78'] },
    92: { round: 'Round of 16', date: 'Jul 5', slots: ['Winner M79', 'Winner M80'] },
    93: { round: 'Round of 16', date: 'Jul 6', slots: ['Winner M83', 'Winner M84'] },
    94: { round: 'Round of 16', date: 'Jul 6', slots: ['Winner M81', 'Winner M82'] },
    95: { round: 'Round of 16', date: 'Jul 7', slots: ['Winner M86', 'Winner M88'] },
    96: { round: 'Round of 16', date: 'Jul 7', slots: ['Winner M85', 'Winner M87'] },
    97: { round: 'Quarterfinals', date: 'Jul 9', slots: ['Winner M89', 'Winner M90'] },
    98: { round: 'Quarterfinals', date: 'Jul 9', slots: ['Winner M93', 'Winner M94'] },
    99: { round: 'Quarterfinals', date: 'Jul 10', slots: ['Winner M91', 'Winner M92'] },
    100: { round: 'Quarterfinals', date: 'Jul 10', slots: ['Winner M95', 'Winner M96'] },
    101: { round: 'Semifinals', date: 'Jul 14', slots: ['Winner M97', 'Winner M98'] },
    102: { round: 'Semifinals', date: 'Jul 15', slots: ['Winner M99', 'Winner M100'] },
    104: { round: 'Final', date: 'Jul 19', slots: ['Winner M101', 'Winner M102'] }
  };

  const order = [74, 77, 73, 75, 76, 78, 79, 80, 83, 84, 81, 82, 86, 88, 85, 87];
  const links = [
    [74, 89], [77, 89], [73, 90], [75, 90], [76, 91], [78, 91], [79, 92], [80, 92],
    [83, 93], [84, 93], [81, 94], [82, 94], [86, 95], [88, 95], [85, 96], [87, 96],
    [89, 97], [90, 97], [93, 98], [94, 98], [91, 99], [92, 99], [95, 100], [96, 100],
    [97, 101], [98, 101], [99, 102], [100, 102], [101, 104], [102, 104]
  ];

  const xByRound = {
    r32: 80,
    r16: 450,
    qf: 820,
    sf: 1190,
    final: 1560,
    champion: 1900
  };
  const positions = {};
  order.forEach((id, index) => {
    positions[id] = { x: xByRound.r32, y: 80 + index * 108 };
  });

  function centerY(a, b) {
    return (positions[a].y + positions[b].y) / 2;
  }

  Object.assign(positions, {
    89: { x: xByRound.r16, y: centerY(74, 77) },
    90: { x: xByRound.r16, y: centerY(73, 75) },
    91: { x: xByRound.r16, y: centerY(76, 78) },
    92: { x: xByRound.r16, y: centerY(79, 80) },
    93: { x: xByRound.r16, y: centerY(83, 84) },
    94: { x: xByRound.r16, y: centerY(81, 82) },
    95: { x: xByRound.r16, y: centerY(86, 88) },
    96: { x: xByRound.r16, y: centerY(85, 87) }
  });
  Object.assign(positions, {
    97: { x: xByRound.qf, y: centerY(89, 90) },
    98: { x: xByRound.qf, y: centerY(93, 94) },
    99: { x: xByRound.qf, y: centerY(91, 92) },
    100: { x: xByRound.qf, y: centerY(95, 96) }
  });
  Object.assign(positions, {
    101: { x: xByRound.sf, y: centerY(97, 98) },
    102: { x: xByRound.sf, y: centerY(99, 100) }
  });
  Object.assign(positions, {
    104: { x: xByRound.final, y: centerY(101, 102) }
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
          <span class="team-code">TBD</span>
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

  function render() {
    nodes.innerHTML = [
      ['Round of 32', xByRound.r32],
      ['Round of 16', xByRound.r16],
      ['Quarterfinals', xByRound.qf],
      ['Semifinals', xByRound.sf],
      ['Final', xByRound.final],
      ['Champion', xByRound.champion]
    ]
      .map(([label, x]) => `<div class="round-label" style="left:${x}px;top:38px">${label}</div>`)
      .join('');

    for (const [id, match] of Object.entries(matches)) {
      const pos = positions[id];
      nodes.insertAdjacentHTML(
        'beforeend',
        `
          <article class="match ${match.round === 'Round of 32' ? '' : 'is-next'}" style="left:${pos.x}px;top:${pos.y}px" data-match="${id}">
            <header class="match-header">
              <span class="match-id">M${id}</span>
              <span>${match.date}</span>
            </header>
            <div class="teams">
              ${match.slots.map((slot) => renderTeam(slot, match)).join('')}
            </div>
          </article>
        `
      );
    }

    nodes.insertAdjacentHTML(
      'beforeend',
      `
        <section class="champion" style="left:${xByRound.champion}px;top:${positions[104].y - 38}px">
          <span class="champion-label">Champion</span>
          <span class="champion-name">Winner M104</span>
        </section>
      `
    );

    connectors.innerHTML = links
      .map(([from, to]) => {
        const fromPos = positions[from];
        const toPos = positions[to];
        const x1 = fromPos.x + 290;
        const y1 = fromPos.y + 48;
        const x2 = toPos.x;
        const y2 = toPos.y + 48;
        const mid = x1 + (x2 - x1) * 0.5;
        const active = from === 73 || to === 90 ? ' is-active' : '';
        return `<path class="connector${active}" d="M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}" />`;
      })
      .join('');
  }

  let view = { x: -8, y: 12, scale: 0.82 };
  let drag = null;

  function applyView() {
    canvas.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
    readout.textContent = `${Math.round(view.scale * 100)}%`;
  }

  function zoom(delta) {
    view.scale = Math.min(1.35, Math.max(0.42, view.scale + delta));
    applyView();
  }

  viewport.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;
    drag = { x: event.clientX, y: event.clientY, startX: view.x, startY: view.y };
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture(event.pointerId);
  });

  viewport.addEventListener('pointermove', (event) => {
    if (!drag) return;
    view.x = drag.startX + event.clientX - drag.x;
    view.y = drag.startY + event.clientY - drag.y;
    applyView();
  });

  viewport.addEventListener('pointerup', () => {
    drag = null;
    viewport.classList.remove('is-dragging');
  });

  viewport.addEventListener('wheel', (event) => {
    event.preventDefault();
    zoom(event.deltaY > 0 ? -0.04 : 0.04);
  }, { passive: false });

  document.querySelector('#zoom-in').addEventListener('click', () => zoom(0.08));
  document.querySelector('#zoom-out').addEventListener('click', () => zoom(-0.08));
  document.querySelector('#reset-view').addEventListener('click', () => {
    view = { x: -8, y: 12, scale: 0.82 };
    applyView();
  });

  render();
  applyView();
}
} catch (error) {
  document.body.dataset.moduleError = error instanceof Error ? error.message : String(error);
  const errorBox = document.createElement('pre');
  errorBox.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:9999;max-width:720px;padding:12px;background:#fff2f2;color:#7a1d1d;border:1px solid #e09a9a;border-radius:8px;white-space:pre-wrap;';
  errorBox.textContent = `Design draft render error: ${document.body.dataset.moduleError}`;
  document.body.append(errorBox);
}
