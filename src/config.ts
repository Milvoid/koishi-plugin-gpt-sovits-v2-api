import { Schema } from "koishi"

interface ModelConfig {
  model_name: string
  gpt_model_path: string
  sovits_model_path: string
  reference_audio: string
  text_prompt: string
  text_prompt_lang: 'zh' | 'en' | 'jp'
}

export interface BaseConfigType {
  endpoint: string
  max_length: number
  waiting: boolean
  recall: boolean
  recall_time: number
  defaultEngine: 'GPT-SOVITS'
  models: ModelConfig[]  // 新增的数组属性，用于存储多个模型配置
  format: 'ogg' | 'wav' | 'amr' | 'mp3'
  default_lang: 'zh' | 'en' | 'jp'
  speech_length: number
  cut_punc: string
  top_k: number
  top_p: number
  temperature: number
}

export const BaseConfig: Schema<BaseConfigType> = Schema.intersect([
  Schema.object({
    defaultEngine: Schema.const('GPT-SOVITS').description('默认引擎'),
    max_length: Schema.number().default(256).description('最大长度'),
  }).description("基础配置"),
  Schema.object({
    endpoint: Schema.string().default('http://host.docker.internal:9880/').description('VITS 服务器地址'),
    models: Schema.array(
      Schema.object({
        model_name: Schema.string().description('模型名称'),
        gpt_model_path: Schema.string().description('GPT 模型文件路径'),
        sovits_model_path: Schema.string().description('SOVITS 模型文件路径'),
        reference_audio: Schema.string().description('参考音频路径'),
        text_prompt: Schema.string().description('参考音频文本'),
        text_prompt_lang: Schema.union([
          Schema.const('zh'),
          Schema.const('en'),
          Schema.const('jp'),
        ]).default('zh').description('参考音频文本语言'),
      }).role('table')
    ).default([]).description('模型配置列表'),
  }).description('GPT-SOVITS API 配置'),
  Schema.object({
    format: Schema.union([
      Schema.const('ogg'),
      Schema.const('wav'),
      Schema.const('amr'),
      Schema.const('mp3'),
    ]).default('mp3').description('生成音频格式'),
    default_lang: Schema.union([
      Schema.const('zh'),
      Schema.const('en'),
      Schema.const('jp'),
    ]).default('zh').description('默认生成音频语言，-lang 参数的回落值'),
    speech_length: Schema.number().role('slider').min(0).max(2).step(0.1).default(1.4).description('语速, 越大越慢'),
    cut_punc: Schema.string().default(',，.。!！?？').description('分割符'),
    top_k: Schema.number().default(15).description(''),
    top_p: Schema.number().default(1).description(''),
    temperature: Schema.number().default(1).description(''),
  }).description("参数设置"),
  Schema.object({
    waiting: Schema.boolean().default(true).description('消息反馈，会发送思考中...'),
    recall: Schema.boolean().default(true).description('会撤回思考中'),
    recall_time: Schema.number().default(5000).description('撤回的时间'),
  }).description("拓展设置"),
])
