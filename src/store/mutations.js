import { 
  ADD_CART,
  ADD_ANIMATION,
  SHOW_CART,
  INIT_BUYCART,
  GET_USERINFO,
  RECORD_USERINFO,
  REDUCE_CART,
  EDIT_CART
 } from "./mutation-types";
 import { setStore,getStore } from "../util/storage";
 export default {
   // 网页初始化时从本地缓存获取购物车数据
  [INIT_BUYCART] (state) {
    let initCart = getStore('buyCart')
    if (initCart) {
      state.cartList = JSON.parse(initCart)
    }
  },
  [ADD_CART] (state, {id, goodsPrice, goodsName, goodsUrl, buyQuantity = 1}) {
    let cart = state.cartList // 购物车
    let falg = true
    let goods = {
      id,
      goodsPrice,
      goodsName,
      goodsUrl
    }
    if (cart.length) {        // 有内容
      cart.forEach(item => {
        if (item.id === id) {
          if (item.buyQuantity >= 0) {
            falg = false
            item.buyQuantity += buyQuantity
          }
        }
      })
    }
    if (!cart.length || falg) {
      goods.buyQuantity = buyQuantity
      goods.checked = '1'
      cart.push(goods)
    }
    state.cartList = cart
    // 存入localStorage
    setStore('buyCart', cart)
  },
  // 加入购物车动画
  [ADD_ANIMATION] (state, {moveShow, elLeft, elTop, img, cartPositionT, cartPositionL, receiveInCart}) {
    state.showMoveImg = moveShow
    if (elLeft) {
      state.elLeft = elLeft
      state.elTop = elTop
    }
    state.moveImgUrl = img
    state.receiveInCart = receiveInCart
    if (cartPositionT) {
      state.cartPositionT = cartPositionT
      state.cartPositionL = cartPositionL
    }
  },
  // 是否显示购物车
  [SHOW_CART] (state, {showCart}) {
    state.showCart = showCart
  },
  // 移除商品
  [REDUCE_CART] (state, {productId}) {
    let cart = state.cartList
    cart.forEach((item, i) => {
      if (item.productId === productId) {
        if (item.productNum > 1) {
          item.productNum--
        } else {
          cart.splice(i, 1)
        }
      }
    })
    state.cartList = cart
    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
  // 修改购物车
  [EDIT_CART] (state, {productId, productNum, checked}) {
    let cart = state.cartList
    if (productNum) {
      cart.forEach((item, i) => {
        if (item.productId === productId) {
          item.productNum = productNum
          item.checked = checked
        }
      })
    } else if (productId) {
      cart.forEach((item, i) => {
        if (item.productId === productId) {
          cart.splice(i, 1)
        }
      })
    } else {
      cart.forEach((item) => {
        item.checked = checked ? '1' : '0'
      })
    }
    state.cartList = cart
    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
   // 记录用户信息
   [RECORD_USERINFO] (state, info) {
    state.userInfo = info
    state.login = true
    setStore('userInfo', info)
  },
  // 获取用户信息
  [GET_USERINFO] (state, info) {
    if (state.userInfo && (state.userInfo.username !== info.username)) {
      return
    }
    if (!state.login) {
      return
    }
    if (!info.message) {
      state.userInfo = {...info}
    } else {
      state.userInfo = null
    }
  }
 }

