// ══════════════════════════════════════════════════════════════════════════════
// 🎵 遊戲音效系統 - 使用 Web Audio API 合成
// 直接嵌入到 index.html 中
// ══════════════════════════════════════════════════════════════════════════════

const SFX = {
  // 全局音頻上下文（延遲初始化）
  ctx: null,
  enabled: true,
  masterVolume: 0.5,
  
  // 初始化音頻上下文
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.ctx;
  },
  
  // 💥 劍擊 - 金屬切割聲
  sword(vol = 0.7) {
    if (!this.enabled) return;
    const ctx = this.init();
    const now = ctx.currentTime;
    
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    
    // 帶通濾波器 - 模擬金屬聲
    f.type = 'bandpass';
    f.frequency.value = 1200;
    f.Q.value = 0.8;
    
    o.connect(f);
    f.connect(g);
    g.connect(ctx.destination);
    
    // 鋸齒波 - 明亮的金屬感
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(900, now);
    o.frequency.exponentialRampToValueAtTime(200, now + 0.08);
    
    // 音量衰減
    g.gain.setValueAtTime(vol * this.masterVolume, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    
    o.start();
    o.stop(now + 0.12);
  },
  
  // 🔥 火焰攻擊 - 嗤嗤聲 + 低頻轟鳴
  fire(vol = 0.6) {
    if (!this.enabled) return;
    const ctx = this.init();
    const now = ctx.currentTime;
    
    // 高頻嗤嗤聲
    const hiss = ctx.createOscillator();
    const hissGain = ctx.createGain();
    const hissFilter = ctx.createBiquadFilter();
    
    hissFilter.type = 'highpass';
    hissFilter.frequency.value = 2000;
    
    hiss.connect(hissFilter);
    hissFilter.connect(hissGain);
    hissGain.connect(ctx.destination);
    
    hiss.type = 'square';
    hiss.frequency.setValueAtTime(2200, now);
    hiss.frequency.exponentialRampToValueAtTime(1000, now + 0.15);
    
    hissGain.gain.setValueAtTime(vol * 0.6 * this.masterVolume, now);
    hissGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    // 低頻轟鳴
    const bass = ctx.createOscillator();
    const bassGain = ctx.createGain();
    
    bass.connect(bassGain);
    bassGain.connect(ctx.destination);
    
    bass.type = 'sine';
    bass.frequency.setValueAtTime(150, now);
    bass.frequency.exponentialRampToValueAtTime(80, now + 0.2);
    
    bassGain.gain.setValueAtTime(vol * 0.4 * this.masterVolume, now);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    
    hiss.start();
    hiss.stop(now + 0.15);
    bass.start();
    bass.stop(now + 0.2);
  },
  
  // ❄️ 冰凍攻擊 - 尖銳刺痛聲
  ice(vol = 0.65) {
    if (!this.enabled) return;
    const ctx = this.init();
    const now = ctx.currentTime;
    
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    
    f.type = 'bandpass';
    f.frequency.value = 2800;
    f.Q.value = 1.5;
    
    o.connect(f);
    f.connect(g);
    g.connect(ctx.destination);
    
    o.type = 'sine';
    o.frequency.setValueAtTime(1800, now);
    o.frequency.exponentialRampToValueAtTime(800, now + 0.1);
    
    g.gain.setValueAtTime(vol * this.masterVolume, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    
    o.start();
    o.stop(now + 0.1);
  },
  
  // ⚡ 閃電攻擊 - 電流聲
  lightning(vol = 0.7) {
    if (!this.enabled) return;
    const ctx = this.init();
    const now = ctx.currentTime;
    
    // 多個頻率的疊加
    for (let i = 0; i < 3; i++) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const f = ctx.createBiquadFilter();
      
      f.type = 'highpass';
      f.frequency.value = 3000 + i * 500;
      
      o.connect(f);
      f.connect(g);
      g.connect(ctx.destination);
      
      o.type = 'square';
      const freq = 400 + i * 150;
      o.frequency.setValueAtTime(freq, now);
      o.frequency.exponentialRampToValueAtTime(freq * 0.3, now + 0.08);
      
      g.gain.setValueAtTime(vol * 0.3 * this.masterVolume, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      
      o.start();
      o.stop(now + 0.08);
    }
  },
  
  // 💚 治療/恢復 - 溫和的鈴聲
  heal(vol = 0.5) {
    if (!this.enabled) return;
    const ctx = this.init();
    const now = ctx.currentTime;
    
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    
    o.connect(g);
    g.connect(ctx.destination);
    
    o.type = 'sine';
    // 和諧的頻率
    o.frequency.setValueAtTime(800, now);
    o.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
    o.frequency.exponentialRampToValueAtTime(600, now + 0.2);
    
    g.gain.setValueAtTime(vol * this.masterVolume, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    
    o.start();
    o.stop(now + 0.2);
  },
  
  // 💣 爆裂/撞擊 - 低頻沉悶聲
  impact(vol = 0.8) {
    if (!this.enabled) return;
    const ctx = this.init();
    const now = ctx.currentTime;
    
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    
    f.type = 'lowpass';
    f.frequency.value = 800;
    
    o.connect(f);
    f.connect(g);
    g.connect(ctx.destination);
    
    o.type = 'sine';
    o.frequency.setValueAtTime(300, now);
    o.frequency.exponentialRampToValueAtTime(50, now + 0.15);
    
    g.gain.setValueAtTime(vol * this.masterVolume, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    o.start();
    o.stop(now + 0.15);
  },
  
  // ✨ 魔法/光線 - 高亮的魔法聲
  magic(vol = 0.6) {
    if (!this.enabled) return;
    const ctx = this.init();
    const now = ctx.currentTime;
    
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    
    o.connect(g);
    g.connect(ctx.destination);
    
    o.type = 'triangle';
    o.frequency.setValueAtTime(2000, now);
    o.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
    
    g.gain.setValueAtTime(vol * this.masterVolume, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    
    o.start();
    o.stop(now + 0.2);
  },
  
  // 😵 暈眩/眩暈 - 旋轉感聲音
  stun(vol = 0.6) {
    if (!this.enabled) return;
    const ctx = this.init();
    const now = ctx.currentTime;
    
    for (let i = 0; i < 2; i++) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      
      o.connect(g);
      g.connect(ctx.destination);
      
      o.type = 'sine';
      const baseFreq = 600 + i * 200;
      o.frequency.setValueAtTime(baseFreq, now);
      o.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.1);
      
      g.gain.setValueAtTime(vol * 0.5 * this.masterVolume, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      
      o.start();
      o.stop(now + 0.1);
    }
  },
  
  // 🎯 暴擊 - 高亮的金屬聲 + 衝擊
  crit(vol = 0.85) {
    if (!this.enabled) return;
    const ctx = this.init();
    const now = ctx.currentTime;
    
    // 金屬高音
    const metal = ctx.createOscillator();
    const metalGain = ctx.createGain();
    const metalFilter = ctx.createBiquadFilter();
    
    metalFilter.type = 'bandpass';
    metalFilter.frequency.value = 1600;
    metalFilter.Q.value = 1.0;
    
    metal.connect(metalFilter);
    metalFilter.connect(metalGain);
    metalGain.connect(ctx.destination);
    
    metal.type = 'sawtooth';
    metal.frequency.setValueAtTime(1400, now);
    metal.frequency.exponentialRampToValueAtTime(400, now + 0.12);
    
    metalGain.gain.setValueAtTime(vol * 0.7 * this.masterVolume, now);
    metalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    
    // 低頻衝擊
    const impact = ctx.createOscillator();
    const impactGain = ctx.createGain();
    
    impact.connect(impactGain);
    impactGain.connect(ctx.destination);
    
    impact.type = 'sine';
    impact.frequency.setValueAtTime(200, now);
    impact.frequency.exponentialRampToValueAtTime(50, now + 0.1);
    
    impactGain.gain.setValueAtTime(vol * 0.5 * this.masterVolume, now);
    impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    
    metal.start();
    metal.stop(now + 0.12);
    impact.start();
    impact.stop(now + 0.1);
  },
  
  // ❌ 閃躲/防禦 - 輕快的叮聲
  dodge(vol = 0.4) {
    if (!this.enabled) return;
    const ctx = this.init();
    const now = ctx.currentTime;
    
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    
    o.connect(g);
    g.connect(ctx.destination);
    
    o.type = 'sine';
    o.frequency.setValueAtTime(1200, now);
    o.frequency.exponentialRampToValueAtTime(800, now + 0.08);
    
    g.gain.setValueAtTime(vol * this.masterVolume, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    
    o.start();
    o.stop(now + 0.08);
  },
  
  // 😵 死亡/消失 - 低沉衰減聲
  death(vol = 0.7) {
    if (!this.enabled) return;
    const ctx = this.init();
    const now = ctx.currentTime;
    
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    
    o.connect(g);
    g.connect(ctx.destination);
    
    o.type = 'sine';
    o.frequency.setValueAtTime(500, now);
    o.frequency.exponentialRampToValueAtTime(100, now + 0.3);
    
    g.gain.setValueAtTime(vol * this.masterVolume, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    o.start();
    o.stop(now + 0.3);
  },
  
  // 🔊 設定主音量 (0-1)
  setVolume(vol) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
  },
  
  // 🔇 開/關音效
  toggle(enabled) {
    this.enabled = enabled;
  }
};
