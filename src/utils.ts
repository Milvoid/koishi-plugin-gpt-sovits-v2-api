import { Quester, Session } from 'koishi'
import { AudioMime, GPTSOVITSOptions } from './types'

export async function getSpeakerList(http: Quester) {
  let speakers = await http.get('/voice/speakers')
  return speakers
}

// 撤回的方法
export async function recall(recall: boolean, recall_time: number, session: Session, messageId: string) {
  if (!recall) {
    return
  }
  new Promise(resolve => setTimeout(() => {
    session.bot.deleteMessage(session.channelId, messageId)
  }, recall_time))
}

export function optionsToFormData(obj: GPTSOVITSOptions): FormData {
  const formData = new FormData()
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
      formData.append(key, obj[key])
    }
  }
  return formData
}

export function getMimeTypeFromFilename(filename: string): AudioMime {
  const extension = filename.split('.').pop()?.toLowerCase()
  if (!extension) {
    return 'audio/wav'
  }
  switch (extension) {
    case 'mp3':
      return 'audio/mpeg'
    case 'wav':
      return 'audio/wav'
    case 'ogg':
      return 'audio/ogg'
    case 'aac':
      return 'audio/aac'
    case 'flac':
      return 'audio/flac'
    default:
      return 'audio/wav'
  }
}
