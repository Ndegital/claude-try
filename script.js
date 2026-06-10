// 福岡県 観光地データ（緯度経度・滞在目安時間）
const SPOTS = [
  { id: 's1', name: '太宰府天満宮', area: '太宰府', lat: 33.5215, lng: 130.5347, visit: 90, desc: '学問の神様を祀る歴史ある神社' },
  { id: 's2', name: '福岡タワー', area: '百道浜', lat: 33.5933, lng: 130.3514, visit: 60, desc: '福岡市のシンボルタワーから絶景を一望' },
  { id: 's3', name: '中洲屋台街', area: '中洲', lat: 33.5928, lng: 130.4036, visit: 120, desc: '博多名物の屋台が並ぶグルメスポット' },
  { id: 's4', name: '大濠公園', area: '大濠', lat: 33.5868, lng: 130.3795, visit: 60, desc: '池を囲む散策が楽しめる都市公園' },
  { id: 's5', name: 'マリンワールド海の中道', area: '海の中道', lat: 33.6520, lng: 130.3340, visit: 150, desc: '九州最大級の水族館' },
  { id: 's6', name: '糸島の海岸', area: '糸島', lat: 33.5489, lng: 130.1925, visit: 60, desc: '夫婦岩や絶景カフェが人気のエリア' },
  { id: 's7', name: '福岡城跡（舞鶴公園）', area: '大濠', lat: 33.5870, lng: 130.3787, visit: 60, desc: '桜の名所としても有名な城跡' },
  { id: 's8', name: 'キャナルシティ博多', area: '博多', lat: 33.5897, lng: 130.4106, visit: 90, desc: 'ショッピングと噴水ショーが楽しめる複合施設' },
  { id: 's9', name: '門司港レトロ', area: '門司港', lat: 33.9433, lng: 130.9633, visit: 120, desc: '大正ロマン漂うレトロな港町' },
  { id: 's10', name: '柳川川下り', area: '柳川', lat: 33.1622, lng: 130.3997, visit: 90, desc: '舟に乗って水郷柳川を巡る人気アクティビティ' },
  { id: 's11', name: '櫛田神社', area: '博多', lat: 33.5933, lng: 130.4108, visit: 45, desc: '博多祇園山笠で知られる総鎮守' },
  { id: 's12', name: '福岡市動植物園', area: '南公園', lat: 33.5736, lng: 130.3953, visit: 120, desc: '動物園と植物園が一体になった施設' },
  { id: 's13', name: '能古島', area: '能古島', lat: 33.6394, lng: 130.3219, visit: 120, desc: 'フェリーで渡れる花畑が美しい離島' },
  { id: 's14', name: '海の中道海浜公園', area: '海の中道', lat: 33.6444, lng: 130.3306, visit: 120, desc: '花畑やアスレチックが楽しめる広大な公園' }
];

// 福岡県 宿泊施設データ（1泊あたりの料金）
const HOTELS = [
  { id: 'h1', name: '博多駅前ビジネスホテル', area: '博多駅周辺', lat: 33.5897, lng: 130.4205, price: 6000, desc: '新幹線アクセス抜群のリーズナブルなホテル' },
  { id: 'h2', name: '天神シティホテル', area: '天神', lat: 33.5902, lng: 130.3989, price: 9500, desc: '繁華街天神の中心に位置する都市型ホテル' },
  { id: 'h3', name: '中洲リバーサイドホテル', area: '中洲', lat: 33.5938, lng: 130.4080, price: 7500, desc: '屋台街まで徒歩圏内のホテル' },
  { id: 'h4', name: '福岡タワー近くシーサイドホテル', area: '百道浜', lat: 33.5950, lng: 130.3520, price: 12000, desc: '海と夜景を楽しめるリゾートホテル' },
  { id: 'h5', name: '太宰府温泉旅館', area: '太宰府', lat: 33.5180, lng: 130.5300, price: 15000, desc: '天然温泉付きの和風旅館' },
  { id: 'h6', name: '糸島オーシャンビューホテル', area: '糸島', lat: 33.5500, lng: 130.1950, price: 11000, desc: '海を一望できるオーシャンビューの客室' },
  { id: 'h7', name: 'キャナルシティ直結ホテル', area: '博多', lat: 33.5895, lng: 130.4110, price: 10000, desc: 'ショッピングモールに直結した便利な立地' }
];

// 出発・帰着の基準地点（博多駅）
const HAKATA = { name: '博多駅', lat: 33.5897, lng: 130.4205 };

// 状態管理
const state = {
  nights: 1,
  budget: 20000,
  selectedSpots: [],
  selectedHotels: []
};

