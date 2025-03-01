export interface VITSOptions {
    text: string; // 需要合成语音的文本
    id?: number; // 说话人id
    format?: string; // 音频格式，支持wav,ogg,silk,mp3,flac
    lang?: string; // 文本语言，auto为自动识别语言模式，lang=mix时，文本应该用[ZH] 或 [JA] 包裹
    length?: number; // 语音长度/语速，调节语音长度，相当于调节语速，该数值越大语速越慢
    noise?: number; // 样本噪声，控制合成的随机性
    noisew?: number; // 随机时长预测器噪声，控制音素发音长度
    segment_size?: number; // 分段阈值，按标点符号分段，加起来大于segment_size时为一段文本，segment_size<=0表示不分段
    streaming?: boolean; // 流式合成语音，更快的首包响应
  }
  
  export interface GPTSOVITSOptions extends VITSOptions {
    reference_audio?: any; // 参考音频
    text_prompt?: string; // 参考音频提示词
    prompt_text?: string; // 文本提示词，GPT-SO-VITS 参考文本
    prompt_lang?: string; // 文本提示词语言，GPT-SO-VITS 参考文本语言
  }
  
  export type Lang = 'zh' | 'en' | 'fr' | 'ja' | 'ru' | 'de' | 'sh'
  export type Speaker = {
    id: number,
    lang: Lang[],
    name: string
  }
  
  export type VitsEngine = "GPT-SOVITS"
  export type SpeakerList = {
    [key in VitsEngine]: Speaker[];
  }
  
  export type T4wefanText = {
    help: string,
    waiting: string,
    'too-long': string
  }
  
  export type AudioMime = 'audio/mpeg' | 'audio/wav' | 'audio/ogg' | 'audio/aac' | 'audio/flac'
  