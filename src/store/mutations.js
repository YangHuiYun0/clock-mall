import { 
  ADD_CART,
  ADD_ANIMATION,
  SHOW_CART
 } from "./mutation-types";
 import { setStore,getStore } from "../util/storage";
 export default {
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
 }