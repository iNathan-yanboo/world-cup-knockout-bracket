const exportFooterHeight = 140;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDatePart(value) {
  return String(value).padStart(2, '0');
}

function formatLocalDate(date) {
  return [
    date.getFullYear(),
    formatDatePart(date.getMonth() + 1),
    formatDatePart(date.getDate())
  ].join('-');
}

function formatGeneratedTime(date) {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

function readCanvasDimension(canvas, axis) {
  const offsetKey = axis === 'width' ? 'offsetWidth' : 'offsetHeight';
  const scrollKey = axis === 'width' ? 'scrollWidth' : 'scrollHeight';
  const rectValue = canvas.getBoundingClientRect?.()[axis];
  const styleValue = Number.parseFloat(canvas.style?.[axis]);

  return Math.round(
    Number(canvas[offsetKey]) ||
      Number(canvas[scrollKey]) ||
      styleValue ||
      Number(rectValue) ||
      0
  );
}

export function resolveCanvasSize(canvas) {
  if (!canvas) {
    throw new Error('没有找到可导出的对阵图画布');
  }

  const width = readCanvasDimension(canvas, 'width');
  const height = readCanvasDimension(canvas, 'height');

  if (!width || !height) {
    throw new Error('对阵图画布尺寸无效，无法导出图片');
  }

  return { width, height };
}

export function buildExportFooter({
  domain = 'worldcup.inathan.wang',
  repoUrl = 'https://github.com/iNathan-yanboo/world-cup-knockout-bracket',
  snapshotDate = '未知',
  generatedAt = new Date()
} = {}) {
  const credits = buildExportCredits({ domain, repoUrl, snapshotDate, generatedAt });

  return `
    <footer class="snapshot-export-footer">
      <div>
        <strong>${escapeHtml(credits.domain)}</strong>
        <span>${escapeHtml(credits.title)}</span>
      </div>
      <div>
        <span>${escapeHtml(credits.repoUrl)}</span>
        <span>${escapeHtml(credits.meta)}</span>
      </div>
    </footer>
  `;
}

export function buildExportCredits({
  domain = 'worldcup.inathan.wang',
  repoUrl = 'https://github.com/iNathan-yanboo/world-cup-knockout-bracket',
  snapshotDate = '未知',
  generatedAt = new Date()
} = {}) {
  return {
    domain,
    title: '世界杯淘汰赛晋级图',
    repoUrl: repoUrl.replace(/^https?:\/\//, ''),
    meta: `数据快照：${snapshotDate} · 生成时间：${formatGeneratedTime(generatedAt)}`
  };
}

export function buildSnapshotFilename(generatedAt = new Date()) {
  return `world-cup-bracket-${formatLocalDate(generatedAt)}.png`;
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => resolve(reader.result));
    reader.addEventListener('error', () => reject(reader.error));
    reader.readAsDataURL(blob);
  });
}

async function fetchImageAsDataUrl(src) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(src, {
      cache: 'force-cache',
      mode: 'cors',
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`图片资源读取失败：${response.status}`);
    }

    return blobToDataUrl(await response.blob());
  } finally {
    window.clearTimeout(timeout);
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', () => reject(new Error('导出图片渲染失败')));
    image.src = src;
  });
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('PNG 图片生成失败'));
        return;
      }

      resolve(blob);
    }, 'image/png');
  });
}

