const lazyload = (name) => (resolve) => require([`@/views/${name}`], resolve)

const changeTitle = (title) => {
  document.title = title
  document.body.scrollTop = 0
}
// const generaMenu = (routers, data) => {
//   data.forEach((item) => {
//     let menu = {
//       path: '/'+item['@id'].substring(2),
//       name: item['@id'].substring(2),
//       meta: {
//           title: item['@id'].substring(2)
//       },
//       component: lazyload(item['@view'].substring(8))
//     }
//     routers.push(menu)
//   })
// }
export {
  lazyload,
  changeTitle,
  // generaMenu
}