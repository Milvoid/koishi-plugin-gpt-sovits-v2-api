import { Context, h, Logger, Session, Quester } from 'koishi'
import { BaseConfigType, BaseConfig } from './config'

export const name: string = 'adapter-gpt-sovits'
export const logger: Logger = new Logger(name)

export class KoishiGptSovitsAPI {
  http: Quester
  baseConfig: BaseConfigType

  constructor(ctx: Context, config: BaseConfigType) {
    this.baseConfig = config
    this.http = ctx.http.extend({
      baseURL: config.endpoint,
    })

    ctx.command('say <input:text>', 'VITS 语音合成')
      .action(async ({ session }, input) => this.handleSay(session, input))
  }

  listModels() {
    return `可用的模型名称有：${this.baseConfig.models.map(model => model.model_name).join(', ')}`
  }

  async handleSay(session: Session, input: string) {
    if (!input) {
      return '请输入要合成的文本。'
    }

    input = input.trim()

    if (input === 'list' || input.toLowerCase() === 'say list') {
      return this.listModels()
    }

    let modelName: string | undefined
    let language = this.baseConfig.default_lang

    const modelMatch = input.match(/model#(\S+)/)
    if (modelMatch) {
      modelName = modelMatch[1]
      input = input.replace(modelMatch[0], '').trim()
    }

    const langMatch = input.match(/lang#(\S+)/)
    if (langMatch) {
      language = langMatch[1] as 'zh' | 'en' | 'jp'
      input = input.replace(langMatch[0], '').trim()
    }

    if (input.length > this.baseConfig.max_length) {
      return '输入文本过长，请减少文本长度。'
    }

    const modelConfig = this.baseConfig.models.find(model => model.model_name === modelName) || this.baseConfig.models[0]

    if (!modelConfig) {
      return `未找到可用的模型配置，请检查您指定的模型或使用 "say list" 命令查看可用模型。`
    }

    try {
      // 生成音频之前设置模型
      await this.http.get('/set_model', {
        params: {
          gpt_model_path: modelConfig.gpt_model_path,
          sovits_model_path: modelConfig.sovits_model_path,
        },
      })

      // 生成音频
      const response = await this.http.get('/', {
        params: {
          text: input,
          text_language: language,
          format: this.baseConfig.format,
          speech_length: this.baseConfig.speech_length,
          refer_wav_path: modelConfig.reference_audio,
          prompt_text: modelConfig.text_prompt,
          prompt_language: modelConfig.text_prompt_lang,
          cut_punc: this.baseConfig.cut_punc,
          top_k: this.baseConfig.top_k,
          top_p: this.baseConfig.top_p,
          temperature: this.baseConfig.temperature,
          speed: 1,
        },
        responseType: 'arraybuffer',
      })

      return h.audio(response, `audio/${this.baseConfig.format}`)
    } catch (error) {
      logger.error(error)
      return `在处理请求时发生错误：${error.message || error}`
    }
  }
}

export default KoishiGptSovitsAPI

export namespace KoishiGptSovitsAPI {
  export const Config = BaseConfig
}
