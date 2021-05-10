/* eslint-disable */

const isServer = typeof window === 'undefined'

export default function (lang) {
  if (!isServer) {
    if (typeof window.shscBusinessUI !== 'undefined') {
      if (!('langs' in shscBusinessUI)) {
        shscBusinessUI.langs = {}
      }
      shscBusinessUI.langs[lang.b.locale] = lang
    }
  }
}
