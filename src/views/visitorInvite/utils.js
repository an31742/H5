import { updateShareInfo } from '@/utils/share'
import { getWechatUser } from '@/api/visitorInvite'
export function setUserShare (userName, userId = '', shareId = '', expireTime) {
  getWechatUser().then(res => {
    if (res.code !== 200) return
    let origin = 'https://h5-user.gmtech.top'
    if (window.origin.indexOf('-test.') > 0) {
      origin = 'http://h5-user-test.fw.gmtech.top'
    }
    const shareUrl = `${origin}/inviteShare?app_id=${res.data.id}&userName=${userName}&expireTime=${expireTime}&userId=${userId}&shareId=${shareId}`

    updateShareInfo(null, {
      imgUrl: 'https://pms-static.gmtech.top/pubsrv/2020929/300c8aef-0225-11eb-b1cd-5254000429c2.png',
      link: shareUrl,
      desc: '接受邀请，立即开门',
      title: '邀请到访'
    })
  })
}
