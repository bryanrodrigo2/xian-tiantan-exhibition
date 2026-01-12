// 音效控制器 - 使用 Web Audio API 合成古风音效

class SoundController {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    // 懒加载 AudioContext，因为浏览器要求必须在用户交互后才能启动音频上下文
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.context = new AudioContextClass();
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.context.destination);
        this.masterGain.gain.value = 0.3; // 全局音量
      }
    } catch (e) {
      console.error("Web Audio API not supported", e);
    }
  }

  // 确保 AudioContext 已启动
  private async ensureContext() {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  // 播放钟声 (悬停音效) - 模拟青铜编钟
  // 特点：泛音丰富，衰减长，音色清脆带金属感
  async playBell() {
    if (!this.context || !this.masterGain) return;
    await this.ensureContext();

    const t = this.context.currentTime;
    
    // 基频振荡器
    const osc1 = this.context.createOscillator();
    const gain1 = this.context.createGain();
    
    // 泛音振荡器 (模拟金属撞击的非谐波泛音)
    const osc2 = this.context.createOscillator();
    const gain2 = this.context.createGain();

    // 设置频率 - 选用五声音阶中的"宫"音 (C调)
    osc1.frequency.value = 523.25; // C5
    osc1.type = 'sine';
    
    osc2.frequency.value = 523.25 * 1.5; // 纯五度泛音
    osc2.type = 'triangle'; // 三角波增加金属质感

    // 包络控制 (ADSR)
    // 钟声特点：起音快(Attack)，衰减慢(Decay/Release)
    gain1.gain.setValueAtTime(0, t);
    gain1.gain.linearRampToValueAtTime(0.5, t + 0.02); // 快速起音
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 1.5); // 悠长余音

    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(0.2, t + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.5); // 泛音衰减较快

    // 连接节点
    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(this.masterGain);
    gain2.connect(this.masterGain);

    // 播放
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 1.5);
    osc2.stop(t + 1.5);
  }

  // 播放鼓声 (点击音效) - 模拟战鼓
  // 特点：低频为主，起音极快，衰减快，有冲击力
  async playDrum() {
    if (!this.context || !this.masterGain) return;
    await this.ensureContext();

    const t = this.context.currentTime;

    // 鼓皮振动
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    // 噪音 (模拟鼓槌撞击声)
    const bufferSize = this.context.sampleRate * 0.1; // 0.1秒噪音
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.context.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.context.createGain();
    const noiseFilter = this.context.createBiquadFilter();

    // 鼓声频率包络 (Pitch Envelope) - 模拟鼓皮张力变化
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
    osc.type = 'sine';

    // 鼓声音量包络
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(1, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    // 噪音处理 (低通滤波)
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 800;
    noiseGain.gain.setValueAtTime(0.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

    // 连接
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    // 播放
    osc.start(t);
    noise.start(t);
    osc.stop(t + 0.3);
    noise.stop(t + 0.1);
  }
}

// 单例模式导出
export const sound = new SoundController();
