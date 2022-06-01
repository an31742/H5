import { Dialog, Toast } from 'vant'
import { putOrderStatus } from 'api/getHomeReclaim'
export const dialogConfirmPay = (orderId) => {
  return new Promise((resolve, reject) => {
    Dialog.confirm({
      title: '提示',
      message: '确认已完成支付吗？',
      confirmButtonColor: '#E1AA6C'
    }).then(() => {
      return putOrderStatus({
        order_id: orderId,
        action: 6
      })
    }).then((res) => {
      if (res.code !== 200) {
        Toast.fail(res.msg || '确认支付失败')
        reject(res)
      } else {
        Toast.success('确认支付成功')
        resolve()
      }
    }).catch((e) => {
      Toast.fail(e.msg || '确认支付失败')
      reject(e)
    })
  })
}

export const confirmSettlement = (orderId) => {
  return new Promise((resolve, reject) => {
    Dialog.confirm({
      title: '提示',
      message: '确认结算前，需确认已拿到佣金吗？',
      confirmButtonColor: '#E1AA6C'
    }).then(() => {
      return putOrderStatus({
        order_id: orderId,
        action: 9
      })
    }).then((res) => {
      if (res.code !== 200) {
        Toast.fail(res.msg || '确认结算失败')
        reject(res)
      } else {
        Toast.success('确认结算成功')
        resolve()
      }
    }).catch((e) => {
      Toast.fail(e.msg || '确认结算失败')
      reject(e)
    })
  })
}

export const confirmBack = (orderId) => {
  return new Promise((resolve, reject) => {
    Dialog.confirm({
      title: '提示',
      message: '确认客户已取回物品吗？',
      confirmButtonColor: '#E1AA6C'
    }).then(() => {
      return putOrderStatus({
        order_id: orderId,
        action: 11
      })
    }).then((res) => {
      if (res.code !== 200) {
        reject(res)
      }
      resolve()
    }).catch((e) => {
      reject(e)
    })
  })
}

export const confrimPickUp = (orderId, code) => {
  return new Promise((resolve, reject) => {
    putOrderStatus({
      order_id: orderId,
      action: 2,
      pick_up_code: code
    }).then((res) => {
      if (res.code === 200) {
        Toast.success('取件完成')
        resolve()
      } else {
        Toast.fail(res.msg || '取件失败')
        reject(res)
      }
    }).catch((e) => {
      Toast.fail(e.msg || '取件失败')
      reject(e)
    })
  })
}
