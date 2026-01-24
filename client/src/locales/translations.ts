// 多语言翻译配置
export const translations = {
  zh: {
    // 导航菜单
    nav: {
      history: '历史溯源',
      survey: '现状与测绘',
      blueprint: '蓝图规划',
      interaction: '交互复原',
    },
    // 主页
    home: {
      title: '西安隋唐天坛',
      subtitle: '全息影像设计与交互实现',
    },
    // 手势交互页面
    gesture: {
      title: '手势交互',
      subtitle: 'GESTURE INTERACTION',
      help: '帮助',
      openHand: '张开手掌 - 粒子消散',
      closedHand: '握拳 - 粒子聚合',
      moveHand: '移动手掌控制旋转',
      cameraStatus: '摄像头状态',
      loadingModel: '正在加载模型...',
      initializingGesture: '正在初始化手势识别...',
      cameraEnabled: '摄像头已启用',
      cameraDisabled: '摄像头未启用',
      startTracking: '启动手势追踪',
      stopTracking: '停止追踪',
      modelLoadError: '模型加载失败',
      modelLoadErrorMsg: '模型文件加载失败，可能是网络问题。请检查网络连接后重试。',
      retry: '重新加载',
    },
    // 历史页面
    history: {
      title: '历史溯源',
      subtitle: 'HISTORY',
    },
    // 测绘页面
    survey: {
      title: '现状与测绘',
      subtitle: 'SURVEY',
    },
    // 蓝图页面
    blueprint: {
      title: '蓝图规划',
      subtitle: 'BLUEPRINT',
    },
    // 交互页面
    interactionPage: {
      title: '交互复原',
      subtitle: 'INTERACTION',
    },
    // 通用
    common: {
      about: '关于',
      soundOn: '开启音效',
      soundOff: '关闭音效',
      backToHome: '返回主页',
      copyright: '西安隋唐天坛全息影像设计与交互实现 © 2026',
    },
  },
  en: {
    // Navigation menu
    nav: {
      history: 'History',
      survey: 'Survey',
      blueprint: 'Blueprint',
      interaction: 'Interaction',
    },
    // Home page
    home: {
      title: 'Xi\'an Suiyuan Tiantan',
      subtitle: 'Holographic Image Design and Interactive Implementation',
    },
    // Gesture interaction page
    gesture: {
      title: 'Gesture Interaction',
      subtitle: 'GESTURE INTERACTION',
      help: 'Help',
      openHand: 'Open Hand - Particles Disperse',
      closedHand: 'Closed Hand - Particles Gather',
      moveHand: 'Move Hand to Control Rotation',
      cameraStatus: 'Camera Status',
      loadingModel: 'Loading Model...',
      initializingGesture: 'Initializing Gesture Recognition...',
      cameraEnabled: 'Camera Enabled',
      cameraDisabled: 'Camera Disabled',
      startTracking: 'Start Gesture Tracking',
      stopTracking: 'Stop Tracking',
      modelLoadError: 'Model Load Failed',
      modelLoadErrorMsg: 'Failed to load model file, possibly due to network issues. Please check your network connection and try again.',
      retry: 'Retry',
    },
    // History page
    history: {
      title: 'History',
      subtitle: 'HISTORY',
    },
    // Survey page
    survey: {
      title: 'Survey',
      subtitle: 'SURVEY',
    },
    // Blueprint page
    blueprint: {
      title: 'Blueprint',
      subtitle: 'BLUEPRINT',
    },
    // Interaction page
    interactionPage: {
      title: 'Interaction',
      subtitle: 'INTERACTION',
    },
    // Common
    common: {
      about: 'About',
      soundOn: 'Sound On',
      soundOff: 'Sound Off',
      backToHome: 'Back to Home',
      copyright: 'Xi\'an Suiyuan Tiantan Holographic Image Design and Interactive Implementation © 2026',
    },
  },
};

export type Language = 'zh' | 'en';
export type TranslationKey = keyof typeof translations.zh;
