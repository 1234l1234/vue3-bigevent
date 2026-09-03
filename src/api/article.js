import request from '@/utils/request'
// 获取文章分类列表
export const getArticleList = () => {
  return request.get('/my/cate/list')
}
// 新增文章分类
export const addArticle = ( data ) => {
  return request.post('/my/cate/add', data)
}
// 更新文章分类
export const editArticle = ( data ) => {
  return request.put('/my/cate/info', data)
}
// 删除文章分类
export const delArticle = ( id ) => {
  return request.delete('/my/cate/del', { params: { id } })
}


// 获取文章列表
export const getArticle = ( params ) => {
  return request.get('/my/article/list', { params })
}

// 发布文章  数据form-data格式
export const addArticleInfo = ( data ) => {
  return request.post('/my/article/add', data)
}
// 根据ID删除文章
export const deleteArticle = ( id ) => {
  return request.delete('/my/article/info', { params: { id } })
}
// 根据ID获取文章详情
export const getArticleDetail = (id) =>
  request.get('my/article/info', { params: { id } })

// 根据ID更新文章  数据form-data格式
export const updateArticleInfo = (data) =>
  request.put('/my/article/info', data)