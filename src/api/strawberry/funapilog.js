import request from '@/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/strawberry/funapilog/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/strawberry/funapilog/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/strawberry/funapilog/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/strawberry/funapilog/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/strawberry/funapilog/submit',
    method: 'post',
    data: row
  })
}