function downloadBlob(blob, filename, documentRef) {
  const url = URL.createObjectURL(blob);
  const link = documentRef.createElement('a');

  link.href = url;
  link.download = filename;
  documentRef.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function positionFromStyle(element) {
  return {
    x: Number.parseFloat(element.style.left) || element.offsetLeft || 0,
    y: Number.parseFloat(element.style.top) || element.offsetTop || 0
  };
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  const right = x + width;
  const bottom = y + height;

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(right - radius, y);
  ctx.quadraticCurveTo(right, y, right, y + radius);
  ctx.lineTo(right, bottom - radius);
  ctx.quadraticCurveTo(right, bottom, right - radius, bottom);
  ctx.lineTo(x + radius, bottom);
  ctx.quadraticCurveTo(x, bottom, x, bottom - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function fillRoundedRect(ctx, x, y, width, height, radius, fillStyle) {
  ctx.fillStyle = fillStyle;
  drawRoundedRect(ctx, x, y, width, height, radius);
  ctx.fill();
}

function strokeRoundedRect(ctx, x, y, width, height, radius, strokeStyle, lineWidth = 1) {
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  drawRoundedRect(ctx, x, y, width, height, radius);
  ctx.stroke();
}

function setFont(ctx, size, weight = 760) {
  ctx.font = `${weight} ${size}px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
}

function textTokens(text) {
  if (/\s/.test(text)) {
    return text.split(/(\s+)/).filter(Boolean);
  }

  return [...text];
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) {
  const tokens = textTokens(text);
  const lines = [];
  let line = '';

  tokens.forEach((token) => {
    const next = line ? `${line}${token}` : token;

    if (ctx.measureText(next).width <= maxWidth || !line) {
      line = next;
      return;
    }

    lines.push(line.trim());
    line = token.trimStart();
  });

  if (line) {
    lines.push(line.trim());
  }

  lines.slice(0, maxLines).forEach((lineText, index) => {
    const isLastVisibleLine = index === maxLines - 1 && lines.length > maxLines;
    const output = isLastVisibleLine ? `${lineText.replace(/.$/, '')}…` : lineText;

    ctx.fillText(output, x, y + index * lineHeight);
  });
}

function drawImageCover(ctx, image, x, y, width, height) {
  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;
  const scale = Math.max(width / imageWidth, height / imageHeight);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (imageWidth - sourceWidth) / 2;
  const sourceY = (imageHeight - sourceHeight) / 2;

  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

async function loadImageForCanvas(src, baseUrl, cache) {
  if (!src) {
    return null;
  }

  const absoluteSrc = new URL(src, baseUrl).href;

  if (!cache.has(absoluteSrc)) {
    cache.set(
      absoluteSrc,
      fetchImageAsDataUrl(absoluteSrc)
        .then((dataUrl) => loadImage(dataUrl))
        .catch(() => null)
    );
  }

  return cache.get(absoluteSrc);
}

async function drawFlag(ctx, imageElement, x, y, width, height, baseUrl, imageCache) {
  const image = await loadImageForCanvas(imageElement?.getAttribute('src'), baseUrl, imageCache);

  fillRoundedRect(ctx, x, y, width, height, 4, 'rgba(44, 134, 80, 0.1)');

  if (image) {
    ctx.save();
    drawRoundedRect(ctx, x, y, width, height, 4);
    ctx.clip();
    drawImageCover(ctx, image, x, y, width, height);
    ctx.restore();
  } else {
    ctx.fillStyle = 'rgba(44, 134, 80, 0.28)';
    ctx.fillRect(x + width * 0.44, y, width * 0.12, height);
  }

  strokeRoundedRect(ctx, x, y, width, height, 4, 'rgba(19, 34, 28, 0.08)');
}

function drawExportBackground(ctx, width, height) {
  const fieldGradient = ctx.createLinearGradient(0, 0, width, height);

  fieldGradient.addColorStop(0, '#eef8e9');
  fieldGradient.addColorStop(0.48, '#fbfdf8');
  fieldGradient.addColorStop(1, '#e1f0dc');
  ctx.fillStyle = fieldGradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += 120) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += 120) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  strokeRoundedRect(ctx, 56, 56, width - 112, height - 112, 30, 'rgba(255, 255, 255, 0.72)', 2);

  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 210, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.64)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawConnectors(ctx, sourceCanvas) {
  sourceCanvas.querySelectorAll('.connector').forEach((connector) => {
    const path = new Path2D(connector.getAttribute('d'));
    const active = connector.classList.contains('is-active');

    ctx.strokeStyle = active ? '#25834c' : 'rgba(44, 134, 80, 0.34)';
    ctx.lineWidth = active ? 4 : 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(path);
  });
}

function drawLabels(ctx, sourceCanvas) {
  sourceCanvas.querySelectorAll('.zone-label, .round-label').forEach((label) => {
    const { x, y } = positionFromStyle(label);
    const isRound = label.classList.contains('round-label');
    const isRight = label.classList.contains('is-right');
    const isCenter = label.classList.contains('is-center');

    setFont(ctx, isRound ? 12 : 14, isRound ? 900 : 820);
    ctx.fillStyle = isRound ? '#174f31' : 'rgba(23, 79, 49, 0.54)';
    ctx.textAlign = isCenter ? 'center' : isRight ? 'right' : 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(label.textContent.trim(), isCenter ? x + 144 : isRight ? x + 288 : x, y);
  });
}

async function drawTeamButton(ctx, button, cardX, cardY, baseUrl, imageCache) {
  const x = cardX + button.offsetLeft;
  const y = cardY + button.offsetTop;
  const width = button.offsetWidth;
  const height = button.offsetHeight;
  const selected = button.classList.contains('is-selected');
  const locked = button.classList.contains('is-locked');
  const placeholder = button.classList.contains('is-placeholder');

  fillRoundedRect(
    ctx,
    x,
    y,
    width,
    height,
    8,
    selected ? (locked ? '#fff8dc' : '#ebf7ea') : 'rgba(255, 255, 255, 0.76)'
  );
  strokeRoundedRect(
    ctx,
    x,
    y,
    width,
    height,
    8,
    selected
      ? locked
        ? 'rgba(216, 171, 54, 0.6)'
        : 'rgba(44, 134, 80, 0.62)'
      : 'rgba(19, 34, 28, 0.08)'
  );

  if (placeholder) {
    fillRoundedRect(ctx, x + 10, y + 14, 28, 20, 4, 'rgba(44, 134, 80, 0.1)');
  } else {
    await drawFlag(ctx, button.querySelector('img.flag'), x + 10, y + 14, 28, 20, baseUrl, imageCache);
  }

  setFont(ctx, 14, 820);
  ctx.fillStyle = placeholder ? 'rgba(19, 34, 28, 0.44)' : '#13221c';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  drawWrappedText(
    ctx,
    button.querySelector('.team-name')?.textContent.trim() ?? '',
    x + 58,
    y + 22,
    132,
    15,
    2
  );

  setFont(ctx, 11, 850);
  ctx.fillStyle = '#6a7a71';
  ctx.textAlign = 'right';
  ctx.fillText(button.querySelector('.team-code')?.textContent.trim() ?? '', x + width - 10, y + 24);
}

async function drawMatchCard(ctx, card, baseUrl, imageCache) {
  const { x, y } = positionFromStyle(card);
  const width = card.offsetWidth;
  const height = card.offsetHeight;
  const locked = card.classList.contains('is-locked');
  const final = card.classList.contains('is-final');

  ctx.save();
  ctx.shadowColor = 'rgba(23, 79, 49, 0.15)';
  ctx.shadowBlur = final ? 32 : 18;
  ctx.shadowOffsetY = final ? 18 : 10;
  fillRoundedRect(
    ctx,
    x,
    y,
    width,
    height,
    8,
    final ? 'rgba(255, 252, 238, 0.97)' : 'rgba(255, 255, 255, 0.94)'
  );
  ctx.restore();

  strokeRoundedRect(
    ctx,
    x,
    y,
    width,
    height,
    8,
    locked || final ? 'rgba(216, 171, 54, 0.5)' : 'rgba(23, 79, 49, 0.13)'
  );

  setFont(ctx, 11, 860);
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#174f31';
  ctx.textAlign = 'left';
  ctx.fillText(card.querySelector('.match-id')?.textContent.trim() ?? '', x + 14, y + 12);
  ctx.fillStyle = '#6a7a71';
  ctx.textAlign = 'right';
  ctx.fillText(card.querySelector('.match-date')?.textContent.trim() ?? '', x + width - 14, y + 12);

  setFont(ctx, 10, 760);
  ctx.fillStyle = 'rgba(23, 79, 49, 0.66)';
  ctx.textAlign = 'left';
  drawWrappedText(
    ctx,
    card.querySelector('.match-status')?.textContent.trim() ?? '',
    x + 14,
    y + 40,
    width - 28,
    13,
    2
  );

  for (const button of card.querySelectorAll('.team-button')) {
    await drawTeamButton(ctx, button, x, y, baseUrl, imageCache);
  }
}

async function drawChampion(ctx, sourceCanvas, baseUrl, imageCache) {
  const hub = sourceCanvas.querySelector('.champion-hub');

  if (!hub) {
    return;
  }

  const { x, y } = positionFromStyle(hub);
  const width = hub.offsetWidth;
  const height = hub.offsetHeight;
  const trophy = await loadImageForCanvas(
    hub.querySelector('.trophy-burst')?.getAttribute('src'),
    baseUrl,
    imageCache
  );

  if (trophy) {
    drawImageCover(ctx, trophy, x + width / 2 - 250, y - 330, 500, 500);
  }

  ctx.save();
  ctx.shadowColor = 'rgba(23, 79, 49, 0.25)';
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 20;
  fillRoundedRect(ctx, x, y, width, height, 14, 'rgba(255, 251, 234, 0.96)');
  ctx.restore();
  strokeRoundedRect(ctx, x, y, width, height, 14, 'rgba(216, 171, 54, 0.46)');

  ctx.beginPath();
  ctx.arc(x + width / 2, y + 188, 29, 0, Math.PI * 2);
  ctx.fillStyle = '#fffdf0';
  ctx.fill();
  ctx.strokeStyle = 'rgba(216, 171, 54, 0.52)';
  ctx.stroke();

  setFont(ctx, 17, 950);
  ctx.fillStyle = '#9b6a13';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('冠', x + width / 2, y + 188);

  setFont(ctx, 13, 900);
  ctx.textBaseline = 'top';
  ctx.fillText(hub.querySelector('.champion-label')?.textContent.trim() ?? '总冠军', x + width / 2, y + 226);

  setFont(ctx, 36, 950);
  ctx.fillStyle = '#13221c';
  ctx.fillText(hub.querySelector('.champion-name')?.textContent.trim() ?? '世界冠军', x + width / 2, y + 252);

  const teamCard = hub.querySelector('.champion-team-card');
  if (!teamCard) {
    return;
  }

  const cardX = x + teamCard.offsetLeft;
  const cardY = y + teamCard.offsetTop;
  const cardWidth = teamCard.offsetWidth;
  const cardHeight = teamCard.offsetHeight;

  fillRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 8, 'rgba(255, 255, 255, 0.8)');
  strokeRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 8, 'rgba(216, 171, 54, 0.24)');
  await drawFlag(ctx, teamCard.querySelector('img.champion-flag'), cardX + 12, cardY + 13, 30, 22, baseUrl, imageCache);

  setFont(ctx, 15, 850);
  ctx.fillStyle = '#13221c';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(teamCard.children[1]?.textContent.trim() ?? '等待决赛胜者', cardX + 54, cardY + cardHeight / 2);

  setFont(ctx, 12, 900);
  ctx.fillStyle = '#6a7a71';
  ctx.textAlign = 'right';
  ctx.fillText(
    teamCard.querySelector('.champion-code')?.textContent.trim() ?? '待定',
    cardX + cardWidth - 12,
    cardY + cardHeight / 2
  );
}

function drawExportFooter(ctx, width, height, { domain, repoUrl, snapshotDate, generatedAt }) {
  const credits = buildExportCredits({ domain, repoUrl, snapshotDate, generatedAt });

  ctx.fillStyle = '#f8fbf4';
  ctx.fillRect(0, height, width, exportFooterHeight);
  ctx.strokeStyle = 'rgba(23, 79, 49, 0.16)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(width, height);
  ctx.stroke();

  setFont(ctx, 42, 950);
  ctx.fillStyle = '#174f31';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(credits.domain, 96, height + 70);

  setFont(ctx, 30, 780);
  ctx.fillStyle = 'rgba(19, 34, 28, 0.72)';
  ctx.fillText(credits.title, 610, height + 70);

  ctx.textAlign = 'right';
  ctx.fillText(`${credits.repoUrl} · ${credits.meta}`, width - 96, height + 70);
}

async function renderSnapshotCanvas(sourceCanvas, options) {
  const {
    documentRef,
    width,
    height,
    domain,
    repoUrl,
    snapshotDate,
    generatedAt
  } = options;
  const output = documentRef.createElement('canvas');
  const ctx = output.getContext('2d');
  const imageCache = new Map();

  output.width = width;
  output.height = height + exportFooterHeight;

  await documentRef.fonts?.ready;
  drawExportBackground(ctx, width, height);
  drawConnectors(ctx, sourceCanvas);
  drawLabels(ctx, sourceCanvas);

  for (const card of sourceCanvas.querySelectorAll('.match-card')) {
    await drawMatchCard(ctx, card, documentRef.baseURI, imageCache);
  }

  await drawChampion(ctx, sourceCanvas, documentRef.baseURI, imageCache);
  drawExportFooter(ctx, width, height, { domain, repoUrl, snapshotDate, generatedAt });

  return output;
}

export async function exportBracketSnapshot({
  canvasSelector = '#bracket-canvas',
  documentRef = document,
  domain = 'worldcup.inathan.wang',
  repoUrl = 'https://github.com/iNathan-yanboo/world-cup-knockout-bracket',
  snapshotDate = '未知',
  generatedAt = new Date()
} = {}) {
  const sourceCanvas = documentRef.querySelector(canvasSelector);
  const { width, height } = resolveCanvasSize(sourceCanvas);
  const output = await renderSnapshotCanvas(sourceCanvas, {
    documentRef,
    width,
    height,
    domain,
    repoUrl,
    snapshotDate,
    generatedAt
  });

  const pngBlob = await canvasToBlob(output);
  const filename = buildSnapshotFilename(generatedAt);

  downloadBlob(pngBlob, filename, documentRef);

  return { filename, width, height: output.height };
}