// ===== 画面遷移 =====
function showStep(stepNum) {
  document.querySelectorAll('.step-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById('step' + stepNum).classList.add('active');
  document.querySelectorAll('.step-indicator').forEach(ind => {
    ind.classList.toggle('active', Number(ind.dataset.step) === stepNum);
  });
}

// ===== 距離計算（ハーバサイン公式） =====
function distanceKm(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

// 移動時間（分）：平均時速25kmと仮定
function travelMinutes(a, b) {
  const km = distanceKm(a, b);
  return Math.max(5, Math.round((km / 25) * 60));
}

// ===== 最近傍法によるルート生成 =====
function nearestNeighborRoute(start, points) {
  const remaining = [...points];
  const route = [];
  let current = start;
  while (remaining.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;
    remaining.forEach((p, i) => {
      const d = distanceKm(current, p);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    });
    const next = remaining.splice(nearestIdx, 1)[0];
    route.push(next);
    current = next;
  }
  return route;
}

// ===== Step1: 観光地リスト描画 =====
function renderSpotList() {
  const list = document.getElementById('spotList');
  list.innerHTML = '';
  SPOTS.forEach(spot => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = spot.id;
    if (state.selectedSpots.includes(spot.id)) card.classList.add('selected');
    card.innerHTML = `
      <h3>${spot.name}</h3>
      <p>エリア: ${spot.area}</p>
      <p>${spot.desc}</p>
      <p>滞在目安: 約${spot.visit}分</p>
    `;
    card.addEventListener('click', () => {
      const idx = state.selectedSpots.indexOf(spot.id);
      if (idx >= 0) {
        state.selectedSpots.splice(idx, 1);
        card.classList.remove('selected');
      } else {
        state.selectedSpots.push(spot.id);
        card.classList.add('selected');
      }
    });
    list.appendChild(card);
  });
}

// ===== Step2: 宿泊施設リスト描画 =====
function renderHotelList() {
  const list = document.getElementById('hotelList');
  list.innerHTML = '';
  const nights = Math.max(state.nights, 1);
  HOTELS.forEach(hotel => {
    const total = hotel.price * nights;
    const over = total > state.budget;
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = hotel.id;
    if (state.selectedHotels.includes(hotel.id)) card.classList.add('selected');
    card.innerHTML = `
      <h3>${hotel.name}</h3>
      <p>エリア: ${hotel.area}</p>
      <p>${hotel.desc}</p>
      <p>1泊: ${hotel.price.toLocaleString()}円 / ${nights}泊合計: ${total.toLocaleString()}円</p>
      <span class="badge ${over ? 'over' : ''}">${over ? '予算オーバー' : '予算内'}</span>
    `;
    card.addEventListener('click', () => {
      const idx = state.selectedHotels.indexOf(hotel.id);
      if (idx >= 0) {
        state.selectedHotels.splice(idx, 1);
        card.classList.remove('selected');
      } else {
        state.selectedHotels.push(hotel.id);
        card.classList.add('selected');
      }
    });
    list.appendChild(card);
  });
}

// ===== 配列を指定数のチャンクに分割 =====
function splitIntoChunks(arr, numChunks) {
  const chunks = Array.from({ length: numChunks }, () => []);
  arr.forEach((item, i) => {
    chunks[i % numChunks].push(item);
  });
  return chunks;
}

// ===== 時刻フォーマット（分→HH:MM） =====
function formatTime(minutes) {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// ===== スケジュール生成 =====
function generateSchedule() {
  const selectedSpots = SPOTS.filter(s => state.selectedSpots.includes(s.id));
  const selectedHotels = HOTELS.filter(h => state.selectedHotels.includes(h.id));
  const isDayTrip = state.nights <= 0;
  const days = isDayTrip ? 1 : state.nights + 1;

  // 観光地を日数分のチャンクに振り分け（移動効率を考え、エリア順にソートしてから分割）
  const sortedSpots = [...selectedSpots].sort((a, b) => {
    const da = distanceKm(HAKATA, a);
    const db = distanceKm(HAKATA, b);
    return da - db;
  });
  const chunks = splitIntoChunks(sortedSpots, days);

  const dayPlans = [];
  let totalDistance = 0;
  let totalTravelMinutes = 0;

  for (let d = 0; d < days; d++) {
    const startPoint = d === 0 ? HAKATA : selectedHotels[(d - 1) % selectedHotels.length] || HAKATA;
    let endPoint = HAKATA;
    let hotelForNight = null;
    if (!isDayTrip && d < state.nights) {
      hotelForNight = selectedHotels[d % selectedHotels.length] || null;
      endPoint = hotelForNight || HAKATA;
    }

    const route = nearestNeighborRoute(startPoint, chunks[d]);

    // タイムライン構築
    const timeline = [];
    let currentTime = 9 * 60; // 9:00開始
    let currentLoc = startPoint;

    timeline.push({
      type: 'start',
      time: currentTime,
      name: d === 0 ? `${HAKATA.name}を出発` : `${currentLoc.name}を出発`
    });

    route.forEach(spot => {
      const tMin = travelMinutes(currentLoc, spot);
      const dist = distanceKm(currentLoc, spot);
      totalDistance += dist;
      totalTravelMinutes += tMin;
      currentTime += tMin;
      timeline.push({
        type: 'travel',
        minutes: tMin,
        distance: dist
      });
      timeline.push({
        type: 'spot',
        time: currentTime,
        name: spot.name,
        meta: `滞在約${spot.visit}分 / ${spot.area} / ${spot.desc}`
      });
      currentTime += spot.visit;
      currentLoc = spot;
    });

    // 終点（宿泊施設 or 博多駅）への移動
    const finalTravel = travelMinutes(currentLoc, endPoint);
    const finalDist = distanceKm(currentLoc, endPoint);
    totalDistance += finalDist;
    totalTravelMinutes += finalTravel;
    currentTime += finalTravel;
    timeline.push({
      type: 'travel',
      minutes: finalTravel,
      distance: finalDist
    });

    if (isDayTrip) {
      timeline.push({
        type: 'end',
        time: currentTime,
        name: `${endPoint.name}に到着（解散）`
      });
    } else {
      timeline.push({
        type: 'end',
        time: currentTime,
        name: hotelForNight ? `${hotelForNight.name}にチェックイン` : `${endPoint.name}に到着`,
        meta: hotelForNight ? `${hotelForNight.area} / 1泊${hotelForNight.price.toLocaleString()}円` : ''
      });
    }

    dayPlans.push({ dayNumber: d + 1, timeline });
  }

  return { dayPlans, totalDistance, totalTravelMinutes, selectedHotels, isDayTrip, days };
}

// ===== Step3: スケジュール描画 =====
function renderSchedule() {
  const { dayPlans, totalDistance, totalTravelMinutes, selectedHotels, isDayTrip, days } = generateSchedule();

  const accommodationCost = isDayTrip
    ? 0
    : selectedHotels.length > 0
      ? splitIntoChunks(Array.from({ length: state.nights }, (_, i) => i), selectedHotels.length)
          .reduce((sum, chunk, hIdx) => sum + chunk.length * selectedHotels[hIdx].price, 0)
      : 0;

  const summary = document.getElementById('summary');
  summary.innerHTML = `
    <strong>旅行プラン概要</strong><br>
    日数: ${isDayTrip ? '日帰り' : `${state.nights}泊${state.nights + 1}日`}<br>
    観光地数: ${state.selectedSpots.length}か所<br>
    総移動距離: 約${totalDistance.toFixed(1)}km（移動時間 約${totalTravelMinutes}分）<br>
    宿泊費合計: ${accommodationCost.toLocaleString()}円（予算: ${state.budget.toLocaleString()}円）
    ${accommodationCost > state.budget ? '<span style="color:#d63031;font-weight:bold;"> ※予算オーバーです</span>' : ''}
  `;

  const scheduleEl = document.getElementById('schedule');
  scheduleEl.innerHTML = '';

  dayPlans.forEach(plan => {
    const block = document.createElement('div');
    block.className = 'day-block';

    const header = document.createElement('div');
    header.className = 'day-header';
    header.textContent = `${plan.dayNumber}日目`;
    block.appendChild(header);

    const body = document.createElement('div');
    body.className = 'day-body';

    plan.timeline.forEach(item => {
      if (item.type === 'travel') {
        const leg = document.createElement('div');
        leg.className = 'travel-leg';
        leg.textContent = `↓ 移動 約${item.minutes}分（約${item.distance.toFixed(1)}km）`;
        body.appendChild(leg);
      } else {
        const row = document.createElement('div');
        row.className = 'timeline-item';
        row.innerHTML = `
          <div class="timeline-time">${formatTime(item.time)}</div>
          <div class="timeline-content">
            <strong>${item.name}</strong>
            ${item.meta ? `<span class="meta">${item.meta}</span>` : ''}
          </div>
        `;
        body.appendChild(row);
      }
    });

    block.appendChild(body);
    scheduleEl.appendChild(block);
  });
}

// ===== イベント設定 =====
document.getElementById('toStep2').addEventListener('click', () => {
  const nights = Number(document.getElementById('nights').value);
  const budget = Number(document.getElementById('budget').value);
  if (isNaN(nights) || nights < 0) {
    alert('宿泊日数を正しく入力してください');
    return;
  }
  if (isNaN(budget) || budget < 0) {
    alert('予算を正しく入力してください');
    return;
  }
  state.nights = nights;
  state.budget = budget;
  renderSpotList();
  showStep(2);
});

document.getElementById('backToStep1').addEventListener('click', () => showStep(1));

document.getElementById('toStep3').addEventListener('click', () => {
  if (state.selectedSpots.length === 0) {
    alert('観光地を1つ以上選択してください');
    return;
  }
  renderHotelList();
  showStep(3);
});

document.getElementById('backToStep2').addEventListener('click', () => showStep(2));

document.getElementById('toStep4').addEventListener('click', () => {
  if (state.nights > 0 && state.selectedHotels.length === 0) {
    alert('宿泊施設を1つ以上選択してください');
    return;
  }
  renderSchedule();
  showStep(4);
});

document.getElementById('backToStep3').addEventListener('click', () => showStep(3));

document.getElementById('restart').addEventListener('click', () => {
  state.selectedSpots = [];
  state.selectedHotels = [];
  document.getElementById('nights').value = 1;
  document.getElementById('budget').value = 20000;
  showStep(1);
});
