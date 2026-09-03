import request from "@/utils/request";

// 注册
export const userregister = ({username,password,repassword}) => {
  return request.post('/api/reg', {username,password,repassword})
}
// 登录
export const userlogin = ({username,password}) => {
  return request.post('/api/login', {username,password})
}
// 获得用户信息
export const getUserInfo = () => {
  return request.get('/my/userinfo')
}
// 更新用户信息
export const updateUserInfo = ({id,username,nickname,email}) => {
  return request.put('/my/userinfo', {id,username,nickname,email})
}
// 更新用户头像
export const updateUserAvatar = (avatar) => {
  return request.patch('/my/update/avatar', {avatar})
}
// 更新用户密码
export const updateUserPwd = ({old_pwd,new_pwd,re_pwd}) => {
  return request.patch('/my/updatepwd', {old_pwd,new_pwd,re_pwd})
}
